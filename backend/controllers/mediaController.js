const db = require('../db');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file = req.file;
    const url = `/uploads/${file.filename}`;
    
    const [result] = await db.query(
      'INSERT INTO media_library (url, file_name, file_type, file_size, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
      [url, file.originalname, file.mimetype, file.size, req.body.alt_text || '', req.user.id]
    );
    
    res.json({ id: result.insertId, url, message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const [media] = await db.query('SELECT * FROM media_library ORDER BY created_at DESC');
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

exports.deleteMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const [media] = await db.query('SELECT * FROM media_library WHERE id = ?', [id]);
    if (media.length === 0) return res.status(404).json({ error: 'Media not found' });
    
    const filePath = path.join(__dirname, '..', 'public', media[0].url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await db.query('DELETE FROM media_library WHERE id = ?', [id]);
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};
