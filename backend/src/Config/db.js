import mongoose from 'mongoose';
import { Config } from './index.js';

export const connnectDB = async () => {
  try {
    await mongoose.connect(Config.MONGO_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    return error;
  }
}