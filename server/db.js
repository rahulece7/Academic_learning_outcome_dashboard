const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set. Server will run with in-memory data.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
  }
}

module.exports = { connectDB, mongoose };
