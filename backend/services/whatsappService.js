const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const db = require('../db');

let client;
let currentQR = null;
let status = 'DISCONNECTED'; // DISCONNECTED, QR_READY, AUTHENTICATING, CONNECTED
let isPaused = false;
let qrRefreshTimer = null;
let qrExpiresAt = null;
let pausedUntil = null;

function initialize() {
  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: { 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    }
  });

  client.on('qr', async (qr) => {
    try {
      currentQR = await qrcode.toDataURL(qr);
      status = 'QR_READY';
      qrExpiresAt = Date.now() + (4 * 60 * 1000);
      console.log('WhatsApp QR generated. Waiting for scan...');
      
      // Auto-refresh the QR code every 4 minutes (240000 ms) if not scanned
      if (qrRefreshTimer) clearTimeout(qrRefreshTimer);
      qrRefreshTimer = setTimeout(async () => {
        console.log('QR code expired. Restarting client to generate a new one...');
        if (status !== 'CONNECTED') {
          try {
            await client.destroy();
          } catch (e) {
            console.error('Error destroying client on timeout', e);
          }
          status = 'DISCONNECTED';
          currentQR = null;
          qrExpiresAt = null;
          initialize(); // Restart to generate new QR
        }
      }, 4 * 60 * 1000); // 4 minutes
      
    } catch (err) {
      console.error('Error generating QR code string', err);
    }
  });

  client.on('ready', () => {
    status = 'CONNECTED';
    currentQR = null;
    qrExpiresAt = null;
    if (qrRefreshTimer) {
      clearTimeout(qrRefreshTimer);
      qrRefreshTimer = null;
    }
    console.log('WhatsApp Client is ready!');
  });

  client.on('authenticated', () => {
    console.log('WhatsApp Client authenticated. Syncing...');
    status = 'AUTHENTICATING';
    currentQR = null;
    qrExpiresAt = null;
  });

  client.on('auth_failure', msg => {
    console.error('WhatsApp AUTH FAILURE', msg);
    status = 'DISCONNECTED';
    currentQR = null;
  });

  client.on('disconnected', (reason) => {
    console.log('WhatsApp Client was disconnected', reason);
    status = 'DISCONNECTED';
    currentQR = null;
    qrExpiresAt = null;
    // Client will usually try to reconnect or we might need to re-initialize.
    // For safety, we can re-initialize the client.
    setTimeout(initialize, 5000);
  });

  client.initialize().catch(err => console.error("WhatsApp Initialization Error:", err));
}

// Queue Processing logic
async function processQueue() {
  if (status !== 'CONNECTED' || isPaused) return;

  try {
    const [messages] = await db.query("SELECT * FROM whatsapp_queue WHERE status = 'pending' ORDER BY created_at ASC LIMIT 10");
    
    if (messages.length === 0) return;

    console.log(`Processing ${messages.length} WhatsApp messages...`);

    for (const msg of messages) {
      if (status !== 'CONNECTED' || isPaused) break; // Check again in case it disconnected during loop
      
      let formattedPhone = msg.phone.replace(/[^0-9]/g, '');
      // If it's exactly 10 digits (Standard Indian mobile number), auto-add '91'
      if (formattedPhone.length === 10) {
        formattedPhone = `91${formattedPhone}`;
      }
      const chatId = `${formattedPhone}@c.us`; // Basic formatting for international numbers
      
      try {
        await client.sendMessage(chatId, msg.message);
        await db.query("UPDATE whatsapp_queue SET status = 'sent' WHERE id = ?", [msg.id]);
        console.log(`Message sent to ${formattedPhone}`);
      } catch (err) {
        console.error(`Failed to send message to ${formattedPhone}`, err);
        await db.query("UPDATE whatsapp_queue SET status = 'failed' WHERE id = ?", [msg.id]);
      }
      
      // Small delay between each message in the batch (5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (messages.length > 0) {
      // Pause queue for 15 minutes after sending a batch to prevent ban
      console.log('WhatsApp queue paused for 15 minutes to prevent spam flag.');
      isPaused = true;
      pausedUntil = Date.now() + (15 * 60 * 1000);
      setTimeout(() => {
        isPaused = false;
        pausedUntil = null;
        console.log('WhatsApp queue resumed.');
      }, 15 * 60 * 1000);
    }
  } catch (error) {
    console.error("Error processing WhatsApp queue:", error);
  }
}

// Check queue every 10 seconds
setInterval(processQueue, 10 * 1000);

// Exports
module.exports = {
  initialize,
  getStatus: () => ({ status, qr: currentQR, qrExpiresAt }),
  logout: async () => {
    if (client) {
      try {
        await client.logout();
        status = 'DISCONNECTED';
        currentQR = null;
        setTimeout(initialize, 3000); // Re-initialize to get a new QR
        return true;
      } catch (e) {
        console.error("Error logging out", e);
        return false;
      }
    }
    return false;
  },
  enqueueMessage: async (phone, message) => {
    try {
      await db.query(
        "INSERT INTO whatsapp_queue (phone, message, status) VALUES (?, ?, 'pending')",
        [phone, message]
      );
      return true;
    } catch (error) {
      console.error("Failed to enqueue WhatsApp message", error);
      return false;
    }
  },
  getQueueStats: async () => {
    try {
      const [pending] = await db.query("SELECT COUNT(*) as count FROM whatsapp_queue WHERE status = 'pending'");
      const [sent] = await db.query("SELECT COUNT(*) as count FROM whatsapp_queue WHERE status = 'sent'");
      const [failed] = await db.query("SELECT COUNT(*) as count FROM whatsapp_queue WHERE status = 'failed'");
      return {
        pending: pending[0].count,
        sent: sent[0].count,
        failed: failed[0].count,
        isPaused,
        pausedUntil
      };
    } catch (error) {
      return { pending: 0, sent: 0, failed: 0, isPaused: false, pausedUntil: null };
    }
  }
};
