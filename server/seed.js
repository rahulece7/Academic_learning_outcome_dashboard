const { connectDB, mongoose } = require('./db');
const User = require('./models/User');
const Outcome = require('./models/Outcome');
const Project = require('./models/Project');
const Course = require('./models/Course');
const Internship = require('./models/Internship');
const Paper = require('./models/Paper');
const Faculty = require('./models/Faculty');
const Announcement = require('./models/Announcement');
const COPOMapping = require('./models/COPOMapping');

async function runSeed() {
  await connectDB();
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    console.warn('DB not connected — skipping seed.');
    process.exit(0);
  }

  // Check if users exist
  const ucount = await User.countDocuments();
  if (ucount === 0) {
    await User.create([
      { 
        email: 'student@example.com', 
        password: 'password123', 
        name: 'Arjun Sharma', 
        role: 'student', 
        rollNumber: 'A101', 
        department: 'Computer Science',
        program: 'B.Tech',
        semester: 6,
        year: 3,
        phone: '+91 9876543210',
        mentor: {
          name: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@college.edu',
          phone: '+91 9988776655'
        },
        cgpa: 8.5, 
        sgpa: 8.7, 
        attendance: 88,
        subjects: [
          { name: 'Data Structures', code: 'CS301', internal: 45, external: 75, total: 120, grade: 'A', credits: 4, attendance: 92 },
          { name: 'Database Management', code: 'CS302', internal: 42, external: 70, total: 112, grade: 'A', credits: 4, attendance: 85 },
          { name: 'Operating Systems', code: 'CS303', internal: 40, external: 68, total: 108, grade: 'B+', credits: 4, attendance: 82 },
          { name: 'Computer Networks', code: 'CS304', internal: 48, external: 80, total: 128, grade: 'A+', credits: 4, attendance: 95 },
          { name: 'Software Engineering', code: 'CS305', internal: 44, external: 73, total: 117, grade: 'A', credits: 3, attendance: 88 }
        ],
        gradeHistory: [
          { semester: 1, sgpa: 7.8, cgpa: 7.8, year: 1 },
          { semester: 2, sgpa: 8.1, cgpa: 8.0, year: 1 },
          { semester: 3, sgpa: 8.3, cgpa: 8.1, year: 2 },
          { semester: 4, sgpa: 8.6, cgpa: 8.2, year: 2 },
          { semester: 5, sgpa: 8.5, cgpa: 8.3, year: 3 },
          { semester: 6, sgpa: 8.7, cgpa: 8.5, year: 3 }
        ],
        assignments: [
          { title: 'DBMS Assignment 1', subject: 'Database Management', dueDate: new Date('2026-02-20'), status: 'Pending', marks: null, totalMarks: 20, feedback: '' },
          { title: 'OS Lab Report 3', subject: 'Operating Systems', dueDate: new Date('2026-02-25'), status: 'Submitted', marks: 18, totalMarks: 20, feedback: 'Good work!' },
          { title: 'Networks Case Study', subject: 'Computer Networks', dueDate: new Date('2026-03-01'), status: 'Pending', marks: null, totalMarks: 25, feedback: '' }
        ],
        exams: [
          { name: 'Mid Term 1', subject: 'Data Structures', date: new Date('2026-02-28'), hallTicket: 'HT2026A101', resultPublished: false, marks: null },
          { name: 'Mid Term 1', subject: 'Database Management', date: new Date('2026-03-02'), hallTicket: 'HT2026A101', resultPublished: false, marks: null }
        ],
        certifications: [
          { title: 'AWS Cloud Practitioner', provider: 'Amazon Web Services', completionDate: new Date('2025-12-15'), status: 'Completed', certificateUrl: 'https://cert.aws.com/12345' },
          { title: 'Python for Data Science', provider: 'Coursera', completionDate: null, status: 'In Progress', certificateUrl: '' },
          { title: 'Machine Learning Basics', provider: 'Udemy', completionDate: null, status: 'Recommended', certificateUrl: '' }
        ],
        notifications: [
          { title: 'Exam Schedule Released', message: 'Mid-term exam schedule for Semester 6 is now available', type: 'Exam', date: new Date('2026-02-10'), read: false },
          { title: 'Assignment Deadline', message: 'DBMS Assignment 1 due on Feb 20, 2026', type: 'General', date: new Date('2026-02-12'), read: false },
          { title: 'Tech Fest 2026', message: 'Register for annual tech fest happening on March 15-17', type: 'Event', date: new Date('2026-02-09'), read: true }
        ]
      },
      { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' }
    ]);
    console.log('Seeded users');
  }

  const seededStudent = await User.findOne({ email: 'student@example.com' }).lean();
  const studentId = seededStudent ? seededStudent._id : null;

  const ocount = await Outcome.countDocuments();
  if (ocount === 0) {
    await Outcome.create([
      { title: 'Critical Thinking', description: 'Analyze information', status: 'In Progress', progress: 75, category: 'Cognitive Skills' },
      { title: 'Communication', description: 'Articulate ideas', status: 'Completed', progress: 100, category: 'Soft Skills' }
    ]);
    console.log('Seeded outcomes');
  }

  const pcount = await Project.countDocuments();
  if (pcount === 0 && studentId) {
    await Project.create([
      {
        studentId,
        title: 'E-Commerce Platform',
        name: 'Team Alpha',
        status: 'Completed',
        description: 'Built a full-stack e-commerce platform using React and Node.js',
        date: 'Dec 2024',
        icon: '🛒',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      {
        studentId,
        title: 'Machine Learning Model',
        name: 'Data Science Project',
        status: 'In Progress',
        description: 'Developing a predictive model for student performance',
        date: 'Jan 2025',
        icon: '🤖',
        technologies: ['Python', 'TensorFlow', 'Pandas']
      },
      {
        studentId,
        title: 'Mobile App Development',
        name: 'Flutter Application',
        status: 'In Progress',
        description: 'Creating a cross-platform mobile application',
        date: 'Feb 2025',
        icon: '📱',
        technologies: ['Flutter', 'Dart', 'Firebase']
      }
    ]);
    console.log('Seeded projects');
  }

  const cscount = await Course.countDocuments();
  if (cscount === 0 && studentId) {
    await Course.create([
      {
        studentId,
        title: 'Advanced JavaScript',
        name: 'Udemy',
        status: 'Completed',
        progress: 100,
        date: 'Nov 2024',
        icon: '📚',
        rating: 4.8
      },
      {
        studentId,
        title: 'React Fundamentals',
        name: 'Coursera',
        status: 'In Progress',
        progress: 75,
        date: 'Jan 2025',
        icon: '⚛️',
        rating: 4.9
      },
      {
        studentId,
        title: 'Web Design Masterclass',
        name: 'LinkedIn Learning',
        status: 'In Progress',
        progress: 45,
        date: 'Feb 2025',
        icon: '🎨',
        rating: 4.5
      }
    ]);
    console.log('Seeded courses');
  }

  const icount = await Internship.countDocuments();
  if (icount === 0 && studentId) {
    await Internship.create([
      {
        studentId,
        title: 'Software Development Intern',
        name: 'TechCorp Solutions',
        status: 'Completed',
        duration: '3 months',
        date: 'Jun - Aug 2024',
        icon: '🏢',
        mentor: 'John Smith'
      },
      {
        studentId,
        title: 'Data Analytics Intern',
        name: 'Data Insights Inc',
        status: 'Completed',
        duration: '2 months',
        date: 'Sep - Oct 2024',
        icon: '📊',
        mentor: 'Jane Doe'
      },
      {
        studentId,
        title: 'Full Stack Developer',
        name: 'StartUp XYZ',
        status: 'In Progress',
        duration: '6 months',
        date: 'Jan 2025 - Jun 2025',
        icon: '💻',
        mentor: 'Mike Johnson'
      }
    ]);
    console.log('Seeded internships');
  }

  const pacount = await Paper.countDocuments();
  if (pacount === 0 && studentId) {
    await Paper.create([
      {
        studentId,
        title: 'AI in Education: A Comprehensive Review',
        name: 'International Conference 2024',
        status: 'Published',
        date: 'Dec 2024',
        icon: '📄',
        authors: ['Arjun Sharma', 'Prof. Kumar']
      },
      {
        studentId,
        title: 'Blockchain Applications in Healthcare',
        name: 'IEEE Journal',
        status: 'Published',
        date: 'Nov 2024',
        icon: '⛓️',
        authors: ['Arjun Sharma', 'Dr. Patel']
      },
      {
        studentId,
        title: 'Machine Learning for Climate Prediction',
        name: 'National Symposium',
        status: 'Presented',
        date: 'Jan 2025',
        icon: '🌍',
        authors: ['Arjun Sharma', 'Dr. Singh', 'Prof. Gupta']
      }
    ]);
    console.log('Seeded papers');
  }

  const fcount = await Faculty.countDocuments();
  if (fcount === 0) {
    await Faculty.create([
      { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@college.edu', phone: '+91 9988776655', department: 'Computer Science', subjects: [{ name: 'Data Structures', code: 'CS301', semester: 6 }], workload: 16, performanceRating: 4.5 },
      { name: 'Prof. Priya Singh', email: 'priya.singh@college.edu', phone: '+91 9876543211', department: 'Computer Science', subjects: [{ name: 'Database Management', code: 'CS302', semester: 6 }], workload: 14, performanceRating: 4.7 }
    ]);
    console.log('Seeded faculty');
  }

  const acount = await Announcement.countDocuments();
  if (acount === 0) {
    await Announcement.create([
      { title: 'Mid-Term Exams Schedule', message: 'Mid-term exams will be conducted from Feb 28 to March 5, 2026', type: 'Exam', targetRole: 'student', department: 'All', publishedBy: 'Admin', publishDate: new Date('2026-02-10'), priority: 'high' },
      { title: 'Tech Fest 2026', message: 'Annual tech fest registration is now open. Register before March 1st', type: 'Event', targetRole: 'all', department: 'All', publishedBy: 'Admin', publishDate: new Date('2026-02-09'), priority: 'medium' }
    ]);
    console.log('Seeded announcements');
  }

  const ccount = await COPOMapping.countDocuments();
  if (ccount === 0) {
    await COPOMapping.create([
      {
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
          { skill: 'Algorithm Design', level: 'Intermediate', percentage: 75 }
        ],
        semester: 6,
        department: 'Computer Science'
      }
    ]);
    console.log('Seeded CO-PO mappings');
  }

  console.log('Seeding complete');
  process.exit(0);
}

runSeed().catch(err => { console.error(err); process.exit(1); });
