# Mail Tracker - Installation & Setup Guide

## Project Overview

Mail Tracker is a full-stack email tracking application built with:

- **Frontend**: React + TanStack Router + Vite + TypeScript
- **Backend**: Express.js + MongoDB + Mongoose + TypeScript
- **Database**: MongoDB (with in-memory option for development)
- **Authentication**: JWT + bcryptjs

---

## Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **Bun** (v1.0.0+)
- **MongoDB** (v4.4 or higher) - for production
  - OR use in-memory MongoDB (included for development)
- **Git**

### Check versions:

```bash
node --version
npm --version
git --version
```

---

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd zenith-mail-lab
```

### 2. Install Root Dependencies

```bash
npm install
# OR using Bun:
bun install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
# OR using Bun:
bun install
cd ..
```

### 4. Configure Environment Variables

#### Create `.env` file in the root `backend/` directory:

```bash
cd backend
touch .env
```

#### Add the following environment variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/mailtracker
USE_MEMORY_DB=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for sending emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
BACKEND_URL=http://localhost:5000

# SMTP Configuration
SKIP_SMTP=true
```

**Environment Variables Explained:**

| Variable        | Purpose                          | Default                               |
| --------------- | -------------------------------- | ------------------------------------- |
| `MONGO_URI`     | MongoDB connection string        | mongodb://127.0.0.1:27017/mailtracker |
| `USE_MEMORY_DB` | Use in-memory DB for development | true                                  |
| `JWT_SECRET`    | Secret key for JWT tokens        | Required                              |
| `EMAIL_USER`    | Gmail address for sending emails | -                                     |
| `EMAIL_PASS`    | Gmail app-specific password      | -                                     |
| `PORT`          | Backend server port              | 5000                                  |
| `BACKEND_URL`   | Backend URL for frontend calls   | http://localhost:5000                 |
| `SKIP_SMTP`     | Skip SMTP validation in dev      | true                                  |

---

### 5. Set Up MongoDB (Optional - For Production)

#### Option A: Local MongoDB Installation

**On Windows:**

1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start as a Windows service
4. Update `.env`: `MONGO_URI=mongodb://127.0.0.1:27017/mailtracker`

**On macOS (using Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Linux (Ubuntu/Debian):**

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env`: `MONGO_URI=<your-atlas-connection-string>`
5. Set `USE_MEMORY_DB=false`

---

### 6. Build Backend (TypeScript)

```bash
cd backend
npm run build
# OR
bun run build
```

---

## Running the Application

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
# OR
bun run dev
```

Expected output:

```
MongoDB connected
Seeded demo user (anjali@mailtrack.io / password)
Server started on port 5000
```

#### Terminal 2: Start Frontend Development Server

```bash
npm run dev
# OR
bun run dev
```

Expected output:

```
VITE v5.x.x  ready in xxx ms
➜  local:   http://localhost:5173/
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## Initial Login

**Demo Account Credentials:**

- Email: `anjali@mailtrack.io`
- Password: `password`

The demo account is automatically seeded with:

- Demo user profile
- Sample emails
- Sample open events
- Sample click events

---

## API Endpoints

### Authentication

```
POST   /api/auth/register      - Create new account
POST   /api/auth/login         - Login and get JWT token
```

### Email Management

```
POST   /api/email/send         - Send tracked email
GET    /api/email/list         - Get user's emails
GET    /api/email/:id          - Get email details
```

### Tracking

```
POST   /api/track/open/:id     - Record email open
POST   /api/track/click/:id    - Record link click
```

### Analytics

```
GET    /api/analytics/summary  - Get analytics overview
GET    /api/analytics/emails   - Get email analytics
GET    /api/analytics/events   - Get event details
```

---

## Project Structure

```
zenith-mail-lab/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts         # Database connection
│   │   │   ├── index.ts      # Configuration
│   │   │   └── seed.ts       # Database seeding
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express app setup
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                 # Environment variables
├── src/
│   ├── components/          # React components
│   ├── routes/             # TanStack Router routes
│   ├── services/           # API services
│   ├── lib/                # Utilities and helpers
│   └── styles.css          # Global styles
├── package.json
├── vite.config.ts
└── README.md
```

---

## Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**

1. Check if MongoDB is running:

   ```bash
   # Windows
   Get-Service MongoDB

   # macOS
   brew services list

   # Linux
   sudo systemctl status mongodb
   ```

2. Verify `MONGO_URI` in `.env`
3. For in-memory DB, ensure `USE_MEMORY_DB=true`

### Issue: Port Already in Use

**Backend (port 5000):**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Frontend (port 5173):**

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Issue: JWT Authentication Errors

1. Ensure `JWT_SECRET` is set in `.env`
2. Check that tokens are being sent in Authorization header:
   ```
   Authorization: Bearer <token>
   ```
3. Verify token expiration

### Issue: Email Sending Not Working

1. For Gmail:
   - Enable 2-factor authentication
   - Generate app-specific password
   - Use app password in `EMAIL_PASS`
2. If testing, set `SKIP_SMTP=true` in `.env`

### Issue: Frontend Can't Connect to Backend

1. Check `BACKEND_URL` matches backend server address
2. Verify backend is running on port 5000
3. Check CORS configuration in `backend/src/server.ts`
4. Ensure frontend API calls use correct base URL

---

## Production Deployment

### Backend Deployment (Node.js hosting)

1. **Build TypeScript:**

   ```bash
   cd backend
   npm run build
   ```

2. **Set Production Environment Variables:**

   ```env
   NODE_ENV=production
   USE_MEMORY_DB=false
   MONGO_URI=<production-mongodb-uri>
   JWT_SECRET=<strong-random-secret>
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

### Frontend Deployment (Static hosting)

1. **Build:**

   ```bash
   npm run build
   ```

2. **Output:** Built files in `dist/` directory

3. **Deploy to:**
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

---

## Database Backup

### MongoDB Local Backup

```bash
# Backup
mongodump --uri "mongodb://127.0.0.1:27017/mailtracker" --out ./backup

# Restore
mongorestore --uri "mongodb://127.0.0.1:27017/mailtracker" ./backup
```

### MongoDB Atlas Backup

Use Atlas built-in backup features in the UI.

---

## Development Commands

```bash
# Root directory
npm install              # Install all dependencies
npm run dev            # Start dev mode (frontend + backend)
npm run build          # Build frontend
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Backend directory
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run build          # Compile TypeScript to JavaScript

# Frontend (root)
npm run preview        # Preview production build
npm run build:dev      # Build in development mode
```

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## Support

For issues or questions:

1. Check the [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for schema details
2. Review API endpoint documentation
3. Check environment variable configuration
4. Review backend logs for error messages

---

## License

ISC License - See LICENSE file for details
