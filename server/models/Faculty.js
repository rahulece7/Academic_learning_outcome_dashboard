const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  department: String,
  subjects: [{
    name: String,
    code: String,
    semester: Number
  }],
  workload: Number,
  performanceRating: Number,
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
