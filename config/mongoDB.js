import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(`MongoDB connection error:, ${err.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close(false);
    logger.info('MongoDB disconnected');
  } catch (err) {
    logger.error('Error during Mongo disconnect:', err);
  }
};
