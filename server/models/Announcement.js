const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  message: { type: String, required: true },
  type: { type: String, enum: ['Circular', 'Exam', 'Event', 'General'], default: 'General' },
  targetRole: { type: String, enum: ['student', 'all'], default: 'all' },
  department: String,
  publishedBy: String,
  publishDate: { type: Date, default: Date.now },
  expiryDate: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
