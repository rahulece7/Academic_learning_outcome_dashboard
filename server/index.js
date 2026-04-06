const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Try connecting to MongoDB Atlas if configured
const { connectDB } = require('./db');
const { mongoose } = require('./db');
connectDB();

// Helper to know whether to use DB or in-memory
const dbReady = () => mongoose && mongoose.connection && mongoose.connection.readyState === 1;

// Load models (safe even if not connected yet)
const User = require('./models/User');
const Outcome = require('./models/Outcome');
const Project = require('./models/Project');
const Course = require('./models/Course');
const Internship = require('./models/Internship');
const Paper = require('./models/Paper');
const Announcement = require('./models/Announcement');
const COPOMapping = require('./models/COPOMapping');

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ============ In-Memory Database ============

// Users
let users = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    name: 'Arjun Sharma',
    role: 'student',
    rollNumber: 'A101',
    department: 'Computer Science',
    cgpa: 8.5,
    sgpa: 8.2,
    attendance: 85
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

// Learning Outcomes
let learningOutcomes = [
  {
    id: uuidv4(),
    subject: 'Data Structures',
    assignmentMarks: 82,
    assignmentTitle: 'Linked List Assignment',
    internalMarks: 78,
    labCourse: 'Data Structures Lab',
    labExperiment: 'Stack and Queue Implementation',
    title: 'Data Structures',
    description: 'Marks entry for Data Structures',
    status: 'Recorded',
    progress: 78,
    category: 'Data Structures Lab'
  },
  {
    id: uuidv4(),
    subject: 'Database Management Systems',
    assignmentMarks: 88,
    assignmentTitle: 'SQL Query Assignment',
    internalMarks: 84,
    labCourse: 'DBMS Lab',
    labExperiment: 'Normalization and Joins',
    title: 'Database Management Systems',
    description: 'Marks entry for Database Management Systems',
    status: 'Recorded',
    progress: 84,
    category: 'DBMS Lab'
  },
  {
    id: uuidv4(),
    subject: 'Operating Systems',
    assignmentMarks: 74,
    assignmentTitle: 'Scheduling Assignment',
    internalMarks: 71,
    labCourse: 'System Programming Lab',
    labExperiment: 'Process Synchronization',
    title: 'Operating Systems',
    description: 'Marks entry for Operating Systems',
    status: 'Recorded',
    progress: 71,
    category: 'System Programming Lab'
  }
];

// Student Projects
let projects = [
  {
    id: '1',
    studentId: '1',
    title: 'E-Commerce Platform',
    name: 'Team Alpha',
    status: 'Completed',
    description: 'Built a full-stack e-commerce platform using React and Node.js',
    date: 'Dec 2024',
    icon: '🛒',
    technologies: ['React', 'Node.js', 'MongoDB']
  },
  {
    id: '2',
    studentId: '1',
    title: 'Machine Learning Model',
    name: 'Data Science Project',
    status: 'In Progress',
    description: 'Developing a predictive model for student performance',
    date: 'Jan 2025',
    icon: '🤖',
    technologies: ['Python', 'TensorFlow', 'Pandas']
  },
  {
    id: '3',
    studentId: '1',
    title: 'Mobile App Development',
    name: 'Flutter Application',
    status: 'In Progress',
    description: 'Creating a cross-platform mobile application',
    date: 'Feb 2025',
    icon: '📱',
    technologies: ['Flutter', 'Dart', 'Firebase']
  }
];

// Student Courses
let courses = [
  {
    id: '1',
    studentId: '1',
    title: 'Advanced JavaScript',
    name: 'Udemy',
    status: 'Completed',
    progress: 100,
    date: 'Nov 2024',
    icon: '📚',
    rating: 4.8
  },
  {
    id: '2',
    studentId: '1',
    title: 'React Fundamentals',
    name: 'Coursera',
    status: 'In Progress',
    progress: 75,
    date: 'Jan 2025',
    icon: '⚛️',
    rating: 4.9
  },
  {
    id: '3',
    studentId: '1',
    title: 'Web Design Masterclass',
    name: 'LinkedIn Learning',
    status: 'In Progress',
    progress: 45,
    date: 'Feb 2025',
    icon: '🎨',
    rating: 4.5
  }
];

// Student Internships
let internships = [
  {
    id: '1',
    studentId: '1',
    title: 'Software Development Intern',
    name: 'TechCorp Solutions',
    status: 'Completed',
    duration: '3 months',
    date: 'Jun - Aug 2024',
    icon: '🏢',
    mentor: 'John Smith'
  },
  {
    id: '2',
    studentId: '1',
    title: 'Data Analytics Intern',
    name: 'Data Insights Inc',
    status: 'Completed',
    duration: '2 months',
    date: 'Sep - Oct 2024',
    icon: '📊',
    mentor: 'Jane Doe'
  },
  {
    id: '3',
    studentId: '1',
    title: 'Full Stack Developer',
    name: 'StartUp XYZ',
    status: 'In Progress',
    duration: '6 months',
    date: 'Jan 2025 - Jun 2025',
    icon: '💻',
    mentor: 'Mike Johnson'
  }
];

// Student Papers
let papers = [
  {
    id: '1',
    studentId: '1',
    title: 'AI in Education: A Comprehensive Review',
    name: 'International Conference 2024',
    status: 'Published',
    date: 'Dec 2024',
    icon: '📄',
    authors: ['Arjun Sharma', 'Prof. Kumar']
  },
  {
    id: '2',
    studentId: '1',
    title: 'Blockchain Applications in Healthcare',
    name: 'IEEE Journal',
    status: 'Published',
    date: 'Nov 2024',
    icon: '⛓️',
    authors: ['Arjun Sharma', 'Dr. Patel']
  },
  {
    id: '3',
    studentId: '1',
    title: 'Machine Learning for Climate Prediction',
    name: 'National Symposium',
    status: 'Presented',
    date: 'Jan 2025',
    icon: '🌍',
    authors: ['Arjun Sharma', 'Dr. Singh', 'Prof. Gupta']
  }
];

// Student Certificate Submissions
let certificateSubmissions = [
  {
    id: uuidv4(),
    studentId: '1',
    studentName: 'Arjun Sharma',
    registerNumber: 'A101',
    department: 'Computer Science',
    courseName: 'Cloud Foundations',
    platformName: 'Coursera',
    courseDuration: '8 weeks',
    completionDate: new Date('2026-01-15'),
    certificateId: 'CF-2026-9812',
    certificateFileName: 'cloud-internship.pdf',
    certificateFileType: 'application/pdf',
    certificateFileData: '',
    status: 'Approved',
    rejectionReason: '',
    adminRemarks: '',
    reviewedAt: new Date('2026-01-17'),
    submittedAt: new Date('2026-01-16')
  },
  {
    id: uuidv4(),
    studentId: '1',
    studentName: 'Arjun Sharma',
    registerNumber: 'A101',
    department: 'Computer Science',
    courseName: 'Data Analytics Basics',
    platformName: 'NPTEL',
    courseDuration: '4 weeks',
    completionDate: new Date('2026-02-20'),
    certificateId: 'NPTEL-DA-447',
    certificateFileName: 'data-analytics.jpg',
    certificateFileType: 'image/jpeg',
    certificateFileData: '',
    status: 'Rejected',
    rejectionReason: 'Uploaded file is unclear. Please re-upload a readable certificate image.',
    adminRemarks: 'Uploaded file is unclear. Please re-upload a readable certificate image.',
    reviewedAt: new Date('2026-02-22'),
    submittedAt: new Date('2026-02-21')
  },
  {
    id: uuidv4(),
    studentId: '1',
    studentName: 'Arjun Sharma',
    registerNumber: 'A101',
    department: 'Computer Science',
    courseName: 'UI/UX Fundamentals',
    platformName: 'Udemy',
    courseDuration: '6 weeks',
    completionDate: new Date('2026-02-28'),
    certificateId: '',
    certificateFileName: 'uiux-certificate.png',
    certificateFileType: 'image/png',
    certificateFileData: '',
    status: 'Pending',
    rejectionReason: '',
    adminRemarks: '',
    reviewedAt: null,
    submittedAt: new Date('2026-03-01')
  }
];

// Announcements
let announcements = [
  {
    id: uuidv4(),
    title: 'Mid-Term Exams Schedule',
    message: 'Mid-term exams will be conducted from Feb 28 to March 5, 2026',
    type: 'Exam',
    targetRole: 'student',
    department: 'All',
    publishedBy: 'Admin',
    publishDate: new Date('2026-02-10'),
    priority: 'high'
  },
  {
    id: uuidv4(),
    title: 'Tech Fest 2026',
    message: 'Annual tech fest registration is now open. Register before March 1st',
    type: 'Event',
    targetRole: 'all',
    department: 'All',
    publishedBy: 'Admin',
    publishDate: new Date('2026-02-09'),
    priority: 'medium'
  }
];

// CO-PO Mapping
let copoMappings = [
  {
    id: uuidv4(),
    courseCode: 'CS301',
    courseName: 'Data Structures',
    courseOutcomes: [
      { code: 'CO1', description: 'Understand basic data structures', attainment: 85, target: 80 },
      { code: 'CO2', description: 'Implement sorting algorithms', attainment: 78, target: 75 },
      { code: 'CO3', description: 'Apply graph algorithms', attainment: 82, target: 80 }
    ],
    programOutcomes: [
      { code: 'PO1', description: 'Engineering Knowledge', progress: 80, target: 75 },
      { code: 'PO2', description: 'Problem Analysis', progress: 85, target: 80 },
      { code: 'PO3', description: 'Design/Development', progress: 75, target: 70 }
    ],
    skillLevels: [
      { skill: 'Problem Solving', level: 'Advanced', percentage: 85 },
      { skill: 'Programming', level: 'Advanced', percentage: 82 },
      { skill: 'Algorithm Design', level: 'Intermediate', percentage: 75 },
      { skill: 'Communication', level: 'Intermediate', percentage: 70 }
    ],
    semester: 6,
    department: 'Computer Science'
  }
];

// All Students for Admin
const buildStudents = (count = 200) => {
  const firstNames = ['Arjun', 'Rahul', 'Priya', 'Sneha', 'Karthik', 'Meera', 'Vikram', 'Ananya', 'Rohan', 'Nisha'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Iyer', 'Reddy', 'Gupta', 'Kumar', 'Nair', 'Joshi', 'Das'];
  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];

  const students = [];
  for (let index = 1; index <= count; index += 1) {
    const firstName = firstNames[(index - 1) % firstNames.length];
    const lastName = lastNames[Math.floor((index - 1) / firstNames.length) % lastNames.length];
    const department = departments[(index - 1) % departments.length];
    const rollNumber = `A${String(100 + index).padStart(3, '0')}`;
    const cgpa = Number((6.5 + ((index * 7) % 35) / 10).toFixed(1));
    const sgpa = Number((6.3 + ((index * 5) % 34) / 10).toFixed(1));
    const attendance = 70 + ((index * 3) % 31);

    students.push({
      id: String(index),
      name: `${firstName} ${lastName}`,
      loginId: `std${String(index).padStart(3, '0')}`,
      password: `pass${String(index).padStart(3, '0')}`,
      rollNumber,
      email: `student${index}@example.com`,
      department,
      year: ((index - 1) % 4) + 1,
      semester: ((index - 1) % 8) + 1,
      cgpa,
      sgpa,
      attendance,
      status: 'Active',
      exams: [
        {
          name: 'Semester Assessment',
          subject: 'Core Subject',
          date: '2026-01-20',
          hallTicket: `HT${rollNumber}`,
          resultPublished: true,
          marks: 60 + (index % 41)
        }
      ]
    });
  }

  students[0] = {
    ...students[0],
    name: 'Arjun Sharma',
    loginId: 'std001',
    password: 'pass001',
    rollNumber: 'A101',
    email: 'arjun@example.com',
    department: 'Computer Science',
    year: 3,
    semester: 6,
    cgpa: 8.5,
    sgpa: 8.2,
    attendance: 85,
    exams: [
      {
        name: 'Mid Term Exam',
        subject: 'Data Structures',
        date: '2026-01-15',
        hallTicket: 'HTA101',
        resultPublished: true,
        marks: 88
      }
    ]
  };

  return students;
};

let allStudents = buildStudents(200);

// ============ Routes ============

app.get('/', (req, res) => {
  res.json({ 
    message: 'Academic Learning Outcome Dashboard API',
    version: '1.0.0',
    endpoints: 'Check documentation'
  });
});

// ============ AUTHENTICATION ROUTES ============

app.post('/api/login', (req, res) => {
  try {
    const { email, password, userRole } = req.body;
    const identifier = String(email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Login ID and password are required'
      });
    }

    if (dbReady()) {
      const query = userRole === 'student'
        ? { role: userRole, password, $or: [{ loginId: identifier }, { rollNumber: identifier }, { email: identifier }] }
        : { role: userRole, password, email: identifier };

      User.findOne(query).select('-password').lean().then(user => {
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
        const safeUser = { ...user, id: user._id ? user._id.toString() : user.id };
        res.json({ success: true, user: safeUser });
      }).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
      });
      return;
    }

    let user = null;
    if (userRole === 'student') {
      user = allStudents.find(s =>
        s.password === password && (s.loginId === identifier || s.rollNumber === identifier || s.email === identifier)
      );
      if (user) {
        return res.json({
          success: true,
          user: {
            id: user.id,
            loginId: user.loginId,
            email: user.email,
            name: user.name,
            role: 'student',
            rollNumber: user.rollNumber,
            department: user.department,
            year: user.year,
            semester: user.semester,
            cgpa: user.cgpa,
            sgpa: user.sgpa,
            attendance: user.attendance
          }
        });
      }
    } else {
      user = users.find(u => u.email === identifier && u.password === password && u.role === userRole);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department,
        cgpa: user.cgpa,
        sgpa: user.sgpa,
        attendance: user.attendance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ STUDENT PROFILE ROUTES ============

app.get('/api/student/profile', (req, res) => {
  try {
    const studentId = req.query.studentId;

    if (dbReady()) {
      const hasValidId = studentId && mongoose.Types.ObjectId.isValid(studentId);
      const query = hasValidId ? User.findById(studentId) : User.findOne({ role: 'student' });
      query.select('-password').lean().then(student => {
        if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
        const safeStudent = { ...student, id: student._id ? student._id.toString() : student.id };
        res.json({ success: true, data: safeStudent });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const fallbackId = studentId || '1';
    const student = allStudents.find(s => s.id === fallbackId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const { password, ...safeStudent } = student;

    res.json({
      success: true,
      data: safeStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ LEARNING OUTCOMES ROUTES ============

app.get('/api/outcomes', (req, res) => {
  try {
    if (dbReady()) {
      Outcome.find().lean().then(items => res.json({ success: true, data: items })).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    res.json({
      success: true,
      data: learningOutcomes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/outcomes/:id', (req, res) => {
  try {
    if (dbReady()) {
      Outcome.findById(req.params.id).lean().then(outcome => {
        if (!outcome) return res.status(404).json({ success: false, error: 'Learning outcome not found' });
        res.json({ success: true, data: outcome });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const outcome = learningOutcomes.find(o => o.id === req.params.id);
    if (!outcome) {
      return res.status(404).json({
        success: false,
        error: 'Learning outcome not found'
      });
    }
    res.json({
      success: true,
      data: outcome
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/outcomes', (req, res) => {
  try {
    const { subject, assignmentMarks, assignmentTitle, internalMarks, labCourse, labExperiment, title, description, category, status, progress } = req.body;
    const hasMarksShape = Boolean(subject);
    const normalizedSubject = String(subject || title || '').trim();
    const normalizedAssignment = Number(assignmentMarks ?? progress ?? 0);
    const normalizedInternal = Number(internalMarks ?? progress ?? 0);
    const normalizedLabCourse = String(labCourse || category || '').trim();
    const normalizedAssignmentTitle = String(assignmentTitle || '').trim();
    const normalizedLabExperiment = String(labExperiment || '').trim();

    if (!hasMarksShape && (!title || !description)) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    if (hasMarksShape && !normalizedSubject) {
      return res.status(400).json({
        success: false,
        error: 'Subject is required'
      });
    }

    if (dbReady()) {
      const finalTitle = String(title || normalizedSubject || '').trim();
      const finalDescription = String(description || `Marks entry for ${normalizedSubject}`).trim();
      const finalCategory = String(category || normalizedLabCourse || 'General').trim();
      const finalStatus = String(status || 'Recorded').trim();
      const finalProgress = Number(progress ?? normalizedInternal ?? 0);

      const o = new Outcome({
        subject: normalizedSubject || finalTitle,
        assignmentMarks: normalizedAssignment,
        assignmentTitle: normalizedAssignmentTitle,
        internalMarks: normalizedInternal,
        labCourse: normalizedLabCourse,
        labExperiment: normalizedLabExperiment,
        title: finalTitle,
        description: finalDescription,
        category: finalCategory,
        status: finalStatus,
        progress: finalProgress
      });
      o.save().then(saved => res.status(201).json({ success: true, data: saved })).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const newOutcome = {
      id: uuidv4(),
      subject: normalizedSubject,
      assignmentMarks: normalizedAssignment,
      assignmentTitle: normalizedAssignmentTitle,
      internalMarks: normalizedInternal,
      labCourse: normalizedLabCourse,
      labExperiment: normalizedLabExperiment,
      title: title || normalizedSubject,
      description: description || `Marks entry for ${normalizedSubject}`,
      category: category || normalizedLabCourse || 'General',
      status: status || 'Recorded',
      progress: Number(progress ?? normalizedInternal ?? 0)
    };

    learningOutcomes.push(newOutcome);
    res.status(201).json({
      success: true,
      data: newOutcome
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/outcomes/:id', (req, res) => {
  try {
    if (dbReady()) {
      const normalizedPayload = {
        ...req.body
      };

      if (normalizedPayload.subject !== undefined) {
        normalizedPayload.subject = String(normalizedPayload.subject || '').trim();
        if (!normalizedPayload.title) {
          normalizedPayload.title = normalizedPayload.subject;
        }
      }

      if (normalizedPayload.assignmentMarks !== undefined) {
        normalizedPayload.assignmentMarks = Number(normalizedPayload.assignmentMarks || 0);
      }

      if (normalizedPayload.assignmentTitle !== undefined) {
        normalizedPayload.assignmentTitle = String(normalizedPayload.assignmentTitle || '').trim();
      }

      if (normalizedPayload.internalMarks !== undefined) {
        normalizedPayload.internalMarks = Number(normalizedPayload.internalMarks || 0);
        if (normalizedPayload.progress === undefined) {
          normalizedPayload.progress = normalizedPayload.internalMarks;
        }
      }

      if (normalizedPayload.labCourse !== undefined) {
        normalizedPayload.labCourse = String(normalizedPayload.labCourse || '').trim();
        if (!normalizedPayload.category) {
          normalizedPayload.category = normalizedPayload.labCourse;
        }
      }

      if (normalizedPayload.labExperiment !== undefined) {
        normalizedPayload.labExperiment = String(normalizedPayload.labExperiment || '').trim();
      }

      Outcome.findByIdAndUpdate(req.params.id, normalizedPayload, { new: true }).then(updated => {
        if (!updated) return res.status(404).json({ success: false, error: 'Learning outcome not found' });
        res.json({ success: true, data: updated });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const outcome = learningOutcomes.find(o => o.id === req.params.id);
    if (!outcome) {
      return res.status(404).json({
        success: false,
        error: 'Learning outcome not found'
      });
    }

    const { subject, assignmentMarks, assignmentTitle, internalMarks, labCourse, labExperiment, title, description, category, status, progress } = req.body;
    if (subject !== undefined) {
      outcome.subject = String(subject || '').trim();
      if (!outcome.title) {
        outcome.title = outcome.subject;
      }
    }
    if (assignmentMarks !== undefined) outcome.assignmentMarks = Number(assignmentMarks || 0);
    if (assignmentTitle !== undefined) outcome.assignmentTitle = String(assignmentTitle || '').trim();
    if (internalMarks !== undefined) {
      outcome.internalMarks = Number(internalMarks || 0);
      if (progress === undefined) {
        outcome.progress = outcome.internalMarks;
      }
    }
    if (labCourse !== undefined) {
      outcome.labCourse = String(labCourse || '').trim();
      if (!outcome.category) {
        outcome.category = outcome.labCourse;
      }
    }
    if (labExperiment !== undefined) outcome.labExperiment = String(labExperiment || '').trim();
    if (title) outcome.title = title;
    if (description) outcome.description = description;
    if (category) outcome.category = category;
    if (status) outcome.status = status;
    if (progress !== undefined) outcome.progress = progress;

    res.json({
      success: true,
      data: outcome
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/outcomes/:id', (req, res) => {
  try {
    if (dbReady()) {
      Outcome.findByIdAndDelete(req.params.id).then(deleted => {
        if (!deleted) return res.status(404).json({ success: false, error: 'Learning outcome not found' });
        res.json({ success: true, data: deleted, message: 'Learning outcome deleted successfully' });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const index = learningOutcomes.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Learning outcome not found'
      });
    }

    const deletedOutcome = learningOutcomes.splice(index, 1);
    res.json({
      success: true,
      data: deletedOutcome[0],
      message: 'Learning outcome deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ STUDENT PROJECTS ROUTES ============

app.get('/api/projects', (req, res) => {
  try {
    const studentId = req.query.studentId || '1';
    if (dbReady()) {
      // If studentId looks like an ObjectId, try to query by that; otherwise fallback by custom field
      const query = {};
      if (studentId) query.studentId = studentId;
      Project.find(query).lean().then(items => {
        const normalized = items.map(item => ({
          ...item,
          verificationStatus: item.verificationStatus || 'Pending',
          reviewRemarks: item.reviewRemarks || ''
        }));
        res.json({ success: true, data: normalized });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const studentProjects = projects
      .filter(p => p.studentId === studentId)
      .map(item => ({
        ...item,
        verificationStatus: item.verificationStatus || 'Pending',
        reviewRemarks: item.reviewRemarks || ''
      }));
    
    res.json({
      success: true,
      data: studentProjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    if (dbReady()) {
      Project.findById(req.params.id).lean().then(project => {
        if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: project });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registerNumber,
      department,
      title,
      name,
      status,
      description,
      date,
      icon,
      technologies,
      certificateFileName,
      certificateFileType,
      certificateFileData
    } = req.body;

    if (!title || !name) {
      return res.status(400).json({
        success: false,
        error: 'Title and name are required'
      });
    }

    if (dbReady()) {
      const p = new Project({
        studentId,
        studentName,
        registerNumber,
        department,
        title,
        name,
        status: status || 'In Progress',
        description: description || '',
        date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        icon: icon || '📁',
        technologies: technologies || [],
        certificateFileName: certificateFileName || '',
        certificateFileType: certificateFileType || '',
        certificateFileData: certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      });
      p.save().then(saved => res.status(201).json({ success: true, data: saved })).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const newProject = {
      id: uuidv4(),
      studentId: studentId || '1',
      studentName: studentName || 'Student',
      registerNumber: registerNumber || '',
      department: department || 'N/A',
      title,
      name,
      status: status || 'In Progress',
      description: description || '',
      date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      icon: icon || '📁',
      technologies: technologies || [],
      certificateFileName: certificateFileName || '',
      certificateFileType: certificateFileType || '',
      certificateFileData: certificateFileData || '',
      verificationStatus: 'Pending',
      reviewRemarks: '',
      reviewedAt: null
    };

    projects.push(newProject);
    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    if (dbReady()) {
      Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(updated => {
        if (!updated) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: updated });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const { title, name, status, description, technologies } = req.body;
    if (title) project.title = title;
    if (name) project.name = name;
    if (status) project.status = status;
    if (description) project.description = description;
    if (technologies) project.technologies = technologies;

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    if (dbReady()) {
      Project.findByIdAndDelete(req.params.id).then(deleted => {
        if (!deleted) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: deleted, message: 'Project deleted successfully' });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const deletedProject = projects.splice(index, 1);
    res.json({
      success: true,
      data: deletedProject[0],
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ STUDENT COURSES ROUTES ============

app.get('/api/courses', (req, res) => {
  try {
    const studentId = req.query.studentId || '1';
    if (dbReady()) {
      Course.find({ studentId }).lean().then(items => {
        const normalized = items.map(item => ({
          ...item,
          verificationStatus: item.verificationStatus || 'Pending',
          reviewRemarks: item.reviewRemarks || ''
        }));
        res.json({ success: true, data: normalized });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const studentCourses = courses
      .filter(c => c.studentId === studentId)
      .map(item => ({
        ...item,
        verificationStatus: item.verificationStatus || 'Pending',
        reviewRemarks: item.reviewRemarks || ''
      }));
    
    res.json({
      success: true,
      data: studentCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/courses', (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registerNumber,
      department,
      title,
      name,
      status,
      progress,
      icon,
      rating,
      certificateFileName,
      certificateFileType,
      certificateFileData
    } = req.body;

    if (!title || !name) {
      return res.status(400).json({
        success: false,
        error: 'Title and name are required'
      });
    }

    if (dbReady()) {
      const c = new Course({
        studentId,
        studentName,
        registerNumber,
        department,
        title,
        name,
        status: status || 'In Progress',
        progress: progress || 0,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        icon: icon || '📚',
        rating: rating || 4.5,
        certificateFileName: certificateFileName || '',
        certificateFileType: certificateFileType || '',
        certificateFileData: certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      });
      c.save().then(saved => res.status(201).json({ success: true, data: saved })).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const newCourse = {
      id: uuidv4(),
      studentId: studentId || '1',
      studentName: studentName || 'Student',
      registerNumber: registerNumber || '',
      department: department || 'N/A',
      title,
      name,
      status: status || 'In Progress',
      progress: progress || 0,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      icon: icon || '📚',
      rating: rating || 4.5,
      certificateFileName: certificateFileName || '',
      certificateFileType: certificateFileType || '',
      certificateFileData: certificateFileData || '',
      verificationStatus: 'Pending',
      reviewRemarks: '',
      reviewedAt: null
    };

    courses.push(newCourse);
    res.status(201).json({
      success: true,
      data: newCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ STUDENT INTERNSHIPS ROUTES ============

app.get('/api/internships', (req, res) => {
  try {
    const studentId = req.query.studentId || '1';
    if (dbReady()) {
      Internship.find({ studentId }).lean().then(items => {
        const normalized = items.map(item => ({
          ...item,
          verificationStatus: item.verificationStatus || 'Pending',
          reviewRemarks: item.reviewRemarks || ''
        }));
        res.json({ success: true, data: normalized });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const studentInternships = internships
      .filter(i => i.studentId === studentId)
      .map(item => ({
        ...item,
        verificationStatus: item.verificationStatus || 'Pending',
        reviewRemarks: item.reviewRemarks || ''
      }));
    
    res.json({
      success: true,
      data: studentInternships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/internships', (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registerNumber,
      department,
      title,
      name,
      status,
      duration,
      icon,
      mentor,
      certificateFileName,
      certificateFileType,
      certificateFileData
    } = req.body;

    if (!title || !name) {
      return res.status(400).json({
        success: false,
        error: 'Title and name are required'
      });
    }

    if (dbReady()) {
      const i = new Internship({
        studentId,
        studentName,
        registerNumber,
        department,
        title,
        name,
        status: status || 'In Progress',
        duration: duration || '1 month',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        icon: icon || '🏢',
        mentor: mentor || 'TBD',
        certificateFileName: certificateFileName || '',
        certificateFileType: certificateFileType || '',
        certificateFileData: certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      });
      i.save().then(saved => res.status(201).json({ success: true, data: saved })).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const newInternship = {
      id: uuidv4(),
      studentId: studentId || '1',
      studentName: studentName || 'Student',
      registerNumber: registerNumber || '',
      department: department || 'N/A',
      title,
      name,
      status: status || 'In Progress',
      duration: duration || '1 month',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      icon: icon || '🏢',
      mentor: mentor || 'TBD',
      certificateFileName: certificateFileName || '',
      certificateFileType: certificateFileType || '',
      certificateFileData: certificateFileData || '',
      verificationStatus: 'Pending',
      reviewRemarks: '',
      reviewedAt: null
    };

    internships.push(newInternship);
    res.status(201).json({
      success: true,
      data: newInternship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ STUDENT PAPERS ROUTES ============

app.get('/api/papers', (req, res) => {
  try {
    const studentId = req.query.studentId || '1';
    if (dbReady()) {
      Paper.find({ studentId }).lean().then(items => {
        const normalized = items.map(item => ({
          ...item,
          verificationStatus: item.verificationStatus || 'Pending',
          reviewRemarks: item.reviewRemarks || ''
        }));
        res.json({ success: true, data: normalized });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const studentPapers = papers
      .filter(p => p.studentId === studentId)
      .map(item => ({
        ...item,
        verificationStatus: item.verificationStatus || 'Pending',
        reviewRemarks: item.reviewRemarks || ''
      }));
    
    res.json({
      success: true,
      data: studentPapers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/papers', (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registerNumber,
      department,
      title,
      name,
      status,
      icon,
      authors,
      certificateFileName,
      certificateFileType,
      certificateFileData
    } = req.body;

    if (!title || !name) {
      return res.status(400).json({
        success: false,
        error: 'Title and name are required'
      });
    }

    if (dbReady()) {
      const p = new Paper({
        studentId,
        studentName,
        registerNumber,
        department,
        title,
        name,
        status: status || 'In Progress',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        icon: icon || '📄',
        authors: authors || [],
        certificateFileName: certificateFileName || '',
        certificateFileType: certificateFileType || '',
        certificateFileData: certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      });
      p.save().then(saved => res.status(201).json({ success: true, data: saved })).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const newPaper = {
      id: uuidv4(),
      studentId: studentId || '1',
      studentName: studentName || 'Student',
      registerNumber: registerNumber || '',
      department: department || 'N/A',
      title,
      name,
      status: status || 'In Progress',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      icon: icon || '📄',
      authors: authors || [],
      certificateFileName: certificateFileName || '',
      certificateFileType: certificateFileType || '',
      certificateFileData: certificateFileData || '',
      verificationStatus: 'Pending',
      reviewRemarks: '',
      reviewedAt: null
    };

    papers.push(newPaper);
    res.status(201).json({
      success: true,
      data: newPaper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ STUDENT CERTIFICATIONS ROUTES ============

app.get('/api/certifications', (req, res) => {
  try {
    const studentId = req.query.studentId || '1';

    if (dbReady()) {
      const hasValidId = studentId && mongoose.Types.ObjectId.isValid(studentId);
      const query = hasValidId ? { _id: studentId, role: 'student' } : { role: 'student' };

      User.findOne(query).select('certifications').lean().then(student => {
        const certs = (student?.certifications || [])
          .filter(item => !item.studentId || item.studentId === studentId)
          .map(item => ({
            ...item,
            id: item._id ? item._id.toString() : item.id
          }));
        res.json({ success: true, data: certs });
      }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    const studentCertifications = certificateSubmissions
      .filter(c => c.studentId === studentId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({
      success: true,
      data: studentCertifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/certifications', (req, res) => {
  try {
    const {
      studentId,
      studentName,
      registerNumber,
      department,
      courseName,
      platformName,
      courseDuration,
      completionDate,
      certificateId,
      certificateFileName,
      certificateFileType,
      certificateFileData
    } = req.body;

    if (!studentName || !registerNumber || !department || !courseName || !platformName || !courseDuration || !completionDate || !certificateFileName) {
      return res.status(400).json({
        success: false,
        error: 'All online course certificate submission fields are required'
      });
    }

    const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (certificateFileType && !allowedFileTypes.includes(certificateFileType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Only PDF and image files are allowed'
      });
    }

    const newCertification = {
      id: uuidv4(),
      studentId: studentId || '1',
      studentName,
      registerNumber,
      department,
      courseName,
      platformName,
      courseDuration,
      completionDate: new Date(completionDate),
      certificateId: certificateId || '',
      certificateFileName,
      certificateFileType: certificateFileType || 'application/octet-stream',
      certificateFileData: certificateFileData || '',
      status: 'Pending',
      rejectionReason: '',
      adminRemarks: '',
      reviewedAt: null,
      submittedAt: new Date()
    };

    if (dbReady()) {
      const hasValidId = newCertification.studentId && mongoose.Types.ObjectId.isValid(newCertification.studentId);
      const query = hasValidId ? { _id: newCertification.studentId, role: 'student' } : { role: 'student' };

      User.findOne(query).then(student => {
        if (!student) {
          return res.status(404).json({ success: false, error: 'Student not found' });
        }
        student.certifications = student.certifications || [];
        student.certifications.push(newCertification);
        student.save().then(() => {
          res.status(201).json({ success: true, data: newCertification });
        }).catch(err => {
          res.status(500).json({ success: false, error: err.message });
        });
      }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    certificateSubmissions.unshift(newCertification);
    res.status(201).json({
      success: true,
      data: newCertification,
      message: 'Certificate submitted successfully. Status is Pending.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ ANNOUNCEMENTS ROUTES ============

app.get('/api/announcements', (req, res) => {
  try {
    const { targetRole, department } = req.query;

    if (dbReady()) {
      const query = {};
      if (targetRole) {
        query.targetRole = { $in: [targetRole, 'all'] };
      }
      if (department) {
        query.department = { $in: [department, 'All'] };
      }

      Announcement.find(query).sort({ publishDate: -1 }).lean().then(items => {
        res.json({ success: true, data: items });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    let items = [...announcements];
    if (targetRole) {
      items = items.filter(a => a.targetRole === 'all' || a.targetRole === targetRole);
    }
    if (department) {
      items = items.filter(a => a.department === 'All' || a.department === department);
    }

    items.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/announcements', (req, res) => {
  try {
    const { title, message, type, targetRole, department, publishedBy, publishDate, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    if (dbReady()) {
      const a = new Announcement({
        title,
        message,
        type: type || 'General',
        targetRole: targetRole || 'all',
        department: department || 'All',
        publishedBy: publishedBy || 'Admin',
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        priority: priority || 'medium'
      });

      a.save().then(saved => res.status(201).json({ success: true, data: saved })).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    const newAnnouncement = {
      id: uuidv4(),
      title,
      message,
      type: type || 'General',
      targetRole: targetRole || 'all',
      department: department || 'All',
      publishedBy: publishedBy || 'Admin',
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      priority: priority || 'medium'
    };

    announcements.unshift(newAnnouncement);
    res.status(201).json({ success: true, data: newAnnouncement });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ CO-PO MAPPING ROUTES ============

app.get('/api/copo-mappings', (req, res) => {
  try {
    const { department, semester, courseCode } = req.query;

    if (dbReady()) {
      const query = {};
      if (department) query.department = department;
      if (semester) query.semester = Number(semester);
      if (courseCode) query.courseCode = courseCode;

      COPOMapping.find(query).lean().then(items => {
        res.json({ success: true, data: items });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    let items = [...copoMappings];
    if (department) items = items.filter(item => item.department === department);
    if (semester) items = items.filter(item => item.semester === Number(semester));
    if (courseCode) items = items.filter(item => item.courseCode === courseCode);

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ ADMIN ROUTES ============

// Get verification queue for internships, papers, and courses
app.get('/api/admin/verifications', (req, res) => {
  try {
    const { type, status, department } = req.query;
    const allowedTypes = ['internship', 'paper', 'course', 'project'];
    const requestedTypes = type && allowedTypes.includes(type) ? [type] : allowedTypes;

    const normalize = (item, itemType) => ({
      ...item,
      id: item.id || (item._id ? item._id.toString() : undefined),
      type: itemType,
      verificationStatus: item.verificationStatus || 'Pending',
      reviewRemarks: item.reviewRemarks || ''
    });

    const applyFilters = (items) => {
      let filtered = items;
      if (status) filtered = filtered.filter(entry => entry.verificationStatus === status);
      if (department) filtered = filtered.filter(entry => String(entry.department || '').toLowerCase() === String(department).toLowerCase());
      return filtered.sort((a, b) => new Date(b.createdAt || b.submittedAt || b.date || 0) - new Date(a.createdAt || a.submittedAt || a.date || 0));
    };

    if (dbReady()) {
      const tasks = [];
      if (requestedTypes.includes('internship')) tasks.push(Internship.find().lean().then(items => items.map(item => normalize(item, 'internship'))));
      if (requestedTypes.includes('paper')) tasks.push(Paper.find().lean().then(items => items.map(item => normalize(item, 'paper'))));
      if (requestedTypes.includes('course')) tasks.push(Course.find().lean().then(items => items.map(item => normalize(item, 'course'))));
      if (requestedTypes.includes('project')) tasks.push(Project.find().lean().then(items => items.map(item => normalize(item, 'project'))));

      Promise.all(tasks).then(groups => {
        const merged = groups.flat();
        res.json({ success: true, data: applyFilters(merged) });
      }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    let merged = [];
    if (requestedTypes.includes('internship')) {
      merged = merged.concat(internships.map(item => normalize(item, 'internship')));
    }
    if (requestedTypes.includes('paper')) {
      merged = merged.concat(papers.map(item => normalize(item, 'paper')));
    }
    if (requestedTypes.includes('course')) {
      merged = merged.concat(courses.map(item => normalize(item, 'course')));
    }
    if (requestedTypes.includes('project')) {
      merged = merged.concat(projects.map(item => normalize(item, 'project')));
    }

    res.json({ success: true, data: applyFilters(merged) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve or reject internship/paper/course submission
app.put('/api/admin/verifications/:type/:id/review', (req, res) => {
  try {
    const { type, id } = req.params;
    const { status, reviewRemarks } = req.body;
    const allowedTypes = ['internship', 'paper', 'course', 'project'];
    const allowedStatuses = ['Approved', 'Rejected'];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid verification type' });
    }
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be Approved or Rejected' });
    }

    const remarks = String(reviewRemarks || '').trim();
    if (status === 'Rejected' && !remarks) {
      return res.status(400).json({ success: false, error: 'Review remarks are required when rejecting' });
    }

    const applyReview = (item) => {
      item.verificationStatus = status;
      item.reviewRemarks = status === 'Rejected' ? remarks : '';
      item.reviewedAt = new Date();
      return item;
    };

    if (dbReady()) {
      const modelMap = { internship: Internship, paper: Paper, course: Course, project: Project };
      const model = modelMap[type];
      model.findById(id).then(record => {
        if (!record) return res.status(404).json({ success: false, error: 'Submission not found' });
        applyReview(record);
        record.save().then(saved => {
          res.json({ success: true, data: saved, message: `Submission ${status.toLowerCase()} successfully` });
        }).catch(err => res.status(500).json({ success: false, error: err.message }));
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const storeMap = { internship: internships, paper: papers, course: courses, project: projects };
    const store = storeMap[type];
    const item = store.find(entry => String(entry.id) === String(id));
    if (!item) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    applyReview(item);
    res.json({ success: true, data: item, message: `Submission ${status.toLowerCase()} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all certificate submissions with filters
app.get('/api/admin/certifications', (req, res) => {
  try {
    const { department, status, fromDate, toDate } = req.query;

    if (dbReady()) {
      User.find({ role: 'student' }).select('certifications name rollNumber department').lean().then(students => {
        let allCertifications = [];

        students.forEach(student => {
          const items = (student.certifications || []).map(cert => ({
            ...cert,
            id: cert._id ? cert._id.toString() : cert.id,
            studentId: cert.studentId || (student._id ? student._id.toString() : student.id),
            studentName: cert.studentName || student.name || 'N/A',
            registerNumber: cert.registerNumber || student.rollNumber || 'N/A',
            department: cert.department || student.department || 'N/A'
          }));
          allCertifications = allCertifications.concat(items);
        });

        if (department) {
          allCertifications = allCertifications.filter(item => item.department === department);
        }
        if (status) {
          allCertifications = allCertifications.filter(item => item.status === status);
        }
        if (fromDate) {
          allCertifications = allCertifications.filter(item => new Date(item.submittedAt) >= new Date(fromDate));
        }
        if (toDate) {
          const inclusiveEnd = new Date(toDate);
          inclusiveEnd.setHours(23, 59, 59, 999);
          allCertifications = allCertifications.filter(item => new Date(item.submittedAt) <= inclusiveEnd);
        }

        allCertifications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        res.json({ success: true, data: allCertifications });
      }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    let items = [...certificateSubmissions];
    if (department) {
      items = items.filter(item => item.department === department);
    }
    if (status) {
      items = items.filter(item => item.status === status);
    }
    if (fromDate) {
      items = items.filter(item => new Date(item.submittedAt) >= new Date(fromDate));
    }
    if (toDate) {
      const inclusiveEnd = new Date(toDate);
      inclusiveEnd.setHours(23, 59, 59, 999);
      items = items.filter(item => new Date(item.submittedAt) <= inclusiveEnd);
    }

    items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Approve or reject certificate submission
app.put('/api/admin/certifications/:id/review', (req, res) => {
  try {
    const { status, rejectionReason, adminRemarks } = req.body;
    const remarks = String(adminRemarks || rejectionReason || '').trim();
    const allowedStatuses = ['Approved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Status must be Approved or Rejected' });
    }

    if (status === 'Rejected' && !remarks) {
      return res.status(400).json({ success: false, error: 'Rejection reason is mandatory when status is Rejected' });
    }

    if (dbReady()) {
      User.find({ role: 'student', 'certifications._id': req.params.id }).then(students => {
        if (!students || students.length === 0) {
          return res.status(404).json({ success: false, error: 'Certificate submission not found' });
        }

        const targetStudent = students[0];
        const cert = targetStudent.certifications.id(req.params.id);
        if (!cert) {
          return res.status(404).json({ success: false, error: 'Certificate submission not found' });
        }

        cert.status = status;
        cert.rejectionReason = status === 'Rejected' ? remarks : '';
        cert.adminRemarks = status === 'Rejected' ? remarks : '';
        cert.reviewedAt = new Date();

        targetStudent.save().then(() => {
          res.json({ success: true, data: cert, message: `Submission ${status.toLowerCase()} successfully` });
        }).catch(err => {
          res.status(500).json({ success: false, error: err.message });
        });
      }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    const item = certificateSubmissions.find(cert => cert.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Certificate submission not found' });
    }

    item.status = status;
    item.rejectionReason = status === 'Rejected' ? remarks : '';
    item.adminRemarks = status === 'Rejected' ? remarks : '';
    item.reviewedAt = new Date();

    res.json({
      success: true,
      data: item,
      message: `Submission ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download certificate data
app.get('/api/admin/certifications/:id/download', (req, res) => {
  try {
    const respondWithFileMeta = (item) => {
      if (!item) {
        return res.status(404).json({ success: false, error: 'Certificate submission not found' });
      }

      if (!item.certificateFileName) {
        return res.status(404).json({ success: false, error: 'Certificate file not available' });
      }

      return res.json({
        success: true,
        data: {
          id: item.id || (item._id ? item._id.toString() : undefined),
          certificateFileName: item.certificateFileName,
          certificateFileType: item.certificateFileType || 'application/octet-stream',
          certificateFileData: item.certificateFileData || ''
        }
      });
    };

    if (dbReady()) {
      User.find({ role: 'student' }).select('certifications').lean().then(students => {
        let found = null;
        for (const student of students) {
          const items = student.certifications || [];
          const match = items.find(cert => (cert._id ? cert._id.toString() : cert.id) === req.params.id);
          if (match) {
            found = {
              ...match,
              id: match._id ? match._id.toString() : match.id
            };
            break;
          }
        }
        respondWithFileMeta(found);
      }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
      });
      return;
    }

    const item = certificateSubmissions.find(cert => cert.id === req.params.id);
    return respondWithFileMeta(item);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all students
app.get('/api/admin/students', (req, res) => {
  try {
    if (dbReady()) {
      User.find({ role: 'student' }).select('-password').lean().then(items => {
        res.json({ success: true, data: items });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const safeStudents = allStudents.map(({ password, ...item }) => item);

    res.json({
      success: true,
      data: safeStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create student
app.post('/api/admin/students', (req, res) => {
  try {
    const { name, rollNumber, email, department, loginId, password, year, semester, cgpa, sgpa, attendance, status } = req.body;

    if (!name || !rollNumber || !email || !department || !loginId || !password) {
      return res.status(400).json({ success: false, error: 'Name, roll number, email, department, login ID and password are required' });
    }

    if (dbReady()) {
      const payload = {
        name,
        rollNumber,
        email,
        department,
        loginId,
        year: year !== undefined ? Number(year) : 1,
        semester: semester !== undefined ? Number(semester) : 1,
        cgpa: cgpa !== undefined ? Number(cgpa) : 0,
        sgpa: sgpa !== undefined ? Number(sgpa) : 0,
        attendance: attendance !== undefined ? Number(attendance) : 0,
        status: status || 'Active',
        role: 'student',
        password
      };

      User.findOne({ $or: [{ email }, { rollNumber }, { loginId }] }).then(exists => {
        if (exists) return res.status(409).json({ success: false, error: 'Student with same email, roll number or login ID already exists' });
        const student = new User(payload);
        student.save().then(saved => {
          const safe = saved.toObject();
          delete safe.password;
          safe.id = safe._id ? safe._id.toString() : safe.id;
          res.status(201).json({ success: true, data: safe, message: 'Student created successfully' });
        }).catch(err => res.status(500).json({ success: false, error: err.message }));
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const duplicate = allStudents.find(s => s.email === email || s.rollNumber === rollNumber || s.loginId === loginId);
    if (duplicate) {
      return res.status(409).json({ success: false, error: 'Student with same email, roll number or login ID already exists' });
    }

    const newStudent = {
      id: String(allStudents.length + 1),
      name,
      loginId,
      password,
      rollNumber,
      email,
      department,
      year: year !== undefined ? Number(year) : 1,
      semester: semester !== undefined ? Number(semester) : 1,
      cgpa: cgpa !== undefined ? Number(cgpa) : 0,
      sgpa: sgpa !== undefined ? Number(sgpa) : 0,
      attendance: attendance !== undefined ? Number(attendance) : 0,
      status: status || 'Active'
    };

    allStudents.push(newStudent);
    const { password: removedPassword, ...safeStudent } = newStudent;
    res.status(201).json({ success: true, data: safeStudent, message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get student by ID
app.get('/api/admin/students/:id', (req, res) => {
  try {
    if (dbReady()) {
      User.findById(req.params.id).select('-password').lean().then(student => {
        if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
        res.json({ success: true, data: student });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const student = allStudents.find(s => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    const { password, ...safeStudent } = student;
    res.json({
      success: true,
      data: safeStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update student
app.put('/api/admin/students/:id', (req, res) => {
  try {
    if (dbReady()) {
      const { name, email, department, rollNumber, year, semester, cgpa, sgpa, attendance, status, exams } = req.body;
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (email !== undefined) updates.email = email;
      if (department !== undefined) updates.department = department;
      if (rollNumber !== undefined) updates.rollNumber = rollNumber;
      if (year !== undefined) updates.year = Number(year);
      if (semester !== undefined) updates.semester = Number(semester);
      if (cgpa !== undefined) updates.cgpa = Number(cgpa);
      if (sgpa !== undefined) updates.sgpa = Number(sgpa);
      if (attendance !== undefined) updates.attendance = Number(attendance);
      if (status !== undefined) updates.status = status;
      if (exams !== undefined) updates.exams = exams;

      User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password').then(updated => {
        if (!updated) return res.status(404).json({ success: false, error: 'Student not found' });
        res.json({ success: true, data: updated, message: 'Student updated successfully' });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const student = allStudents.find(s => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const { name, email, department, rollNumber, year, semester, cgpa, sgpa, attendance, status, exams } = req.body;
    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (department !== undefined) student.department = department;
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (year !== undefined) student.year = year;
    if (semester !== undefined) student.semester = semester;
    if (cgpa !== undefined) student.cgpa = cgpa;
    if (sgpa !== undefined) student.sgpa = sgpa;
    if (attendance !== undefined) student.attendance = attendance;
    if (status) student.status = status;
    if (exams !== undefined) student.exams = exams;

    const { password, ...safeStudent } = student;

    res.json({
      success: true,
      data: safeStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update student credentials (faculty/admin only by dashboard access)
app.put('/api/admin/students/:id/credentials', (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, error: 'Login ID and password are required' });
    }

    if (dbReady()) {
      User.findOne({ role: 'student', loginId, _id: { $ne: req.params.id } }).then(duplicate => {
        if (duplicate) return res.status(409).json({ success: false, error: 'Login ID already in use' });

        User.findByIdAndUpdate(req.params.id, { loginId, password }, { new: true }).select('-password').then(updated => {
          if (!updated) return res.status(404).json({ success: false, error: 'Student not found' });
          res.json({ success: true, data: updated, message: 'Student credentials updated successfully' });
        }).catch(err => res.status(500).json({ success: false, error: err.message }));
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const student = allStudents.find(s => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const duplicate = allStudents.find(s => s.id !== req.params.id && s.loginId === loginId);
    if (duplicate) {
      return res.status(409).json({ success: false, error: 'Login ID already in use' });
    }

    student.loginId = loginId;
    student.password = password;

    const { password: removedPassword, ...safeStudent } = student;
    res.json({ success: true, data: safeStudent, message: 'Student credentials updated successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete student
app.delete('/api/admin/students/:id', (req, res) => {
  try {
    if (dbReady()) {
      User.findByIdAndDelete(req.params.id).then(deleted => {
        if (!deleted) return res.status(404).json({ success: false, error: 'Student not found' });
        res.json({ success: true, data: deleted, message: 'Student deleted successfully' });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const index = allStudents.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const deletedStudent = allStudents.splice(index, 1);
    res.json({
      success: true,
      data: deletedStudent[0],
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get analytics data
app.get('/api/admin/analytics', (req, res) => {
  try {
    if (dbReady()) {
      Promise.all([
        User.find({ role: 'student' }).lean(),
        Project.find().lean(),
        Outcome.find().lean()
      ]).then(([usersDB, projectsDB, outcomesDB]) => {
        const totalStudents = usersDB.length;
        const avgCGPA = totalStudents ? (usersDB.reduce((sum, s) => sum + (s.cgpa || 0), 0) / totalStudents).toFixed(2) : '0.00';
        const avgAttendance = totalStudents ? (usersDB.reduce((sum, s) => sum + (s.attendance || 0), 0) / totalStudents).toFixed(1) : '0.0';
        const activeProjects = projectsDB.filter(p => p.status === 'In Progress').length;

        const departmentStats = {};
        usersDB.forEach(student => {
          if (!departmentStats[student.department]) {
            departmentStats[student.department] = { students: 0, totalCGPA: 0 };
          }
          departmentStats[student.department].students += 1;
          departmentStats[student.department].totalCGPA += (student.cgpa || 0);
        });

        const departmentArray = Object.entries(departmentStats).map(([name, data]) => ({
          name,
          students: data.students,
          avgCGPA: data.students ? (data.totalCGPA / data.students).toFixed(1) : '0.0'
        }));

        const learningOutcomeCompletion = outcomesDB.map(outcome => ({
          name: outcome.subject || outcome.title,
          completion: Number(outcome.progress ?? outcome.internalMarks ?? 0)
        }));

        res.json({ success: true, data: { totalStudents, avgCGPA, avgAttendance, activeProjects, departmentStats: departmentArray, learningOutcomeCompletion } });
      }).catch(err => res.status(500).json({ success: false, error: err.message }));
      return;
    }

    const totalStudents = allStudents.length;
    const avgCGPA = (allStudents.reduce((sum, s) => sum + s.cgpa, 0) / totalStudents).toFixed(2);
    const avgAttendance = (allStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents).toFixed(1);
    const activeProjects = projects.filter(p => p.status === 'In Progress').length;

    const departmentStats = {};
    allStudents.forEach(student => {
      if (!departmentStats[student.department]) {
        departmentStats[student.department] = { students: 0, totalCGPA: 0 };
      }
      departmentStats[student.department].students += 1;
      departmentStats[student.department].totalCGPA += student.cgpa;
    });

    const departmentArray = Object.entries(departmentStats).map(([name, data]) => ({
      name,
      students: data.students,
      avgCGPA: (data.totalCGPA / data.students).toFixed(1)
    }));

    const learningOutcomeCompletion = learningOutcomes.map(outcome => ({
      name: outcome.subject || outcome.title,
      completion: Number(outcome.progress ?? outcome.internalMarks ?? 0)
    }));

    res.json({
      success: true,
      data: {
        totalStudents,
        avgCGPA,
        avgAttendance,
        activeProjects,
        departmentStats: departmentArray,
        learningOutcomeCompletion
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    database: dbReady() ? 'connected' : 'disconnected',
    status: 'OK'
  };
  res.json(health);
});

// ============ Error Handling Middleware ============

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Uploaded file is too large. Please upload a smaller PDF/image.'
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============ Start Server & Graceful Shutdown ============

const server = app.listen(PORT, () => {
  console.log(`✅ Academic Learning Outcome Dashboard API running on port ${PORT}`);
  console.log(`\n📚 Available Routes:
  
Authentication:
  POST /api/login

Student Routes:
  GET /api/student/profile
  GET /api/outcomes - Get all learning outcomes
  POST /api/outcomes - Create outcome
  GET /api/projects - Get student projects
  POST /api/projects - Create project
  GET /api/courses - Get student courses
  POST /api/courses - Create course
  GET /api/internships - Get internships
  POST /api/internships - Create internship
  GET /api/papers - Get papers
  POST /api/papers - Create paper

Admin Routes:
  GET /api/admin/students - Get all students
  GET /api/admin/students/:id - Get student
  PUT /api/admin/students/:id - Update student
  DELETE /api/admin/students/:id - Delete student
  GET /api/admin/verifications - Get internship/paper/course/project submissions
  PUT /api/admin/verifications/:type/:id/review - Approve or reject submission
  GET /api/admin/certifications - Get certificate submissions
  PUT /api/admin/certifications/:id/review - Approve or reject submission
  GET /api/admin/certifications/:id/download - Download certificate
  GET /api/admin/analytics - Get analytics data

Health & Status:
  GET /api/health - Server & DB health check
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    if (mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    if (mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  });
});
