const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  loginId: String,
  rollNumber: String,
  department: String,
  program: String,
  semester: Number,
  year: Number,
  phone: String,
  mentor: {
    name: String,
    email: String,
    phone: String
  },
  cgpa: Number,
  sgpa: Number,
  attendance: Number,
  status: { type: String, default: 'Active' },
  subjects: [{
    name: String,
    code: String,
    internal: Number,
    external: Number,
    total: Number,
    grade: String,
    credits: Number,
    attendance: Number
  }],
  gradeHistory: [{
    semester: Number,
    sgpa: Number,
    cgpa: Number,
    year: Number
  }],
  assignments: [{
    title: String,
    subject: String,
    dueDate: Date,
    status: String,
    marks: Number,
    totalMarks: Number,
    feedback: String
  }],
  exams: [{
    name: String,
    subject: String,
    date: Date,
    hallTicket: String,
    resultPublished: Boolean,
    marks: Number
  }],
  certifications: [{
    studentId: String,
    studentName: String,
    registerNumber: String,
    department: String,
    courseName: String,
    platformName: String,
    courseDuration: String,
    completionDate: Date,
    certificateId: String,
    status: String,
    rejectionReason: String,
    adminRemarks: String,
    reviewedAt: Date,
    certificateFileName: String,
    certificateFileType: String,
    certificateFileData: String,
    certificateUrl: String,
    submittedAt: Date
  }],
  notifications: [{
    title: String,
    message: String,
    type: String,
    date: Date,
    read: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
