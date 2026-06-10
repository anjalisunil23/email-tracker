import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import seedDemoUser from "./config/seed";
import config from "./config";

import authRoutes from "./routes/auth";
import emailRoutes from "./routes/email";
import trackRoutes from "./routes/track";
import analyticsRoutes from "./routes/analytics";
import settingsRoutes from "./routes/settings";

const app = express();
const PORT = config.port;

app.set("trust proxy", 1);

// Serve static files (e.g., tracking pixel) from the backend's public directory
app.use(express.static("public"));

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send(`<h1>Mail Tracker API</h1><p>Backend is running on port ${PORT}.</p>`);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/contacts", require("./routes/contacts").default);
app.use("/api/templates", require("./routes/templates").default);

import { startScheduler } from "./services/scheduler";
import { initSocket } from "./services/socket";
import { startTrackingTunnel } from "./services/tunnel";
import http from "http";

const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    await seedDemoUser();
    const portNum = typeof PORT === "string" ? parseInt(PORT, 10) : Number(PORT);
    await startTrackingTunnel(portNum);
    startScheduler();
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Tracking base URL: ${config.backendUrl}`);
      console.log(`Gmail sender: ${config.emailUser || "(not configured)"}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
