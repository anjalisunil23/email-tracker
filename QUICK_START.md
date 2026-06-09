# Quick Start Guide for Mail Tracker

## ⚡ 5-Minute Quick Start

### Step 1: Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
```

### Step 2: Configure Environment
The `.env` file is already configured for local development:
```bash
cd backend
cat .env  # View current configuration
```

**Key Settings:**
- `USE_MEMORY_DB=true` - Uses in-memory MongoDB (no setup needed)
- `JWT_SECRET=supersecretjwtkey` - Development secret
- `SKIP_SMTP=true` - Skip email verification

### Step 3: Start Development Servers

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Expected: `MongoDB connected` → `Server started on port 5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Expected: `VITE ... ready in ... ms` → `http://localhost:5173`

### Step 4: Open Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Step 5: Login with Demo Account
```
Email: anjali@mailtrack.io
Password: password
```

---

## 📋 What's Configured

✅ **Database**: In-memory MongoDB (mongodb-memory-server)
✅ **Authentication**: JWT with demo user pre-seeded
✅ **Email Tracking**: Fully functional tracking system
✅ **Sample Data**: 8 demo emails with opens and clicks
✅ **Analytics**: Dashboard ready to display metrics
✅ **CORS**: Enabled for localhost development
✅ **Rate Limiting**: Enabled (100 requests per 15 min)
✅ **Security**: Helmet enabled for HTTP headers

---

## 🔧 Common Tasks

### View Backend Logs
```bash
cd backend
npm run dev
# Logs show:
# - MongoDB connection status
# - HTTP requests
# - Errors
```

### Access Database Shell (MongoDB Memory Server)
Database is in-memory only during development. To persist data, switch to real MongoDB:

```env
# In backend/.env, set:
USE_MEMORY_DB=false
MONGO_URI=mongodb://127.0.0.1:27017/mailtracker
```

Then start MongoDB and restart backend.

### Reset Demo Data
Database is cleared on each backend restart. To keep data:

1. Install MongoDB locally
2. Update `.env`: `USE_MEMORY_DB=false`
3. Restart backend
4. Demo data will be seeded once

### Add New Environment Variables
1. Edit `backend/.env`
2. Restart backend server
3. Available in `backend/src/config/index.ts`

---

## 📊 Testing Email Tracking

### 1. Login
Use demo credentials above

### 2. Send Tracked Email
- Go to "Send Email" page
- Enter recipient email
- Add subject and content
- Click "Send with Tracking"

### 3. Simulate Open
- In browser dev tools, trigger pixel beacon:
  ```javascript
  fetch('http://localhost:5000/api/track/open/TRACKING_ID')
  ```

### 4. View Analytics
- Dashboard shows real-time metrics
- Email history shows opens/clicks
- Detailed analytics per email

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version  # Should be 16+

# Clear dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:5000/api/auth/login

# Check BACKEND_URL in backend/.env
# Should be: http://localhost:5000

# Check CORS in frontend requests
# Frontend runs on port 5173
```

### Database errors
```bash
# If using real MongoDB:
# Check connection string in backend/.env
# Verify MongoDB is running

# For in-memory DB issues:
USE_MEMORY_DB=true
npm run dev  # Restarts with fresh in-memory DB
```

---

## 📚 Documentation

- **[README.md](../README.md)** - Project overview
- **[DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)** - Database structure
- **[INSTALLATION_GUIDE.md](../INSTALLATION_GUIDE.md)** - Detailed setup
- **[API Endpoints](#api-endpoints)** - API documentation

---

## 🔌 API Quick Reference

### Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anjali@mailtrack.io","password":"password"}'
```

### List Emails
```bash
curl http://localhost:5000/api/email/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Analytics
```bash
curl http://localhost:5000/api/analytics/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Next Steps

1. **Explore Dashboard** - View analytics and email metrics
2. **Send Test Email** - Try the email sending feature
3. **Check Database Schema** - Read `DATABASE_SCHEMA.md`
4. **Review Backend Code** - Explore `backend/src/`
5. **Customize Configuration** - Modify `.env` as needed

---

## 💡 Development Tips

1. **Hot Reload**
   - Frontend: Automatic on file save
   - Backend: Nodemon watches for changes

2. **Network Requests**
   - Open browser DevTools (F12)
   - Check "Network" tab
   - See all API calls and responses

3. **Database Inspection**
   - Backend logs show queries
   - Use MongoDB Compass for visual inspection
   - Switch to real MongoDB for persistence

4. **Code Changes**
   - Backend: Automatically reloads via nodemon
   - Frontend: Hot module replacement (HMR)

---

## 📞 Getting Help

1. **Check Logs** - Terminal output usually shows errors
2. **Review Documentation** - See files above
3. **Check Environment** - Verify `.env` is correct
4. **Restart Servers** - Fresh start often fixes issues

---

**Ready to go! Start with:**
```bash
cd backend && npm run dev
# Then in another terminal:
npm run dev
```

Access at http://localhost:5173 ✨
