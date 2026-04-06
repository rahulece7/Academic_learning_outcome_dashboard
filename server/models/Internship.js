const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: String,
  registerNumber: String,
  department: String,
  title: String,
  name: String,
  status: String,
  duration: String,
  date: String,
  icon: String,
  mentor: String,
  certificateFileName: String,
  certificateFileType: String,
  certificateFileData: String,
  verificationStatus: { type: String, default: 'Pending' },
  reviewRemarks: { type: String, default: '' },
  reviewedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Internship', InternshipSchema);
