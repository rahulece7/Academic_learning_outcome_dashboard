const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: String,
  registerNumber: String,
  department: String,
  title: String,
  name: String,
  status: String,
  date: String,
  icon: String,
  authors: [String],
  certificateFileName: String,
  certificateFileType: String,
  certificateFileData: String,
  verificationStatus: { type: String, default: 'Pending' },
  reviewRemarks: { type: String, default: '' },
  reviewedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Paper', PaperSchema);
