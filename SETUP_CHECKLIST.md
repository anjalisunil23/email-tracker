# Mail Tracker - Setup Checklist & Verification

## ✅ Pre-Flight Checklist

Before running the application, ensure all items are complete:

### 1. System Requirements

- [ ] Node.js 16.0.0 or higher installed
  ```bash
  node --version  # Should show v16+
  ```
- [ ] npm 7.0.0 or higher installed
  ```bash
  npm --version  # Should show v7+
  ```
- [ ] Git installed
  ```bash
  git --version
  ```
- [ ] 500MB free disk space
- [ ] Internet connection for npm packages

### 2. Project Setup

- [ ] Repository cloned to local machine
- [ ] Navigated to project directory
  ```bash
  cd zenith-mail-lab
  ```

### 3. Dependencies Installation

- [ ] Root dependencies installed
  ```bash
  npm install
  # Should complete without errors
  ```
- [ ] Backend dependencies installed
  ```bash
  cd backend && npm install && cd ..
  # Should complete without errors
  ```
- [ ] Verify dependencies installed
  ```bash
  cd backend && npm list --depth=0
  # Should show 21 packages
  ```

### 4. Environment Configuration

- [ ] Backend `.env` file exists
  ```bash
  cd backend
  ls -la .env  # or: dir .env (Windows)
  ```
- [ ] `.env` contains required variables:
  - [ ] `MONGO_URI`
  - [ ] `USE_MEMORY_DB`
  - [ ] `JWT_SECRET`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASS`
  - [ ] `PORT`
  - [ ] `BACKEND_URL`
  - [ ] `SKIP_SMTP`
- [ ] No sensitive data committed to git
  - `.env` is in `.gitignore`

### 5. TypeScript Compilation

- [ ] Backend TypeScript compiles without errors
  ```bash
  cd backend && npx tsc --noEmit
  # Should produce no output
  ```
- [ ] No type errors in IDE
  - Check VS Code Problems panel (should be empty)

### 6. Database Setup

- [ ] Using in-memory database for development
  ```env
  USE_MEMORY_DB=true
  ```
- OR
- [ ] Local MongoDB installed and running
  ```bash
  # Windows: Get-Service MongoDB
  # macOS: brew services list
  # Linux: sudo systemctl status mongodb
  ```
- OR
- [ ] MongoDB Atlas account created with connection string

---

## 🚀 Startup Checklist

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Verify Output:**

- [ ] No errors displayed
- [ ] See: `Using in-memory MongoDB for local development`
- [ ] See: `MongoDB connected`
- [ ] See: `Seeded demo user (anjali@mailtrack.io / password)`
- [ ] See: `Server started on port 5000`

**If errors occur:**

1. Check `.env` file configuration
2. Verify Node.js version: `node --version`
3. Verify all dependencies installed: `npm list`
4. Check MongoDB status (if using real DB)
5. Review [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#troubleshooting)

### Terminal 2: Start Frontend Server

```bash
npm run dev
```

**Verify Output:**

- [ ] VITE development server started
- [ ] See: `ready in ... ms`
- [ ] See: `http://localhost:5173/`
- [ ] See: `VITE v5.x.x`

**If errors occur:**

1. Check port 5173 is available: `lsof -i :5173` (macOS/Linux)
2. Verify Node version is 16+
3. Try clearing node_modules: `rm -rf node_modules && npm install`

---

## 🌐 Access Checklist

### Frontend Access

- [ ] Open http://localhost:5173 in browser
- [ ] Page loads without errors
- [ ] See login form
- [ ] No CORS errors in browser console (F12)

### Backend Access

- [ ] API is accessible at http://localhost:5000
- [ ] Test with curl:
  ```bash
  curl http://localhost:5000/api/auth/login
  # Should return error about missing credentials (expected)
  ```

### Login Test

- [ ] Login page displays
- [ ] Enter credentials:
  - Email: `anjali@mailtrack.io`
  - Password: `password`
- [ ] Click Login
- [ ] Redirected to dashboard
- [ ] Dashboard loads without errors

---

## 📊 Dashboard Verification

After login, verify all dashboard sections load:

### Top Navigation

- [ ] User profile shows "Anjali Sunil"
- [ ] Logout button visible
- [ ] Settings link accessible

### Dashboard Stats

- [ ] Emails sent counter displays
- [ ] Total opens counter displays
- [ ] Total clicks counter displays
- [ ] Click-through rate displays

### Charts

- [ ] Recent activity chart loads
- [ ] Opens/clicks by device chart displays
- [ ] Top browsers chart displays
- [ ] Recent activity table shows sample data

### Sample Data

- [ ] At least 8 sample emails visible
- [ ] Each email shows open count
- [ ] Each email shows click count
- [ ] Email details page loads on click

---

## 🔧 API Endpoint Verification

Test API endpoints using curl or Postman:

### 1. Login Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anjali@mailtrack.io","password":"password"}'
```

**Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Anjali Sunil",
    "email": "anjali@mailtrack.io"
  }
}
```

- [ ] Returns 200 OK status
- [ ] Token is present
- [ ] User data is correct

### 2. List Emails

```bash
# Replace TOKEN with token from login
curl http://localhost:5000/api/email/list \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**

```json
{
  "emails": [
    {
      "_id": "...",
      "userId": "...",
      "recipient": "sarah.chen@acmecorp.com",
      "subject": "Your Q3 product roadmap is ready",
      ...
    }
  ]
}
```

- [ ] Returns 200 OK status
- [ ] Array of emails present
- [ ] At least 8 emails returned

### 3. Get Analytics

```bash
curl http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**

```json
{
  "totalEmails": 8,
  "totalOpens": 18,
  "totalClicks": 7,
  "openRate": 75,
  "clickRate": 29.17
}
```

- [ ] Returns 200 OK status
- [ ] Metrics are calculated
- [ ] Numbers match dashboard

---

## 🗄️ Database Verification

### Check Database Connection

```bash
# In backend console output, verify:
# "MongoDB connected"
```

- [ ] No connection errors
- [ ] Database is responsive
- [ ] Collections are created

### View Collections (if using real MongoDB)

```bash
# Connect to MongoDB
mongosh mongodb://127.0.0.1:27017/mailtracker

# List collections
show collections

# Count documents
db.users.countDocuments()
db.emails.countDocuments()
db.openevents.countDocuments()
db.clickevents.countDocuments()
```

**Expected Counts:**

- [ ] users: 1 (demo user)
- [ ] emails: 8 (sample emails)
- [ ] openevents: 18 (sample opens)
- [ ] clickevents: 7 (sample clicks)

---

## 🐛 Troubleshooting Checklist

If something isn't working, verify:

### Backend Issues

- [ ] Node.js version 16+ → `node --version`
- [ ] Dependencies installed → `cd backend && npm list`
- [ ] TypeScript compiles → `npx tsc --noEmit`
- [ ] `.env` file exists → `ls backend/.env`
- [ ] `.env` has JWT_SECRET → Check file content
- [ ] Port 5000 available → `netstat -ano | findstr :5000` (Windows)
- [ ] No nodemon issues → Try `npm run build` instead

### Frontend Issues

- [ ] Node.js version 16+ → `node --version`
- [ ] Dependencies installed → `npm list`
- [ ] Port 5173 available → `lsof -i :5173` (macOS/Linux)
- [ ] BACKEND_URL correct → Check `.env` or config
- [ ] No build errors → Check browser console (F12)

### Connection Issues

- [ ] Backend running → Try `curl http://localhost:5000/api`
- [ ] Frontend running → Try `curl http://localhost:5173`
- [ ] CORS enabled → Check browser console
- [ ] Firewall blocking → Check antivirus/firewall settings

### Database Issues

- [ ] `USE_MEMORY_DB=true` for development
- [ ] If using real MongoDB:
  - [ ] MongoDB running → Check service status
  - [ ] Connection string correct → Verify MONGO_URI
  - [ ] Database exists → Check MongoDB

---

## 📝 Documentation Files Created

✅ **README.md** (d:\mail tracker\zenith-mail-lab\README.md)

- Project overview
- Feature list
- Tech stack
- Quick start
- API documentation
- Deployment guide

✅ **DATABASE_SCHEMA.md** (d:\mail tracker\zenith-mail-lab\DATABASE_SCHEMA.md)

- MongoDB schema details
- Collection structure
- Field descriptions
- Relationships
- Indexing info
- Analytics aggregations
- Best practices

✅ **INSTALLATION_GUIDE.md** (d:\mail tracker\zenith-mail-lab\INSTALLATION_GUIDE.md)

- Detailed setup instructions
- Prerequisites
- Installation steps
- Environment configuration
- MongoDB setup
- Running application
- API endpoints
- Troubleshooting
- Production deployment

✅ **QUICK_START.md** (d:\mail tracker\zenith-mail-lab\QUICK_START.md)

- 5-minute quick start
- Key configurations
- Common tasks
- Testing email tracking
- Quick API reference
- Development tips

✅ **backend/.env.example** (d:\mail tracker\zenith-mail-lab\backend\.env.example)

- Environment template
- All required variables
- Example values
- Comments

✅ **SETUP_CHECKLIST.md** (this file)

- Pre-flight checklist
- Startup verification
- Access checklist
- API testing
- Troubleshooting guide

---

## 🎯 Success Indicators

Your setup is complete when:

1. ✅ Backend starts without errors
2. ✅ Frontend loads at http://localhost:5173
3. ✅ Can login with `anjali@mailtrack.io` / `password`
4. ✅ Dashboard displays sample data
5. ✅ API endpoints return correct responses
6. ✅ Email tracking system is functional

---

## 📞 Need Help?

1. **Review Documentation**
   - [README.md](./README.md) - Project overview
   - [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) - Setup help
   - [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schema reference
   - [QUICK_START.md](./QUICK_START.md) - Quick reference

2. **Check Logs**
   - Backend console output
   - Browser console (F12)
   - Network requests tab

3. **Common Issues**
   - See [INSTALLATION_GUIDE.md#troubleshooting](./INSTALLATION_GUIDE.md#troubleshooting)

4. **Verify Configuration**
   - Check `backend/.env` file
   - Verify environment variables
   - Review `.env.example` for reference

---

## ✨ You're All Set!

Once checklist is complete, start building! 🚀

Next steps:

1. Explore the codebase
2. Review database schema
3. Try creating your own emails
4. Customize the UI
5. Deploy to production

**Happy coding!** 💻
