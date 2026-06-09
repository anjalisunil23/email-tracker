# 🚀 Mail Tracker - Getting Started Guide

## Welcome! Let's Get You Up and Running ⚡

This guide will get your Mail Tracker application running in **5 minutes**.

---

## 📦 Step 1: Install Dependencies (1 min)

Open a terminal in your project directory and run:

```bash
npm install
cd backend && npm install && cd ..
```

**Expected:** Installation completes without errors
**Status:** ✅ Ready to proceed

---

## ⚙️ Step 2: Check Environment Configuration (30 sec)

Your backend is already configured! Verify the file exists:

```bash
cd backend
cat .env
```

**You should see:**
```
MONGO_URI=mongodb://127.0.0.1:27017/mailtracker
USE_MEMORY_DB=true
JWT_SECRET=supersecretjwtkey
...
```

**Status:** ✅ Already configured

---

## 🎮 Step 3: Start Backend Server (1 min)

**Open Terminal #1** and run:

```bash
cd backend
npm run dev
```

**Look for this output:**
```
✓ Using in-memory MongoDB for local development
✓ MongoDB connected
✓ Seeded demo user (anjali@mailtrack.io / password)
✓ Server started on port 5000
```

**If you see errors:** Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#troubleshooting)

**Status:** ✅ Backend running on http://localhost:5000

---

## 💻 Step 4: Start Frontend Server (1 min)

**Open Terminal #2** (new terminal window) and run:

```bash
npm run dev
```

**Look for this output:**
```
VITE v5.x.x ready in xxx ms

➜ Local:   http://localhost:5173/
```

**Status:** ✅ Frontend running on http://localhost:5173

---

## 🌐 Step 5: Open Application (30 sec)

Open your browser and go to:

```
http://localhost:5173
```

**You should see:**
- Login form
- Professional email tracking UI
- Demo account details displayed

**Status:** ✅ Application loaded

---

## 🔐 Step 6: Login with Demo Account (30 sec)

Enter these credentials on the login form:

```
Email:    anjali@mailtrack.io
Password: password
```

Click **Login**

**You should see:**
- Dashboard with analytics
- Sample emails listed
- Charts and metrics

**Status:** ✅ Successfully logged in

---

## 📊 Step 7: Explore the Dashboard (2 min)

### Dashboard Overview
- **Top Stats** - Shows total emails, opens, clicks
- **Charts** - Visual analytics
- **Email List** - All sent emails with tracking

### Try These Actions:
1. Click an email to see details
2. View open/click events
3. Check device and browser info
4. Review analytics metrics

**Status:** ✅ Dashboard working

---

## 📚 Next: Learn More

Now that you're up and running, read the documentation:

| Document | What to Learn | Time |
|----------|---------------|------|
| [README.md](./README.md) | Project overview & features | 5 min |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | How data is structured | 10 min |
| [QUICK_START.md](./QUICK_START.md) | Quick reference & tips | 5 min |
| [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) | Detailed setup & deployment | 15 min |

---

## ✅ Success Indicators

Your setup is complete when you see:

- [x] **Backend Started** - "Server started on port 5000"
- [x] **Frontend Loaded** - http://localhost:5173 works
- [x] **Logged In** - Dashboard displays with sample data
- [x] **Analytics Visible** - Charts and metrics show
- [x] **Sample Data** - 8 emails with opens and clicks

---

## 🚨 Something Not Working?

### Backend Won't Start?
```bash
# Check Node version
node --version  # Should be 16+

# Clear and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend Won't Load?
```bash
# Check if port 5173 is free
# Mac/Linux: lsof -i :5173
# Windows: netstat -ano | findstr :5173

# Try clearing cache
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't Login?
- Verify backend is running (check Terminal 1)
- Check browser console (F12) for errors
- Try refreshing the page
- Check `.env` file has JWT_SECRET

### Still Stuck?
See [INSTALLATION_GUIDE.md - Troubleshooting](./INSTALLATION_GUIDE.md#troubleshooting)

---

## 💡 Pro Tips

### Keep Both Terminals Open
- Terminal 1: Backend (auto-restarts on code changes)
- Terminal 2: Frontend (auto-reloads on code changes)

### View Network Requests
- Open browser DevTools (F12)
- Click "Network" tab
- Watch API calls as you interact

### Check Server Logs
- Backend terminal shows all API requests
- Look for errors or warnings
- Helps with debugging

### Reset Database
- Just restart the backend (in-memory DB resets)
- All demo data will be restored

---

## 🎓 Understanding the Architecture

```
Your Browser (http://localhost:5173)
         ↓
React Application (Frontend)
         ↓
API Calls (REST)
         ↓
Express Server (http://localhost:5000)
         ↓
MongoDB In-Memory Database
         ↓
Email Tracking System
```

---

## 📝 Quick Command Reference

```bash
# Install everything
npm install && cd backend && npm install && cd ..

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
npm run dev

# Access frontend
# http://localhost:5173

# Test API
curl http://localhost:5000/api/auth/login

# Login credentials
# Email: anjali@mailtrack.io
# Password: password
```

---

## 🌟 What's Included

✅ **Pre-configured Backend**
- Express.js server
- MongoDB with sample data
- JWT authentication
- Email tracking system

✅ **Pre-configured Frontend**
- React dashboard
- Analytics charts
- Email management
- Settings page

✅ **Demo Data**
- 1 user account
- 8 sample emails
- 18 open events
- 7 click events

✅ **Documentation**
- Setup guide
- Database schema
- API reference
- Troubleshooting

---

## 🎯 Common Questions

**Q: Do I need to install MongoDB?**
A: No! In-memory MongoDB is used for development. No installation needed.

**Q: Can I use real MongoDB?**
A: Yes! Update `backend/.env` and set `USE_MEMORY_DB=false`

**Q: How do I send a tracked email?**
A: Use the "Send Email" button in the frontend dashboard.

**Q: Where are the API docs?**
A: Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#api-endpoints)

**Q: How do I deploy this?**
A: See [INSTALLATION_GUIDE.md - Production Deployment](./INSTALLATION_GUIDE.md#production-deployment)

---

## 📊 Demo Data Included

**Sample Emails (8 total):**
1. Q3 Roadmap - 2 opens, 1 click
2. Trial Question - 2 opens, 0 clicks
3. Invoice - 0 opens, 0 clicks
4. Welcome - 3 opens, 2 clicks
5. Following Up - 4 opens, 0 clicks
6. Special Offer - 3 opens, 2 clicks
7. Meeting Reminder - 3 opens, 0 clicks
8. New Feature - 5 opens, 1 click

**Total: 18 opens, 7 clicks from various devices**

---

## 🔄 Your Development Workflow

```
1. Make Changes to Code
           ↓
2. Save File (Auto-reload triggered)
           ↓
3. Backend reloads (nodemon) / Frontend reloads (HMR)
           ↓
4. View changes in browser
           ↓
5. Check console for errors
```

---

## 🎊 You're Ready!

### Right Now:
- ✅ All dependencies installed
- ✅ Backend configured
- ✅ Frontend configured
- ✅ Demo data ready

### Next:
1. Open Terminal 1 → `cd backend && npm run dev`
2. Open Terminal 2 → `npm run dev`
3. Visit http://localhost:5173
4. Login with demo account

### Then:
- Explore the dashboard
- Check out the analytics
- Read the documentation
- Start customizing!

---

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Node version, reinstall dependencies |
| Frontend won't load | Clear cache, check port 5173 |
| Can't login | Check .env file, verify backend running |
| Database errors | Use `USE_MEMORY_DB=true`, restart backend |
| API errors | Check network tab in DevTools (F12) |

Full troubleshooting in [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#troubleshooting)

---

## 🌟 Happy Tracking!

You now have a fully functional email tracking application! 

**Start coding, building, and exploring!** 🚀

---

### Quick Links:
- 📖 [README.md](./README.md) - Project overview
- 🚀 [QUICK_START.md](./QUICK_START.md) - Quick reference
- 📋 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database info
- 🔧 [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) - Full setup
- ✅ [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Verification

---

**Version:** 1.0.0  
**Updated:** 2026-06-08  
**Status:** ✅ Ready to Go
