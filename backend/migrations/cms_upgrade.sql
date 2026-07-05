USE edizo_db;

-- 1. Site Settings (Global Configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Pages (e.g. 'home', 'about')
CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  status VARCHAR(50) DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Page Sections (Nested JSON content for flexibility)
CREATE TABLE IF NOT EXISTS page_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_id INT NOT NULL,
  section_key VARCHAR(100) NOT NULL, -- e.g. 'hero', 'story'
  content JSON NOT NULL, -- The dynamic payload
  sort_order INT DEFAULT 0,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  UNIQUE KEY unique_page_section (page_id, section_key)
);

-- 4. Media Library
CREATE TABLE IF NOT EXISTS media_library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  alt_text VARCHAR(255),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- 6. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt TEXT,
  featured_image_id INT,
  category_id INT,
  author_id INT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (featured_image_id) REFERENCES media_library(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
