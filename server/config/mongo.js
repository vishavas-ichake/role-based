const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, { dbName: 'taskdb' });
  console.log('MongoDB connected');
};
