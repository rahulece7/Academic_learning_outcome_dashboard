# Backend Integration Guide

## Quick Start

### Server Status
✅ Backend running on `http://localhost:5001` (the server will use `PORT` env; falls back to 5000 if set)  
✅ Frontend running on `http://localhost:3000`

---

## What's Implemented

### 1. Authentication
- **Route**: `POST /api/login`
- Demo credentials available for testing
- Returns user data with role-based info

### 2. Student Dashboard Data
- **Profile**: `GET /api/student/profile`
- **Learning Outcomes**: `GET /api/outcomes`
- **Projects**: `GET /api/projects?studentId=1`
- **Courses**: `GET /api/courses?studentId=1`
- **Internships**: `GET /api/internships?studentId=1`
- **Papers**: `GET /api/papers?studentId=1`

### 3. Admin Dashboard Data
- **Student Management**: CRUD operations on `/api/admin/students`
- **Analytics**: `GET /api/admin/analytics` with:
  - Total students count
  - Average CGPA and attendance
  - Active projects count
  - Department-wise statistics
  - Learning outcome completion rates

### 4. Learning Outcomes Management
- Full CRUD operations
- Track progress (0-100%)
- Categorize by type
- Status tracking (Not Started, In Progress, Completed)

---

## Data Available

### Students (4 demo students)
1. **Arjun Sharma** (A101) - Computer Science - CGPA: 8.5
2. **Jane Smith** (A102) - Computer Science - CGPA: 8.8
3. **Mike Johnson** (A103) - Electronics - CGPA: 7.8
4. **Sarah Williams** (A104) - Mechanical - CGPA: 8.2

### Student Records (Associated with student A101)
- 3 Projects (1 completed, 2 in progress)
- 3 Online Courses (1 completed, 2 in progress)
- 3 Internships (2 completed, 1 in progress)
- 3 Published Papers/Presentations
- 3 Learning Outcomes

---

## How to Use

### 1. Test Login
```javascript
const response = await fetch('http://localhost:5001/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'password123',
    userRole: 'student'
  })
});
```

### 2. Fetch Student Projects
```javascript
const response = await fetch('http://localhost:5001/api/projects?studentId=1');
const data = await response.json();
```

### 3. Create New Project
```javascript
const response = await fetch('http://localhost:5001/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentId: '1',
    title: 'My New Project',
    name: 'Project Team',
    status: 'In Progress',
    description: 'Description here',
    technologies: ['React', 'Node.js']
  })
});
```

### 4. Get Admin Analytics
```javascript
const response = await fetch('http://localhost:5001/api/admin/analytics');
const analytics = await response.json();
```

---

## Complete API Endpoints Summary

### Authentication (1)
- POST `/api/login`

### Student Routes (11)
- GET `/api/student/profile`
- GET `/api/outcomes`
- POST `/api/outcomes`
- PUT `/api/outcomes/:id`
- DELETE `/api/outcomes/:id`
- GET `/api/projects`
- POST `/api/projects`
- PUT `/api/projects/:id`
- DELETE `/api/projects/:id`
- GET `/api/courses`
- POST `/api/courses`
- GET `/api/internships`
- POST `/api/internships`
- GET `/api/papers`
- POST `/api/papers`

### Admin Routes (6)
- GET `/api/admin/students`
- GET `/api/admin/students/:id`
- PUT `/api/admin/students/:id`
- DELETE `/api/admin/students/:id`
- GET `/api/admin/analytics`

---

## Features

✅ Full student management (CRUD)  
✅ Learning outcomes tracking  
✅ Project management  
✅ Course enrollment tracking  
✅ Internship records  
✅ Paper/publication tracking  
✅ Department statistics  
✅ Student analytics dashboard  
✅ Role-based access (student/admin)  
✅ Progress tracking (0-100%)  
✅ Status management  

---

## Database Notes

- **Current**: In-memory (replaces on server restart)
- **For Production**: Replace with MongoDB, PostgreSQL, or similar
- **No Authentication Middleware**: Add JWT tokens for production
- **No Rate Limiting**: Add rate limiters for API security

---

## Next Steps for Frontend Integration

The frontend can now:
1. Call `/api/login` to authenticate users
2. Fetch student data from their specific endpoints
3. Display analytics data in admin dashboard
4. Create, update, and delete records
5. Show real data instead of hardcoded demo data

## Testing the API

Open terminal and test endpoints (use port 5001 unless you explicitly set `PORT`):
```bash
# Test server is running
curl http://localhost:5001

# Test login
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123","userRole":"student"}'

# Get all students (admin)
curl http://localhost:5001/api/admin/students

# Get analytics
curl http://localhost:5001/api/admin/analytics
```

---

## Server Running Info

Backend: run from the `server` folder. By default the server reads `PORT` and `MONGODB_URI` from `server/.env`.

Recommended local commands (PowerShell):
```powershell
cd server
# start with in-memory data (no MONGODB_URI):
npm start

# or set a temporary PORT and run (current session):
$env:PORT = "5001"; node index.js

# to run with MongoDB (set MONGODB_URI in server/.env then start):
# create server/.env with MONGODB_URI and (optionally) PORT
# then:
npm start
```

Seeding demo data (run after `MONGODB_URI` is configured and the server can connect):
```powershell
cd server
# ensure server/.env contains MONGODB_URI
node seed.js
```

Frontend: `npm start` from `/client` directory

Note: If you see the message "MONGODB_URI not set. Server will run with in-memory data.", the API will use in-memory demo data until you add a valid `MONGODB_URI`.