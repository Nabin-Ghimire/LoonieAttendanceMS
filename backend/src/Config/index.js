import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(__dirname)
config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const {
  MONGO_URI,
  CLOUDINARY_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  PRIVATE_KEY,
  REFRESH_TOKEN_SECRET,
  PORT,
  USER_MAIL,
  USER_PASS,
} = process.env;

export const Config = {
  MONGO_URI,
  CLOUDINARY_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  PRIVATE_KEY,
  REFRESH_TOKEN_SECRET,
  PORT,
  USER_MAIL,
  USER_PASS,

};
