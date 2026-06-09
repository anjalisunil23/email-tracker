import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5002',
};

export default config;
