const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET /api/jobs
// @desc    Get all active jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs WHERE status = "active" ORDER BY created_at DESC');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const [job] = await db.query('SELECT * FROM jobs WHERE id = ? OR uuid = ?', [req.params.id, req.params.id]);
    if (job.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(job[0]);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Public
router.post('/:id/apply', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { firstName, lastName, email, resume, resumeUrl, coverLetter, userId } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const resumeFile = resumeUrl || resume || null;

    let result;
    try {
      [result] = await db.query(
        'INSERT INTO job_applications (job_id, user_id, first_name, last_name, email, resume_url, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [jobId, userId || null, firstName, lastName, email, resumeFile, coverLetter || '']
      );
    } catch (e) {
      [result] = await db.query(
        'INSERT INTO job_applications (job_id, user_id, first_name, last_name, email, resume, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [jobId, userId || null, firstName, lastName, email, resumeFile, coverLetter || '']
      );
    }

    res.status(201).json({ message: 'Application submitted successfully', id: result.insertId });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
});

module.exports = router;
