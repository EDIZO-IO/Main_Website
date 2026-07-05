const db = require('../db');

// Get a page and its sections by slug
exports.getPageBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [pages] = await db.query('SELECT * FROM pages WHERE slug = ? AND status = "published"', [slug]);
    if (pages.length === 0) return res.status(404).json({ error: 'Page not found' });
    
    const page = pages[0];
    const [sections] = await db.query('SELECT section_key, content FROM page_sections WHERE page_id = ? ORDER BY sort_order ASC', [page.id]);
    
    const pageData = {
      ...page,
      sections: {}
    };
    
    sections.forEach(sec => {
      pageData.sections[sec.section_key] = sec.content;
    });
    
    res.json(pageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch page data' });
  }
};

// Admin: Update page metadata
exports.updatePage = async (req, res) => {
  const { slug } = req.params;
  const { title, seo_title, seo_description, seo_keywords, status } = req.body;
  try {
    await db.query(
      'UPDATE pages SET title = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, status = ? WHERE slug = ?',
      [title, seo_title, seo_description, seo_keywords, status, slug]
    );
    res.json({ message: 'Page updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update page' });
  }
};

// Admin: Update page section (JSON content)
exports.updatePageSection = async (req, res) => {
  const { slug, section_key } = req.params;
  const { content } = req.body; // should be a JSON object
  try {
    const [pages] = await db.query('SELECT id FROM pages WHERE slug = ?', [slug]);
    if (pages.length === 0) return res.status(404).json({ error: 'Page not found' });
    
    const page_id = pages[0].id;
    
    await db.query(
      'INSERT INTO page_sections (page_id, section_key, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content = ?',
      [page_id, section_key, JSON.stringify(content), JSON.stringify(content)]
    );
    
    res.json({ message: 'Page section updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update page section' });
  }
};
