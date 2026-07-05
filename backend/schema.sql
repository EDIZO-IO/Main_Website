CREATE DATABASE IF NOT EXISTS edizo_db;
USE edizo_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student', -- 'super_admin', 'admin', 'mentor', 'student', 'client'
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  duration VARCHAR(100),
  mode VARCHAR(50) NOT NULL,
  description TEXT,
  syllabus TEXT,
  benefits TEXT,
  eligibility TEXT,
  status VARCHAR(50) DEFAULT 'active',
  rating DECIMAL(3,1) DEFAULT 5.0,
  stipend VARCHAR(100) DEFAULT NULL,
  price VARCHAR(100) DEFAULT '0',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL, 
  category VARCHAR(100),
  description TEXT,
  features TEXT,
  price VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  linkedin VARCHAR(255),
  why_select TEXT,
  resume VARCHAR(255),
  internship_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  service_id VARCHAR(100) NOT NULL,
  project_details TEXT,
  requirements TEXT,
  budget VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  service_id VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Discovery',
  start_date DATE,
  end_date DATE,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client VARCHAR(255),
  category VARCHAR(255),
  description TEXT,
  image_url VARCHAR(255),
  color VARCHAR(50) DEFAULT 'bg-blue-500',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  type VARCHAR(50), -- Full-time, Part-time, Contract
  salary VARCHAR(100),
  description TEXT,
  requirements TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  job_id INT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  resume VARCHAR(255),
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_1 VARCHAR(255),
  email_2 VARCHAR(255),
  phone VARCHAR(50),
  office_hours VARCHAR(100),
  address_title VARCHAR(100),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

