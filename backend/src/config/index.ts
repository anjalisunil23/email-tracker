import dotenv from "dotenv";

dotenv.config();

let runtimeBackendUrl = process.env.BACKEND_URL || "http://localhost:5002";

export function setBackendUrl(url: string) {
  runtimeBackendUrl = url.replace(/\/$/, "");
  process.env.BACKEND_URL = runtimeBackendUrl;
}

export function getBackendUrl() {
  return runtimeBackendUrl;
}

const config = {
  get port() {
    return process.env.PORT || 5002;
  },
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  get backendUrl() {
    return runtimeBackendUrl;
  },
};

export default config;
