const db = require('../db');

exports.getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

exports.updateSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    await db.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

exports.updateSettingsBulk = async (req, res) => {
  const settings = req.body; // Expects an object { key: value, key2: value2 }
  try {
    const promises = Object.entries(settings).map(([key, value]) => {
      return db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    });
    await Promise.all(promises);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
