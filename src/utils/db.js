require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    logger.info('DB connected');
  } catch (error) {
    logger.err(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
