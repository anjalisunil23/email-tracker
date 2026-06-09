# Mail Tracker - Email Tracking & Analytics Platform

A modern, full-stack email tracking application that monitors email opens, link clicks, and recipient engagement with detailed analytics and real-time insights.

![Mail Tracker](https://img.shields.io/badge/Email%20Tracking-Platform-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-13AA52?style=flat-square)

---

## 🎯 Features

### Core Functionality
- ✉️ **Email Tracking** - Track email opens with pixel-based tracking
- 🔗 **Link Click Tracking** - Monitor which links recipients click
- 📊 **Real-time Analytics** - View open rates, click rates, and engagement metrics
- 👥 **User Management** - Secure user registration and authentication
- 🔐 **JWT Authentication** - Token-based secure API access

### Analytics Dashboard
- 📈 Email performance metrics
- 🌍 Geographic and device tracking
- 📱 Device/Browser breakdown
- ⏰ Time-based analytics
- 🔍 Individual email detailed analytics

### Technical Features
- **TypeScript** - Full type safety across frontend and backend
- **Real-time Updates** - React Query for efficient data fetching
- **Responsive UI** - Mobile-friendly design with Tailwind CSS
- **In-Memory Database** - MongoDB Memory Server for development
- **Production Ready** - Deployable to major cloud platforms

---

## 📋 Tech Stack

### Frontend
- **React 19.2** - UI framework
- **TanStack Router 1.168** - Routing and navigation
- **TanStack Query 5.83** - Server state management
- **Vite 5.0** - Build tool
- **TypeScript 4.9** - Static typing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Hook Form** - Form management

### Backend
- **Express.js 4.18** - Web framework
- **Node.js 18+** - Runtime
- **MongoDB 6.0+** - NoSQL database
- **Mongoose 6.9** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Helmet** - Security middleware
- **CORS** - Cross-origin support

### Development Tools
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-reload
- **MongoDB Memory Server** - Test database

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0+
- npm 7.0.0+
- MongoDB 4.4+ (optional - in-memory option available)

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd zenith-mail-lab
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Configure Environment**
   ```bash
   # Create backend/.env
   cp backend/.env.example backend/.env
   ```

4. **Update `.env` file**
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/mailtracker
   USE_MEMORY_DB=true
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=5000
   BACKEND_URL=http://localhost:5000
   ```

5. **Start Development Servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Demo Account: `anjali@mailtrack.io` / `password`

---

## 📚 Documentation

- **[Installation Guide](./INSTALLATION_GUIDE.md)** - Complete setup instructions
- **[Database Schema](./DATABASE_SCHEMA.md)** - Data models and relationships
- **API Documentation** - See below

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        User login
```

### Email Management
```
POST   /api/email/send        Send tracked email
GET    /api/email/list        Get user's emails
GET    /api/email/:id         Get email details
```

### Tracking
```
POST   /api/track/open/:id    Record email open
POST   /api/track/click/:id   Record link click
```

### Analytics
```
GET    /api/analytics/summary  Overall analytics
GET    /api/analytics/emails   Email-level metrics
GET    /api/analytics/events   Event details
```

---

## 📊 Database Schema

### Collections

**Users**
- User account information
- Authentication credentials
- Account metadata

**Emails**
- Email metadata
- Tracking IDs
- Recipient information

**Open Events**
- Email open records
- Device/browser information
- IP addresses and timestamps

**Click Events**
- Link click records
- Clicked URLs
- Device/browser information

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema.

---

## 🏗️ Project Structure

```
zenith-mail-lab/
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── config/          # Database & config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # App entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                 # Environment variables
│
├── src/                      # React frontend
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── routes/              # TanStack Router
│   ├── services/            # API services
│   ├── lib/                 # Utilities
│   ├── hooks/               # React hooks
│   ├── styles.css           # Global styles
│   └── main.tsx             # App entry
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md                # This file
├── INSTALLATION_GUIDE.md    # Setup guide
└── DATABASE_SCHEMA.md       # Schema documentation
```

---

## 🔐 Authentication

- **JWT-based** authentication
- **Bcryptjs** for password hashing
- **Secure headers** via Helmet
- **Rate limiting** on API endpoints

### Usage
```
Authorization: Bearer <jwt-token>
```

---

## 📈 Analytics Features

### Email Analytics
- **Open Rate** - Percentage of recipients who opened
- **Click Rate** - Percentage of recipients who clicked
- **Unique Opens** - Deduplicated open count
- **Device Breakdown** - Desktop/Mobile/Tablet stats

### Recipient Tracking
- **Open History** - Timestamp and frequency
- **Click History** - URLs and timestamps
- **Device Info** - Device type, browser, OS
- **Location Info** - IP address tracking

---

## 🛠️ Development

### Available Commands

```bash
# Root directory
npm install              # Install all dependencies
npm run dev             # Start dev servers
npm run build           # Build frontend
npm run lint            # Lint code
npm run format          # Format code

# Backend
cd backend
npm start               # Production server
npm run dev             # Development server
npm run build           # Compile TypeScript

# Frontend
npm run preview         # Preview production build
npm run build:dev       # Development build
```

### Code Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

Run linter:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

---

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy 'dist' folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
# Deploy to:
# - Heroku
# - AWS EC2
# - Google Cloud Run
# - DigitalOcean
```

See [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#production-deployment) for detailed deployment instructions.

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows: Get-Service MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongodb

# Use in-memory DB for development
USE_MEMORY_DB=true
```

### Port Already in Use
```bash
# Find process on port
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000

# Kill process
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>
```

### Authentication Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration
- Verify Authorization header format

See [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#troubleshooting) for more solutions.

---

## 📝 Example Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Send Email
```bash
curl -X POST http://localhost:5000/api/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "recipient": "recipient@example.com",
    "subject": "Hello",
    "content": "This is a tracked email"
  }'
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- Use TypeScript for all code
- Follow ESLint rules
- Run Prettier before committing
- Add tests for new features

---

## 📄 License

This project is licensed under the **ISC License** - see LICENSE file for details.

---

## 🆘 Support

For help and support:
1. Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
2. Review [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
3. Open an issue on GitHub
4. Check existing documentation

---

## 🗺️ Roadmap

- [ ] Advanced email templates
- [ ] A/B testing for emails
- [ ] Scheduled email sending
- [ ] Email list management
- [ ] Advanced segmentation
- [ ] Custom integrations (Zapier, Make, etc.)
- [ ] Mobile app
- [ ] WebSocket real-time updates
- [ ] Multi-language support
- [ ] API webhooks

---

## 👥 Authors

- **Development Team** - Mail Tracker Project

---

## 🙏 Acknowledgments

- TanStack for routing and query libraries
- MongoDB for database
- Express.js community
- React community

---

## 📞 Contact

For questions or feedback:
- Create an issue on GitHub
- Check project documentation
- Review code comments

---

**Happy tracking! 📧✨**
