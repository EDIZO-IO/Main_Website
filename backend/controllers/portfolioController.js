const db = require('../db');

exports.getProjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM portfolio_projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addProject = async (req, res) => {
  try {
    const { title, client, category, description, image_url, color, status } = req.body;
    await db.query(
      'INSERT INTO portfolio_projects (title, client, category, description, image_url, color, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, client, category, description, image_url, color || 'bg-blue-500', status || 'active']
    );
    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, client, category, description, image_url, color, status } = req.body;
    await db.query(
      'UPDATE portfolio_projects SET title=?, client=?, category=?, description=?, image_url=?, color=?, status=? WHERE id=?',
      [title, client, category, description, image_url, color, status, id]
    );
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM portfolio_projects WHERE id=?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
