const pool = require('./db');

const newServices = [
  { title: 'Graphic Design', category: 'Design', description: 'Logos, branding, social media creatives', features: JSON.stringify(['Logo design & brand identity', 'Social media creatives & posters', 'Business cards, brochures & flyers', 'Packaging & print design', 'UI graphics & banner design']), price: 'Custom' },
  { title: 'Video Editing', category: 'Media', description: 'Reels, ads, promotional & corporate videos', features: JSON.stringify(['Reels & short-form social videos', 'Promotional & advertisement videos', 'Corporate & training videos', 'YouTube content editing', 'Motion graphics & animation']), price: 'Custom' },
  { title: 'Website Development', category: 'Development', description: 'Responsive, fast, SEO-friendly websites', features: JSON.stringify(['Business & portfolio websites', 'E-commerce websites', 'Landing pages & web apps', 'CMS-based websites', 'Website maintenance & support']), price: 'Custom' },
  { title: 'App Development', category: 'Development', description: 'Android, iOS & cross-platform apps', features: JSON.stringify(['Android app development', 'iOS app development', 'Cross-platform apps (Flutter/React Native)', 'UI/UX design for apps', 'App testing, deployment & maintenance']), price: 'Custom' },
  { title: 'SEO', category: 'Marketing', description: 'Higher rankings and organic traffic growth', features: JSON.stringify(['Keyword research & on-page SEO', 'Technical SEO audits', 'Off-page SEO & link building', 'Local SEO & Google Business optimization', 'Monthly performance reporting']), price: 'Custom' },
  { title: 'API Development & Integration', category: 'Development', description: 'Seamless system connectivity', features: JSON.stringify(['Custom REST/API development', 'Third-party API integration', 'API documentation & testing', 'System-to-system data integration', 'API security & performance optimization']), price: 'Custom' },
  { title: 'Digital Marketing', category: 'Marketing', description: 'Social media, ads, and content strategy', features: JSON.stringify(['Social media marketing & management', 'Paid ads (Google, Meta/Instagram)', 'Content marketing strategy', 'Email marketing campaigns', 'Analytics, tracking & reporting']), price: 'Custom' }
];

const newInternships = [
  { title: 'Graphic Design Internship', category: 'Design', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['Design Principles', 'Branding', 'Social Media Creatives']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' },
  { title: 'Video Editing Internship', category: 'Media', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['Video Editing Basics', 'Motion Graphics', 'Short-form content']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' },
  { title: 'Website Development Internship', category: 'Development', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['Frontend Development', 'Backend Development', 'SEO Basics']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' },
  { title: 'App Development Internship', category: 'Development', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['UI/UX for Apps', 'React Native/Flutter', 'Deployment']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' },
  { title: 'SEO Internship', category: 'Marketing', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['On-page SEO', 'Off-page SEO', 'Analytics']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' },
  { title: 'API Development Internship', category: 'Development', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['REST API', 'Security', 'Testing']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' },
  { title: 'Digital Marketing Internship', category: 'Marketing', company: 'EDIZO', duration: 'Flexible (15 Days - 3 Months)', mode: 'Remote/Hybrid', description: 'Real client projects, mentorship from industry professionals.', syllabus: JSON.stringify(['Social Media Strategy', 'Paid Ads', 'Email Campaigns']), benefits: JSON.stringify(['Certificate of Internship', 'Letter of Recommendation', 'Pre-Placement Offer (PPO)']), eligibility: 'Students pursuing degree/diploma, basic knowledge, stable internet.' }
];

async function seedData() {
  try {
    console.log('Clearing existing services and internships...');
    await pool.query('DELETE FROM services');
    await pool.query('DELETE FROM internships');
    
    console.log('Inserting new services...');
    for (const svc of newServices) {
      await pool.query(
        'INSERT INTO services (title, category, description, features, price) VALUES (?, ?, ?, ?, ?)',
        [svc.title, svc.category, svc.description, svc.features, svc.price]
      );
    }
    
    console.log('Inserting new internships...');
    for (const intern of newInternships) {
      await pool.query(
        'INSERT INTO internships (title, category, company, duration, mode, description, syllabus, benefits, eligibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [intern.title, intern.category, intern.company, intern.duration, intern.mode, intern.description, intern.syllabus, intern.benefits, intern.eligibility]
      );
    }
    
    // Also update contact config
    console.log('Updating contact config...');
    await pool.query('DELETE FROM contact_config');
    await pool.query(`
      INSERT INTO contact_config (email_1, phone, address_title, address_line1, address_line2, office_hours)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'info@edizo.com',
      '+91-XXXXXXXXXX',
      'EDIZO Headquarters',
      '[Company Address]',
      'India',
      'Monday – Saturday, 10:00 AM – 7:00 PM'
    ]);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
}

seedData();
