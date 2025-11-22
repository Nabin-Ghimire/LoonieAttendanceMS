import mongoose from 'mongoose';
import { Config } from './index.js';


export const connnectDB = async () => {
  try {
    console.log("Connecting to:", Config.MONGO_URI);
    await mongoose.connect(Config.MONGO_URI);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return error;
  }
};
