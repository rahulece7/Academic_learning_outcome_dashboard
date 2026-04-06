// Lightweight mock API used when backend is not available.
// Components call `fetchOrMock(url)` which returns a response-like object.

const buildMockStudents = (count = 200) => {
  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
  const items = [];
  for (let index = 1; index <= count; index += 1) {
    items.push({
      id: String(index),
      name: `Student ${index}`,
      loginId: `std${String(index).padStart(3, '0')}`,
      password: `pass${String(index).padStart(3, '0')}`,
      rollNumber: `A${String(100 + index).padStart(3, '0')}`,
      email: `student${index}@example.com`,
      department: departments[(index - 1) % departments.length],
      year: ((index - 1) % 4) + 1,
      semester: ((index - 1) % 8) + 1,
      cgpa: Number((6.5 + ((index * 7) % 35) / 10).toFixed(1)),
      sgpa: Number((6.3 + ((index * 5) % 34) / 10).toFixed(1)),
      attendance: 70 + ((index * 3) % 31),
      status: 'Active'
    });
  }
  items[0] = {
    ...items[0],
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
    status: 'Active'
  };
  return items;
};

const SAMPLE = {
  announcements: [
    { id: 'a1', title: 'Mid-Term Exams Schedule', message: 'Mid-term exams will be conducted from Feb 28 to March 5, 2026', type: 'Exam', targetRole: 'student', department: 'All', publishedBy: 'Admin', publishDate: '2026-02-10', priority: 'high' },
    { id: 'a2', title: 'Tech Fest 2026', message: 'Annual tech fest registration is now open. Register before March 1st', type: 'Event', targetRole: 'all', department: 'All', publishedBy: 'Admin', publishDate: '2026-02-09', priority: 'medium' }
  ],
  copoMappings: [
    {
      id: 'cm1',
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
  ],
  outcomes: [
    { id: 'o1', subject: 'Data Structures', assignmentMarks: 82, assignmentTitle: 'Linked List Assignment', internalMarks: 78, labCourse: 'Data Structures Lab', labExperiment: 'Stack and Queue Implementation', title: 'Data Structures', progress: 78 },
    { id: 'o2', subject: 'Database Management Systems', assignmentMarks: 88, assignmentTitle: 'SQL Query Assignment', internalMarks: 84, labCourse: 'DBMS Lab', labExperiment: 'Normalization and Joins', title: 'Database Management Systems', progress: 84 },
    { id: 'o3', subject: 'Operating Systems', assignmentMarks: 74, assignmentTitle: 'Scheduling Assignment', internalMarks: 71, labCourse: 'System Programming Lab', labExperiment: 'Process Synchronization', title: 'Operating Systems', progress: 71 }
  ],
  projects: [
    { id: 'p1', studentId: '1', title: 'E-Commerce Platform', name: 'Team Alpha', status: 'Completed', description: 'Full-stack e-commerce platform', date: 'Dec 2024' },
    { id: 'p2', studentId: '1', title: 'Chat App', name: 'Team Beta', status: 'In Progress', description: 'Realtime chat application', date: 'Jan 2025' }
  ],
  courses: [
    { id: 'c1', studentId: '1', title: 'Advanced JavaScript', name: 'Udemy', status: 'Completed', progress: 100, date: 'Nov 2024' },
    { id: 'c2', studentId: '1', title: 'React - The Complete Guide', name: 'Coursera', status: 'In Progress', progress: 45, date: 'Feb 2025' }
  ],
  internships: [
    { id: 'i1', studentId: '1', title: 'Software Development Intern', name: 'TechCorp Solutions', status: 'Completed', duration: '3 months', date: 'Jun - Aug 2024', mode: 'Offline' }
  ],
  papers: [
    { id: 'pa1', studentId: '1', title: 'AI in Education: A Comprehensive Review', name: 'International Conference 2024', status: 'Published', date: 'Dec 2024', description: 'Review of AI use-cases in education.' }
  ],
  certifications: [
    {
      id: 'cert1',
      studentId: '1',
      studentName: 'Arjun Sharma',
      registerNumber: 'A101',
      department: 'Computer Science',
      courseName: 'Cloud Foundations',
      platformName: 'Coursera',
      courseDuration: '8 weeks',
      completionDate: '2026-01-15',
      certificateId: 'CF-2026-9812',
      status: 'Approved',
      rejectionReason: '',
      adminRemarks: '',
      reviewedAt: '2026-01-17T10:15:00.000Z',
      certificateFileName: 'cloud-internship.pdf',
      submittedAt: '2026-01-16'
    },
    {
      id: 'cert2',
      studentId: '1',
      studentName: 'Arjun Sharma',
      registerNumber: 'A101',
      department: 'Computer Science',
      courseName: 'Data Analytics Basics',
      platformName: 'NPTEL',
      courseDuration: '4 weeks',
      completionDate: '2026-02-20',
      certificateId: 'NPTEL-DA-447',
      status: 'Rejected',
      rejectionReason: 'Uploaded file is unclear. Please upload a readable copy.',
      adminRemarks: 'Uploaded file is unclear. Please upload a readable copy.',
      reviewedAt: '2026-02-22T09:30:00.000Z',
      certificateFileName: 'data-analytics.jpg',
      submittedAt: '2026-02-21'
    },
    {
      id: 'cert3',
      studentId: '1',
      studentName: 'Arjun Sharma',
      registerNumber: 'A101',
      department: 'Computer Science',
      courseName: 'UI/UX Fundamentals',
      platformName: 'Udemy',
      courseDuration: '6 weeks',
      completionDate: '2026-02-28',
      certificateId: '',
      status: 'Pending',
      rejectionReason: '',
      adminRemarks: '',
      reviewedAt: null,
      certificateFileName: 'uiux-certificate.png',
      submittedAt: '2026-03-01'
    }
  ],
  adminStudents: buildMockStudents(200),
  analytics: {
    totalStudents: 1,
    avgCGPA: '8.50',
    avgAttendance: '85',
    activeProjects: 1,
    departmentStats: [{ name: 'Computer Science', students: 1, avgCGPA: '8.5' }],
    learningOutcomeCompletion: [{ name: 'Critical Thinking', completion: 75 }]
  }
};

function ok(data) {
  return Promise.resolve({ ok: true, json: async () => ({ success: true, data }) });
}

function created(data) {
  return Promise.resolve({ ok: true, status: 201, json: async () => ({ success: true, data }) });
}

export async function fetchOrMock(url, options) {
  // If the real backend is reachable, prefer it. But to keep frontend-only,
  // we try a fast fetch with timeout; on failure we return sample data.
  const shouldUseMock = process.env.REACT_APP_FORCE_MOCK === 'true';
  if (shouldUseMock) {
    // route by path
    if (url.startsWith('/api/student/profile')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId') || '1';
      const student = SAMPLE.adminStudents.find(s => s.id === studentId) || SAMPLE.adminStudents[0];
      if (!student) return ok({});
      const { password, ...safeStudent } = student;
      return ok(safeStudent);
    }
    if (url.startsWith('/api/announcements') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const targetRole = (parsed.searchParams.get('targetRole') || '').toLowerCase();
      const department = (parsed.searchParams.get('department') || '').toLowerCase();

      const filtered = SAMPLE.announcements.filter((item) => {
        const itemRole = String(item.targetRole || 'all').toLowerCase();
        const itemDept = String(item.department || 'all').toLowerCase();

        const roleMatch = !targetRole || itemRole === 'all' || itemRole === targetRole;
        const deptMatch = !department || itemDept === 'all' || itemDept === department;
        return roleMatch && deptMatch;
      });

      return ok(filtered);
    }
    if (url.startsWith('/api/announcements') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `a-${Date.now()}`,
        title: body.title,
        message: body.message,
        type: body.type || 'General',
        targetRole: body.targetRole || 'all',
        department: body.department || 'All',
        publishedBy: body.publishedBy || 'Admin',
        publishDate: new Date().toISOString(),
        priority: body.priority || 'medium'
      };
      SAMPLE.announcements.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/copo-mappings')) return ok(SAMPLE.copoMappings);
    if (url.startsWith('/api/outcomes') && (!options || options.method === 'GET')) return ok(SAMPLE.outcomes);
    if (url.startsWith('/api/outcomes') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      if (!String(body.subject || '').trim()) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Subject is required' }) });
      }
      const item = {
        id: `o-${Date.now()}`,
        subject: String(body.subject || '').trim(),
        assignmentMarks: Number(body.assignmentMarks || 0),
        assignmentTitle: String(body.assignmentTitle || '').trim(),
        internalMarks: Number(body.internalMarks || 0),
        labCourse: String(body.labCourse || '').trim(),
        labExperiment: String(body.labExperiment || '').trim(),
        title: String(body.subject || '').trim(),
        progress: Number(body.internalMarks || 0)
      };
      SAMPLE.outcomes.unshift(item);
      return created(item);
    }
    if (url.match(/^\/api\/outcomes\/[^/]+$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[3];
      const item = SAMPLE.outcomes.find(entry => entry.id === id);
      if (!item) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Outcome not found' }) });
      item.subject = body.subject !== undefined ? String(body.subject || '').trim() : item.subject;
      item.assignmentMarks = body.assignmentMarks !== undefined ? Number(body.assignmentMarks || 0) : item.assignmentMarks;
      item.assignmentTitle = body.assignmentTitle !== undefined ? String(body.assignmentTitle || '').trim() : item.assignmentTitle;
      item.internalMarks = body.internalMarks !== undefined ? Number(body.internalMarks || 0) : item.internalMarks;
      item.labCourse = body.labCourse !== undefined ? String(body.labCourse || '').trim() : item.labCourse;
      item.labExperiment = body.labExperiment !== undefined ? String(body.labExperiment || '').trim() : item.labExperiment;
      item.title = item.subject;
      item.progress = item.internalMarks;
      return ok(item);
    }
    if (url.match(/^\/api\/outcomes\/[^/]+$/) && options && options.method === 'DELETE') {
      const id = url.split('/')[3];
      const index = SAMPLE.outcomes.findIndex(entry => entry.id === id);
      if (index === -1) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Outcome not found' }) });
      const deleted = SAMPLE.outcomes.splice(index, 1)[0];
      return ok(deleted);
    }
    if (url.startsWith('/api/projects') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.projects.filter(item => item.studentId === studentId) : SAMPLE.projects;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/projects') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `pr-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'In Progress',
        description: body.description || '',
        technologies: body.technologies || [],
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.projects.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/courses') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.courses.filter(item => item.studentId === studentId) : SAMPLE.courses;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/courses') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `c-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'Completed',
        progress: body.progress ?? 100,
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.courses.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/internships') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.internships.filter(item => item.studentId === studentId) : SAMPLE.internships;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/internships') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `i-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'Completed',
        duration: body.duration || '1 month',
        mentor: body.mentor || '',
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.internships.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/papers') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.papers.filter(item => item.studentId === studentId) : SAMPLE.papers;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/papers') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `p-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'Presented',
        authors: body.authors || [],
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.papers.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/certifications') && (!options || options.method === 'GET')) return ok(SAMPLE.certifications);
    if (url.startsWith('/api/certifications') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const newItem = {
        id: `cert-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName,
        registerNumber: body.registerNumber,
        department: body.department,
        courseName: body.courseName,
        platformName: body.platformName,
        courseDuration: body.courseDuration,
        completionDate: body.completionDate,
        certificateId: body.certificateId || '',
        status: 'Pending',
        rejectionReason: '',
        adminRemarks: '',
        reviewedAt: null,
        certificateFileName: body.certificateFileName,
        submittedAt: new Date().toISOString()
      };
      SAMPLE.certifications.unshift(newItem);
      return created(newItem);
    }
    if (url.startsWith('/api/admin/certifications') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const department = parsed.searchParams.get('department');
      const status = parsed.searchParams.get('status');
      const fromDate = parsed.searchParams.get('fromDate');
      const toDate = parsed.searchParams.get('toDate');

      let items = [...SAMPLE.certifications];
      if (department) items = items.filter(item => item.department === department);
      if (status) items = items.filter(item => item.status === status);
      if (fromDate) items = items.filter(item => new Date(item.submittedAt) >= new Date(fromDate));
      if (toDate) {
        const inclusiveEnd = new Date(toDate);
        inclusiveEnd.setHours(23, 59, 59, 999);
        items = items.filter(item => new Date(item.submittedAt) <= inclusiveEnd);
      }

      items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      return ok(items);
    }
    if (url.match(/^\/api\/admin\/certifications\/[^/]+\/review$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[4];
      const item = SAMPLE.certifications.find(cert => cert.id === id);
      if (!item) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Certificate submission not found' }) });
      if (body.status === 'Rejected' && !String(body.adminRemarks || body.rejectionReason || '').trim()) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Rejection reason is mandatory when status is Rejected' }) });
      }
      item.status = body.status;
      const remarks = body.status === 'Rejected' ? String(body.adminRemarks || body.rejectionReason || '').trim() : '';
      item.rejectionReason = remarks;
      item.adminRemarks = remarks;
      item.reviewedAt = new Date().toISOString();
      return ok(item);
    }
    if (url.startsWith('/api/admin/verifications') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const type = parsed.searchParams.get('type');
      const status = parsed.searchParams.get('status');
      let data = [];

      if (!type || type === 'internship') data = data.concat(SAMPLE.internships.map(item => ({ ...item, type: 'internship' })));
      if (!type || type === 'paper') data = data.concat(SAMPLE.papers.map(item => ({ ...item, type: 'paper' })));
      if (!type || type === 'course') data = data.concat(SAMPLE.courses.map(item => ({ ...item, type: 'course' })));
      if (!type || type === 'project') data = data.concat(SAMPLE.projects.map(item => ({ ...item, type: 'project' })));

      data = data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' }));
      if (status) data = data.filter(item => (item.verificationStatus || 'Pending') === status);
      data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      return ok(data);
    }
    if (url.match(/^\/api\/admin\/verifications\/(internship|paper|course|project)\/[^/]+\/review$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const parts = url.split('/');
      const type = parts[4];
      const id = parts[5];

      if (body.status === 'Rejected' && !String(body.reviewRemarks || '').trim()) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Review remarks are required when rejecting' }) });
      }

      const map = { internship: SAMPLE.internships, paper: SAMPLE.papers, course: SAMPLE.courses, project: SAMPLE.projects };
      const store = map[type] || [];
      const item = store.find(entry => entry.id === id);
      if (!item) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Submission not found' }) });

      item.verificationStatus = body.status;
      item.reviewRemarks = body.status === 'Rejected' ? String(body.reviewRemarks || '').trim() : '';
      item.reviewedAt = new Date().toISOString();
      return ok(item);
    }
    if (url === '/api/admin/students' && (!options || options.method === 'GET')) return ok(SAMPLE.adminStudents);
    if (url === '/api/admin/students' && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const exists = SAMPLE.adminStudents.find(s => s.email === body.email || s.rollNumber === body.rollNumber);
      if (exists) return Promise.resolve({ ok: false, status: 409, json: async () => ({ success: false, error: 'Student with same email or roll number already exists' }) });
      const student = {
        id: String(SAMPLE.adminStudents.length + 1),
        name: body.name,
        loginId: body.loginId || `std${String(SAMPLE.adminStudents.length + 1).padStart(3, '0')}`,
        password: body.password || 'password123',
        rollNumber: body.rollNumber,
        email: body.email,
        department: body.department,
        year: body.year ?? 1,
        semester: body.semester ?? 1,
        cgpa: body.cgpa ?? 0,
        sgpa: body.sgpa ?? 0,
        attendance: body.attendance ?? 0,
        status: body.status || 'Active'
      };
      SAMPLE.adminStudents.push(student);
      const { password, ...safeStudent } = student;
      return created(safeStudent);
    }
    if (url.match(/^\/api\/admin\/students\/[^/]+$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[4];
      const student = SAMPLE.adminStudents.find(s => s.id === id);
      if (!student) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Student not found' }) });
      Object.assign(student, body);
      const { password, ...safeStudent } = student;
      return ok(safeStudent);
    }
    if (url.match(/^\/api\/admin\/students\/[^/]+\/credentials$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[4];
      const student = SAMPLE.adminStudents.find(s => s.id === id);
      if (!student) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Student not found' }) });
      if (!body.loginId || !body.password) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Login ID and password are required' }) });
      }
      const duplicate = SAMPLE.adminStudents.find(s => s.id !== id && s.loginId === body.loginId);
      if (duplicate) return Promise.resolve({ ok: false, status: 409, json: async () => ({ success: false, error: 'Login ID already in use' }) });
      student.loginId = body.loginId;
      student.password = body.password;
      const { password, ...safeStudent } = student;
      return ok(safeStudent);
    }
    if (url.match(/^\/api\/admin\/students\/[^/]+$/) && options && options.method === 'DELETE') {
      const id = url.split('/')[4];
      const index = SAMPLE.adminStudents.findIndex(s => s.id === id);
      if (index === -1) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Student not found' }) });
      const deleted = SAMPLE.adminStudents.splice(index, 1)[0];
      return ok(deleted);
    }
    if (url === '/api/admin/analytics') return ok(SAMPLE.analytics);
    // default
    return ok({});
  }

  // unreachable in frontend-only by default, but keep fallback
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    // fallback to mock
    if (url.startsWith('/api/student/profile')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId') || '1';
      const student = SAMPLE.adminStudents.find(s => s.id === studentId) || SAMPLE.adminStudents[0];
      if (!student) return ok({});
      const { password, ...safeStudent } = student;
      return ok(safeStudent);
    }
    if (url.startsWith('/api/announcements') && (!options || options.method === 'GET')) return ok(SAMPLE.announcements);
    if (url.startsWith('/api/announcements') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `a-${Date.now()}`,
        title: body.title,
        message: body.message,
        type: body.type || 'General',
        targetRole: body.targetRole || 'all',
        department: body.department || 'All',
        publishedBy: body.publishedBy || 'Admin',
        publishDate: new Date().toISOString(),
        priority: body.priority || 'medium'
      };
      SAMPLE.announcements.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/copo-mappings')) return ok(SAMPLE.copoMappings);
    if (url.startsWith('/api/outcomes') && (!options || options.method === 'GET')) return ok(SAMPLE.outcomes);
    if (url.startsWith('/api/outcomes') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      if (!String(body.subject || '').trim()) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Subject is required' }) });
      }
      const item = {
        id: `o-${Date.now()}`,
        subject: String(body.subject || '').trim(),
        assignmentMarks: Number(body.assignmentMarks || 0),
        assignmentTitle: String(body.assignmentTitle || '').trim(),
        internalMarks: Number(body.internalMarks || 0),
        labCourse: String(body.labCourse || '').trim(),
        labExperiment: String(body.labExperiment || '').trim(),
        title: String(body.subject || '').trim(),
        progress: Number(body.internalMarks || 0)
      };
      SAMPLE.outcomes.unshift(item);
      return created(item);
    }
    if (url.match(/^\/api\/outcomes\/[^/]+$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[3];
      const item = SAMPLE.outcomes.find(entry => entry.id === id);
      if (!item) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Outcome not found' }) });
      item.subject = body.subject !== undefined ? String(body.subject || '').trim() : item.subject;
      item.assignmentMarks = body.assignmentMarks !== undefined ? Number(body.assignmentMarks || 0) : item.assignmentMarks;
      item.assignmentTitle = body.assignmentTitle !== undefined ? String(body.assignmentTitle || '').trim() : item.assignmentTitle;
      item.internalMarks = body.internalMarks !== undefined ? Number(body.internalMarks || 0) : item.internalMarks;
      item.labCourse = body.labCourse !== undefined ? String(body.labCourse || '').trim() : item.labCourse;
      item.labExperiment = body.labExperiment !== undefined ? String(body.labExperiment || '').trim() : item.labExperiment;
      item.title = item.subject;
      item.progress = item.internalMarks;
      return ok(item);
    }
    if (url.match(/^\/api\/outcomes\/[^/]+$/) && options && options.method === 'DELETE') {
      const id = url.split('/')[3];
      const index = SAMPLE.outcomes.findIndex(entry => entry.id === id);
      if (index === -1) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Outcome not found' }) });
      const deleted = SAMPLE.outcomes.splice(index, 1)[0];
      return ok(deleted);
    }
    if (url.startsWith('/api/projects') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.projects.filter(item => item.studentId === studentId) : SAMPLE.projects;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/projects') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `pr-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'In Progress',
        description: body.description || '',
        technologies: body.technologies || [],
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.projects.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/courses') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.courses.filter(item => item.studentId === studentId) : SAMPLE.courses;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/courses') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `c-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'Completed',
        progress: body.progress ?? 100,
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.courses.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/internships') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.internships.filter(item => item.studentId === studentId) : SAMPLE.internships;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/internships') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `i-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'Completed',
        duration: body.duration || '1 month',
        mentor: body.mentor || '',
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.internships.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/papers') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const studentId = parsed.searchParams.get('studentId');
      const data = studentId ? SAMPLE.papers.filter(item => item.studentId === studentId) : SAMPLE.papers;
      return ok(data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' })));
    }
    if (url.startsWith('/api/papers') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const item = {
        id: `p-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName || 'Student',
        registerNumber: body.registerNumber || '',
        department: body.department || 'N/A',
        title: body.title,
        name: body.name,
        status: body.status || 'Presented',
        authors: body.authors || [],
        date: new Date().toISOString(),
        certificateFileName: body.certificateFileName || '',
        certificateFileType: body.certificateFileType || '',
        certificateFileData: body.certificateFileData || '',
        verificationStatus: 'Pending',
        reviewRemarks: '',
        reviewedAt: null
      };
      SAMPLE.papers.unshift(item);
      return created(item);
    }
    if (url.startsWith('/api/certifications') && (!options || options.method === 'GET')) return ok(SAMPLE.certifications);
    if (url.startsWith('/api/certifications') && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const newItem = {
        id: `cert-${Date.now()}`,
        studentId: body.studentId || '1',
        studentName: body.studentName,
        registerNumber: body.registerNumber,
        department: body.department,
        courseName: body.courseName,
        platformName: body.platformName,
        courseDuration: body.courseDuration,
        completionDate: body.completionDate,
        certificateId: body.certificateId || '',
        status: 'Pending',
        rejectionReason: '',
        adminRemarks: '',
        reviewedAt: null,
        certificateFileName: body.certificateFileName,
        submittedAt: new Date().toISOString()
      };
      SAMPLE.certifications.unshift(newItem);
      return created(newItem);
    }
    if (url.startsWith('/api/admin/certifications') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const department = parsed.searchParams.get('department');
      const status = parsed.searchParams.get('status');
      const fromDate = parsed.searchParams.get('fromDate');
      const toDate = parsed.searchParams.get('toDate');

      let items = [...SAMPLE.certifications];
      if (department) items = items.filter(item => item.department === department);
      if (status) items = items.filter(item => item.status === status);
      if (fromDate) items = items.filter(item => new Date(item.submittedAt) >= new Date(fromDate));
      if (toDate) {
        const inclusiveEnd = new Date(toDate);
        inclusiveEnd.setHours(23, 59, 59, 999);
        items = items.filter(item => new Date(item.submittedAt) <= inclusiveEnd);
      }

      items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      return ok(items);
    }
    if (url.match(/^\/api\/admin\/certifications\/[^/]+\/review$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[4];
      const item = SAMPLE.certifications.find(cert => cert.id === id);
      if (!item) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Certificate submission not found' }) });
      if (body.status === 'Rejected' && !String(body.adminRemarks || body.rejectionReason || '').trim()) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Rejection reason is mandatory when status is Rejected' }) });
      }
      item.status = body.status;
      const remarks = body.status === 'Rejected' ? String(body.adminRemarks || body.rejectionReason || '').trim() : '';
      item.rejectionReason = remarks;
      item.adminRemarks = remarks;
      item.reviewedAt = new Date().toISOString();
      return ok(item);
    }
    if (url.startsWith('/api/admin/verifications') && (!options || options.method === 'GET')) {
      const parsed = new URL(url, 'http://localhost');
      const type = parsed.searchParams.get('type');
      const status = parsed.searchParams.get('status');
      let data = [];

      if (!type || type === 'internship') data = data.concat(SAMPLE.internships.map(item => ({ ...item, type: 'internship' })));
      if (!type || type === 'paper') data = data.concat(SAMPLE.papers.map(item => ({ ...item, type: 'paper' })));
      if (!type || type === 'course') data = data.concat(SAMPLE.courses.map(item => ({ ...item, type: 'course' })));
      if (!type || type === 'project') data = data.concat(SAMPLE.projects.map(item => ({ ...item, type: 'project' })));

      data = data.map(item => ({ ...item, verificationStatus: item.verificationStatus || 'Pending', reviewRemarks: item.reviewRemarks || '' }));
      if (status) data = data.filter(item => (item.verificationStatus || 'Pending') === status);
      data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      return ok(data);
    }
    if (url.match(/^\/api\/admin\/verifications\/(internship|paper|course|project)\/[^/]+\/review$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const parts = url.split('/');
      const type = parts[4];
      const id = parts[5];

      if (body.status === 'Rejected' && !String(body.reviewRemarks || '').trim()) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Review remarks are required when rejecting' }) });
      }

      const map = { internship: SAMPLE.internships, paper: SAMPLE.papers, course: SAMPLE.courses, project: SAMPLE.projects };
      const store = map[type] || [];
      const item = store.find(entry => entry.id === id);
      if (!item) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Submission not found' }) });

      item.verificationStatus = body.status;
      item.reviewRemarks = body.status === 'Rejected' ? String(body.reviewRemarks || '').trim() : '';
      item.reviewedAt = new Date().toISOString();
      return ok(item);
    }
    if (url === '/api/admin/students' && (!options || options.method === 'GET')) return ok(SAMPLE.adminStudents);
    if (url === '/api/admin/students' && options && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const exists = SAMPLE.adminStudents.find(s => s.email === body.email || s.rollNumber === body.rollNumber);
      if (exists) return Promise.resolve({ ok: false, status: 409, json: async () => ({ success: false, error: 'Student with same email or roll number already exists' }) });
      const student = {
        id: String(SAMPLE.adminStudents.length + 1),
        name: body.name,
        loginId: body.loginId || `std${String(SAMPLE.adminStudents.length + 1).padStart(3, '0')}`,
        password: body.password || 'password123',
        rollNumber: body.rollNumber,
        email: body.email,
        department: body.department,
        year: body.year ?? 1,
        semester: body.semester ?? 1,
        cgpa: body.cgpa ?? 0,
        sgpa: body.sgpa ?? 0,
        attendance: body.attendance ?? 0,
        status: body.status || 'Active'
      };
      SAMPLE.adminStudents.push(student);
      const { password, ...safeStudent } = student;
      return created(safeStudent);
    }
    if (url.match(/^\/api\/admin\/students\/[^/]+$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[4];
      const student = SAMPLE.adminStudents.find(s => s.id === id);
      if (!student) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Student not found' }) });
      Object.assign(student, body);
      const { password, ...safeStudent } = student;
      return ok(safeStudent);
    }
    if (url.match(/^\/api\/admin\/students\/[^/]+\/credentials$/) && options && options.method === 'PUT') {
      const body = options.body ? JSON.parse(options.body) : {};
      const id = url.split('/')[4];
      const student = SAMPLE.adminStudents.find(s => s.id === id);
      if (!student) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Student not found' }) });
      if (!body.loginId || !body.password) {
        return Promise.resolve({ ok: false, status: 400, json: async () => ({ success: false, error: 'Login ID and password are required' }) });
      }
      const duplicate = SAMPLE.adminStudents.find(s => s.id !== id && s.loginId === body.loginId);
      if (duplicate) return Promise.resolve({ ok: false, status: 409, json: async () => ({ success: false, error: 'Login ID already in use' }) });
      student.loginId = body.loginId;
      student.password = body.password;
      const { password, ...safeStudent } = student;
      return ok(safeStudent);
    }
    if (url.match(/^\/api\/admin\/students\/[^/]+$/) && options && options.method === 'DELETE') {
      const id = url.split('/')[4];
      const index = SAMPLE.adminStudents.findIndex(s => s.id === id);
      if (index === -1) return Promise.resolve({ ok: false, status: 404, json: async () => ({ success: false, error: 'Student not found' }) });
      const deleted = SAMPLE.adminStudents.splice(index, 1)[0];
      return ok(deleted);
    }
    if (url === '/api/admin/analytics') return ok(SAMPLE.analytics);
    return ok({});
  }
}
