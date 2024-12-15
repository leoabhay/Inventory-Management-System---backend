const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Inventory');
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database cannot be connected', err);
    process.exit(1);
  }
};

module.exports = connectDB;
