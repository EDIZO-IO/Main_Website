const db = require('../db');

exports.getAllTeamMembers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM team_members ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

exports.getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM team_members WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ message: "Failed to fetch team member" });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, linkedin_url, status } = req.body;
    let image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    // If the frontend compressed it and sent it as base64 (not implemented in team yet, but safe to allow both)
    if (req.body.image_url && !req.file) {
        image_url = req.body.image_url;
    }

    const [result] = await db.query(
      'INSERT INTO team_members (name, role, bio, linkedin_url, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, role, bio, linkedin_url || null, status || 'active', image_url]
    );

    const [newMember] = await db.query('SELECT * FROM team_members WHERE id = ?', [result.insertId]);
    res.status(201).json(newMember[0]);
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Failed to create team member" });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, linkedin_url, status } = req.body;
    
    // Check if team member exists
    const [existing] = await db.query('SELECT image_url FROM team_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }

    let image_url = existing[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    await db.query(
      'UPDATE team_members SET name = ?, role = ?, bio = ?, linkedin_url = ?, status = ?, image_url = ? WHERE id = ?',
      [name, role, bio, linkedin_url || null, status || 'active', image_url, id]
    );

    const [updatedMember] = await db.query('SELECT * FROM team_members WHERE id = ?', [id]);
    res.json(updatedMember[0]);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Failed to update team member" });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM team_members WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Failed to delete team member" });
  }
};
