# Academic Learning Outcome Dashboard - API Documentation

## Overview
Complete backend API for the Academic Learning Outcome Dashboard system. Built with Express.js and provides endpoints for student management, learning outcomes tracking, projects, courses, internships, papers, and admin analytics.

---

## System Overview

The Academic Learning Outcome Dashboard is a web-based system designed to monitor and manage student academic and co-curricular activities. The system supports two types of users: Admin and Student. Each user has role-based access to relevant features.

### User Roles

- **Admin**: Full access to the system with capabilities to view, add, edit, and manage student records, activities, and reports.
- **Student**: Personalized dashboard showing the student's profile and activity records.

### Admin Capabilities

- View the complete dashboard of all students
- Add, update, and edit student details
- Monitor student performance and activities
- View and manage student profiles, projects, online courses, internships, and paper presentations
- Generate academic and performance reports

### Student Dashboard Layout

#### Navigation Panel (Left Side Icons)

The left-side menu contains the following icons:

- Profile
- Project
- Online Course
- Internship
- Paper Presentation

#### Student Modules — Functional Details

- **Profile Module**: Displays student name, roll number, email ID, attendance percentage, CGPA, and SGPA.
- **Project Module**: Shows number of projects completed, and for each project displays an icon, title, details/description, and status (Completed / Ongoing).
- **Online Course Module**: Similar to Project module; shows number of courses, course name, platform, details, completion status, and certificate (if uploaded).
- **Internship Module**: Displays internship title, organization/company name, duration, mode (Online / Offline), status, and certificate upload.
- **Paper Presentation Module**: Shows number of presentations and for each entry displays paper title, conference/journal name, presentation details, and certificate upload.

### Admin Dashboard Access

The Admin can view all student dashboards in a consolidated manner, edit any student data, track overall academic learning outcomes, and ensure accurate and updated records for evaluation and accreditation purposes.

---

## Base URL
```
http://localhost:5000
```

---

## Authentication Endpoints

### Login
```
POST /api/login
```

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "userRole": "student"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "student@example.com",
    "name": "Arjun Sharma",
    "role": "student",
    "rollNumber": "A101",
    "department": "Computer Science",
    "cgpa": 8.5,
    "sgpa": 8.2,
    "attendance": 85
  }
}
```

**Demo Credentials:**
- Student: `student@example.com` / `password123`
- Admin: `admin@example.com` / `admin123`

---

## Student Routes

### Get Student Profile
```
GET /api/student/profile?studentId=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Arjun Sharma",
    "rollNumber": "A101",
    "email": "arjun@example.com",
    "department": "Computer Science",
    "cgpa": 8.5,
    "sgpa": 8.2,
    "attendance": 85,
    "status": "Active"
  }
}
```

---

## Learning Outcomes

### Get All Learning Outcomes
```
GET /api/outcomes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Critical Thinking",
      "description": "Student can analyze and evaluate information effectively",
      "status": "In Progress",
      "progress": 75,
      "category": "Cognitive Skills"
    }
  ]
}
```

### Get Specific Learning Outcome
```
GET /api/outcomes/:id
```

### Create Learning Outcome
```
POST /api/outcomes
```

**Request Body:**
```json
{
  "title": "New Skill",
  "description": "Description of the skill",
  "category": "Category",
  "status": "Not Started",
  "progress": 0
}
```

### Update Learning Outcome
```
PUT /api/outcomes/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "In Progress",
  "progress": 50
}
```

### Delete Learning Outcome
```
DELETE /api/outcomes/:id
```

---

## Student Projects

### Get All Projects
```
GET /api/projects?studentId=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "1",
      "title": "E-Commerce Platform",
      "name": "Team Alpha",
      "status": "Completed",
      "description": "Full-stack e-commerce platform",
      "date": "Dec 2024",
      "icon": "🛒",
      "technologies": ["React", "Node.js", "MongoDB"]
    }
  ]
}
```

### Create Project
```
POST /api/projects
```

**Request Body:**
```json
{
  "studentId": "1",
  "title": "New Project",
  "name": "Project Team",
  "status": "In Progress",
  "description": "Project description",
  "icon": "📁",
  "technologies": ["React", "Node.js"]
}
```

### Update Project
```
PUT /api/projects/:id
```

### Delete Project
```
DELETE /api/projects/:id
```

---

## Student Courses

### Get All Courses
```
GET /api/courses?studentId=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "1",
      "title": "Advanced JavaScript",
      "name": "Udemy",
      "status": "Completed",
      "progress": 100,
      "date": "Nov 2024",
      "icon": "📚",
      "rating": 4.8
    }
  ]
}
```

### Create Course
```
POST /api/courses
```

**Request Body:**
```json
{
  "studentId": "1",
  "title": "Course Title",
  "name": "Course Platform",
  "status": "In Progress",
  "progress": 50,
  "icon": "📚",
  "rating": 4.5
}
```

---

## Student Internships

### Get All Internships
```
GET /api/internships?studentId=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "1",
      "title": "Software Development Intern",
      "name": "TechCorp Solutions",
      "status": "Completed",
      "duration": "3 months",
      "date": "Jun - Aug 2024",
      "icon": "🏢",
      "mentor": "John Smith"
    }
  ]
}
```

### Create Internship
```
POST /api/internships
```

**Request Body:**
```json
{
  "studentId": "1",
  "title": "Internship Title",
  "name": "Company Name",
  "status": "In Progress",
  "duration": "2 months",
  "icon": "🏢",
  "mentor": "Mentor Name"
}
```

---

## Student Papers

### Get All Papers
```
GET /api/papers?studentId=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "1",
      "title": "AI in Education: A Comprehensive Review",
      "name": "International Conference 2024",
      "status": "Published",
      "date": "Dec 2024",
      "icon": "📄",
      "authors": ["Arjun Sharma", "Prof. Kumar"]
    }
  ]
}
```

### Create Paper
```
POST /api/papers
```

**Request Body:**
```json
{
  "studentId": "1",
  "title": "Paper Title",
  "name": "Conference/Journal Name",
  "status": "In Progress",
  "icon": "📄",
  "authors": ["Author 1", "Author 2"]
}
```

---

## Admin Routes

### Get All Students
```
GET /api/admin/students
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Arjun Sharma",
      "rollNumber": "A101",
      "email": "arjun@example.com",
      "department": "Computer Science",
      "cgpa": 8.5,
      "sgpa": 8.2,
      "attendance": 85,
      "status": "Active"
    }
  ]
}
```

### Get Student by ID
```
GET /api/admin/students/:id
```

### Update Student
```
PUT /api/admin/students/:id
```

**Request Body:**
```json
{
  "cgpa": 8.6,
  "sgpa": 8.3,
  "attendance": 88,
  "status": "Active"
}
```

### Delete Student
```
DELETE /api/admin/students/:id
```

### Get Analytics Data
```
GET /api/admin/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 4,
    "avgCGPA": "8.08",
    "avgAttendance": "86",
    "activeProjects": 2,
    "departmentStats": [
      {
        "name": "Computer Science",
        "students": 2,
        "avgCGPA": "8.7"
      }
    ],
    "learningOutcomeCompletion": [
      {
        "name": "Critical Thinking",
        "completion": 75
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created success
- `400` - Bad request (validation error)
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

---

## Data Models

### User
```javascript
{
  id: String,
  email: String,
  password: String,
  name: String,
  role: 'student' | 'admin',
  rollNumber: String,
  department: String,
  cgpa: Number,
  sgpa: Number,
  attendance: Number
}
```

### Learning Outcome
```javascript
{
  id: String (UUID),
  title: String,
  description: String,
  status: 'Not Started' | 'In Progress' | 'Completed',
  progress: Number (0-100),
  category: String
}
```

### Project
```javascript
{
  id: String (UUID),
  studentId: String,
  title: String,
  name: String,
  status: String,
  description: String,
  date: String,
  icon: String,
  technologies: Array<String>
}
```

### Course
```javascript
{
  id: String (UUID),
  studentId: String,
  title: String,
  name: String,
  status: String,
  progress: Number (0-100),
  date: String,
  icon: String,
  rating: Number
}
```

### Internship
```javascript
{
  id: String (UUID),
  studentId: String,
  title: String,
  name: String,
  status: String,
  duration: String,
  date: String,
  icon: String,
  mentor: String
}
```

### Paper
```javascript
{
  id: String (UUID),
  studentId: String,
  title: String,
  name: String,
  status: String,
  date: String,
  icon: String,
  authors: Array<String>
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "userRole": "student"
  }'
```

### Get Learning Outcomes
```bash
curl http://localhost:5000/api/outcomes
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "1",
    "title": "New Project",
    "name": "Team Name",
    "status": "In Progress",
    "description": "Description"
  }'
```

### Get Admin Analytics
```bash
curl http://localhost:5000/api/admin/analytics
```

---

## Notes
- All timestamps are in local timezone
- Default studentId is "1" if not specified
- In-memory database (data resets on server restart)
- For production, replace with persistent database (MongoDB, PostgreSQL, etc.)
