import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import seedDemoUser from './config/seed';
import config from './config';

import authRoutes from './routes/auth';
import emailRoutes from './routes/email';
import trackRoutes from './routes/track';
import analyticsRoutes from './routes/analytics';
import settingsRoutes from './routes/settings';

const app = express();

// Serve static files (e.g., .well-known folder) from the backend's public directory
app.use(express.static('public'));


// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "*"],
    },
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.get('/', (req, res) => {
  res.send('<h1>Zenith Mail Lab API</h1><p>Backend is running on port 5001.</p>');
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contacts', require('./routes/contacts').default);
app.use('/api/templates', require('./routes/templates').default);

const PORT = config.port;

import { startScheduler } from './services/scheduler';
import { initSocket } from './services/socket';
import http from 'http';

const server = http.createServer(app);
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    await seedDemoUser();
    startScheduler(); // Start the background scheduler for pending emails
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
