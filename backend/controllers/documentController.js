const db = require('../db');

// @desc    Get document categories
// @route   GET /api/documents/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(`SELECT * FROM document_categories ORDER BY name ASC`);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching document categories' });
  }
};

// @desc    Get all documents (scoped by client or project)
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const { category_id, project_id, client_id } = req.query;
    const isStaff = ['admin', 'super_admin', 'manager', 'employee'].includes(req.user.role_name);

    let query = `
      SELECT d.*, 
             dc.name AS category_name,
             COALESCE(s.title, CONCAT('Project #', p.id)) AS project_title,
             u.name AS client_name,
             fu.original_name, fu.mime_type, fu.file_size AS size_bytes, fu.file_path AS storage_path, fu.uuid AS file_uuid,
             c.name AS creator_name
      FROM documents d
      LEFT JOIN document_categories dc ON d.category_id = dc.id
      LEFT JOIN projects p ON d.project_id = p.id
      LEFT JOIN services s ON p.service_id = s.id
      LEFT JOIN users u ON d.client_id = u.id
      JOIN file_uploads fu ON d.file_upload_id = fu.id
      LEFT JOIN users c ON d.created_by = c.id
      WHERE 1=1
    `;
    const params = [];

    if (!isStaff) {
      query += ` AND d.client_id = ? AND d.visible_to_client = TRUE`;
      params.push(req.user.id);
    } else {
      if (client_id) {
        query += ` AND d.client_id = ?`;
        params.push(client_id);
      }
    }

    if (category_id) {
      query += ` AND d.category_id = ?`;
      params.push(category_id);
    }
    if (project_id) {
      query += ` AND d.project_id = ?`;
      params.push(project_id);
    }

    query += ` ORDER BY d.created_at DESC`;

    const [documents] = await db.query(query, params);
    res.json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    console.error('getDocuments error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching documents' });
  }
};

// @desc    Upload / Link a document
// @route   POST /api/documents
// @access  Private (Staff/Admin)
exports.createDocument = async (req, res) => {
  try {
    const { category_id, project_id, client_id, file_upload_id, title, visible_to_client } = req.body;

    if (!file_upload_id || !title) {
      return res.status(400).json({ success: false, message: 'Title and file_upload_id are required' });
    }

    const [result] = await db.query(
      `INSERT INTO documents (category_id, project_id, client_id, file_upload_id, title, visible_to_client, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id || null,
        project_id || null,
        client_id || null,
        file_upload_id,
        title,
        visible_to_client !== undefined ? visible_to_client : true,
        req.user.id
      ]
    );

    const [newDoc] = await db.query(`SELECT * FROM documents WHERE id = ?`, [result.insertId]);
    res.status(201).json({
      success: true,
      message: 'Document cataloged successfully',
      data: newDoc[0]
    });
  } catch (error) {
    console.error('createDocument error:', error);
    res.status(500).json({ success: false, message: 'Server error creating document' });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private (Staff/Admin)
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM documents WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document removed successfully' });
  } catch (error) {
    console.error('deleteDocument error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting document' });
  }
};
