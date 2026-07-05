# EDIZO PLATFORM COMPLETE PRODUCT SPECIFICATION

## 1. Product Overview

### Product Name
Edizo

### Tagline
Learn. Build. Launch.

### Product Type
* Software Agency Platform
* Internship Management Platform
* Learning Platform
* Client Service Portal
* Admin Management System

### Target Users
* Students
* Fresh Graduates
* Job Seekers
* Companies
* Clients
* Administrators
* Mentors

---

# 2. User Roles

## Super Admin
Permissions:
* Full system control
* User management
* Internship management
* Service management
* Revenue management
* Staff management
* Reports
* Settings

## Admin
Permissions:
* Internship CRUD
* Service CRUD
* Application management
* Request management

## Mentor
Permissions:
* View assigned interns
* Update progress
* Conduct assessments
* Upload materials

## Student
Permissions:
* Browse internships
* Apply internships
* View progress
* Download certificates

## Client
Permissions:
* Request services
* Track project status
* Upload requirements
* Download invoices

---

# 3. Main Modules

## Academy Module
### Features
* Internship Programs
* Courses
* Certifications
* Assessments
* Attendance
* Progress Tracking
* Placement Tracking
* Student Dashboard

---

## Agency Module
### Features
* Service Catalog
* Service Requests
* Proposal Generation
* Project Tracking
* Invoice Management
* Client Dashboard

---

## Learning Management System
### Features
* Video Lessons
* Documents
* Quizzes
* Assignments
* Live Sessions
* Progress Tracking

---

## CRM Module
### Features
* Lead Management
* Client Database
* Follow Ups
* Sales Pipeline

---

## HR Module
### Features
* Employee Records
* Attendance
* Payroll
* Leave Management

---

# 4. Client Website Pages

## Landing Page
Sections:

### Hero
* Animated Text
* CTA Buttons
* Video Background
* Floating Cards

### Statistics
* Students Trained
* Projects Delivered
* Internships Completed
* Client Satisfaction

### Services
* Web Development
* Mobile Apps
* UI UX
* AI Solutions
* Cloud Services

### Internship Showcase
Dynamic cards from database.

### Success Stories
Student testimonials.

### FAQ
Accordion component.

### Contact Section
Lead form.

---

## Internship Listing Page
Features:
* Search
* Filters
* Categories
* Duration
* Mode
* Company

Card Details:
* Title
* Company
* Duration
* Stipend
* Skills

---

## Internship Details
Sections:
* Overview
* Syllabus
* Benefits
* Requirements
* Certificate
* Placement Support

Sticky Apply Panel.

---

## Services Listing
Categories:
* Web Development
* Mobile Apps
* AI Solutions
* Cloud
* Marketing

---

## Service Detail
Sections:
* Description
* Process
* Pricing
* Portfolio
* Testimonials

---

# 5. Student Dashboard

## Dashboard Widgets
* Active Programs
* Completed Programs
* Pending Tasks
* Certificates

### Pages
#### My Applications
Status:
* Pending
* Approved
* Rejected

#### My Courses
Progress Tracking

#### Certificates
Download Certificates

#### Profile
Personal Details

---

# 6. Client Dashboard

### Dashboard
Cards:
* Active Projects
* Completed Projects
* Pending Requests

### Project Tracker
Stages:
1 Discovery
2 Planning
3 Development
4 Testing
5 Deployment
6 Maintenance

### Documents
* Proposal
* Contract
* Invoice

---

# 7. Admin Dashboard

### Overview
Cards:
* Total Users
* Students
* Clients
* Revenue
* Applications

### Charts
* User Growth
* Revenue Growth
* Application Trends
* Service Requests

---

# 8. Internship Management
CRUD Features

Fields:
* Title
* Category
* Company
* Duration
* Description
* Syllabus
* Benefits
* Eligibility
* Mode
* Status

---

# 9. Service Management
CRUD Features

Fields:
* Service Name
* Category
* Description
* Features
* Pricing
* Status

---

# 10. Application Management
Features:
* Review Applications
* Approve
* Reject
* Interview Schedule
* Send Email

---

# 11. Project Management
Features:
* Create Project
* Assign Team
* Upload Documents
* Timeline Tracking
* Status Updates

---

# 12. Database Structure

### Users
```sql
id
name
email
phone
password
role
status
created_at
```

### Internships
```sql
id
title
company
duration
mode
description
benefits
status
created_at
```

### Services
```sql
id
name
category
description
price
status
created_at
```

### Applications
```sql
id
user_id
internship_id
status
resume
created_at
```

### Service Requests
```sql
id
user_id
service_id
budget
requirements
status
created_at
```

### Projects
```sql
id
client_id
service_id
status
start_date
end_date
```

---

# 13. API Architecture

## Auth
```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

## Internships
```bash
GET /api/internships
GET /api/internships/:id
POST /api/internships
PUT /api/internships/:id
DELETE /api/internships/:id
```

## Services
```bash
GET /api/services
POST /api/services
PUT /api/services/:id
DELETE /api/services/:id
```

---

# 14. Security

### Authentication
* JWT
* Refresh Tokens
* Role Based Access

### Protection
* Rate Limiting
* Helmet
* CORS
* SQL Injection Prevention
* XSS Protection

---

# 15. Tech Stack

Frontend:
* React
* Vite
* Tailwind
* Framer Motion
* Shadcn UI

Backend:
* Node.js
* Express

Database:
* MySQL

Storage:
* S3 Compatible Storage

Authentication:
* JWT

Deployment:
* Ubuntu
* PM2
* Nginx
* Cloudflare

---

# 16. Future Features
* AI Career Guidance
* AI Resume Builder
* AI Interview Practice
* Placement Portal
* Company Hiring Portal
* Freelancer Marketplace
* Edizo Mobile App
* Certificate Verification System
* Online Exam Platform
