const db = require('../db');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const getClientIp = (req) => {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || req.ip || null;
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file = req.file;
    const url = `/uploads/${file.filename}`;
    const userId = req.user ? req.user.id : null;
    const ipAddress = getClientIp(req);
    
    let resultId = null;
    try {
      // Primary: Insert into new file_uploads table
      const [res1] = await db.query(
        'INSERT INTO file_uploads (user_id, filename, original_name, mime_type, file_size, file_path, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, file.filename, file.originalname, file.mimetype, file.size, url, ipAddress]
      );
      resultId = res1.insertId;
    } catch (e) {
      // Fallback: Insert into legacy media_library if table exists
      try {
        const [res2] = await db.query(
          'INSERT INTO media_library (url, file_name, file_type, file_size, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
          [url, file.originalname, file.mimetype, file.size, req.body.alt_text || '', userId]
        );
        resultId = res2.insertId;
      } catch (err2) {}
    }
    
    res.json({ id: resultId, url, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

exports.getMedia = async (req, res) => {
  try {
    let media = [];
    try {
      [media] = await db.query('SELECT id, filename as file_name, file_path as url, mime_type as file_type, file_size, created_at FROM file_uploads WHERE deleted_at IS NULL ORDER BY created_at DESC');
    } catch (e) {
      [media] = await db.query('SELECT * FROM media_library ORDER BY created_at DESC');
    }
    res.json(media);
  } catch (error) {
    console.error('Fetch media error:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

exports.deleteMedia = async (req, res) => {
  const { id } = req.params;
  try {
    try {
      await db.query('UPDATE file_uploads SET deleted_at = NOW() WHERE id = ?', [id]);
    } catch (e) {
      await db.query('DELETE FROM media_library WHERE id = ?', [id]);
    }
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};
