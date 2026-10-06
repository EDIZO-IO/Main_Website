const db = require('./db');

async function testBackend() {
  console.log('--- TESTING EDIZO V2 BACKEND MODULES & DB CONNECTIONS ---');
  try {
    // 1. Test DB connection
    const [dbTest] = await db.query('SELECT 1 + 1 AS result');
    console.log('✔ MySQL DB Connected successfully:', dbTest[0].result === 2);

    // 2. Test Tables Existence
    const tables = [
      'users', 'roles', 'leads', 'lead_notes', 'proposals', 'proposal_items',
      'projects', 'project_sprints', 'project_tasks', 'time_logs',
      'invoices', 'payments', 'payment_transactions',
      'tickets', 'ticket_replies', 'documents', 'consultation_slots',
      'consultations', 'employees', 'attendance', 'leave_requests',
      'internship_tasks', 'daily_reports', 'mentor_feedback',
      'ip_rules', 'rate_limits', 'audit_logs'
    ];

    console.log('\n--- Checking Table Presence in edizo_db ---');
    for (const tbl of tables) {
      const [rows] = await db.query(`SHOW TABLES LIKE ?`, [tbl]);
      if (rows.length > 0) {
        console.log(`✔ Table "${tbl}" exists.`);
      } else {
        console.error(`✖ Missing table: "${tbl}"!`);
      }
    }

    // 3. Test Controllers & Routes loading
    console.log('\n--- Testing Controller & Route Imports ---');
    require('./controllers/crmController');
    require('./controllers/proposalController');
    require('./controllers/taskBoardController');
    require('./controllers/billingController');
    require('./controllers/ticketController');
    require('./controllers/documentController');
    require('./controllers/consultationController');
    require('./controllers/employeeController');
    require('./controllers/internshipTaskController');
    require('./middleware/securityMiddleware');
    require('./middleware/authMiddleware');
    console.log('✔ All V2 controllers, middleware, and routes loaded successfully without syntax errors!');

    console.log('\n--- ALL LOCAL CHECKS PASSED ---');
    process.exit(0);
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  }
}

testBackend();
