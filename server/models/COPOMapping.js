const mongoose = require('mongoose');

const COPOMappingSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  courseOutcomes: [{
    code: String,
    description: String,
    attainment: Number,
    target: Number
  }],
  programOutcomes: [{
    code: String, 
    description: String,
    progress: Number,
    target: Number
  }],
  skillLevels: [{
    skill: String,
    level: String,
    percentage: Number
  }],
  semester: Number,
  department: String
}, { timestamps: true });

module.exports = mongoose.model('COPOMapping', COPOMappingSchema);
