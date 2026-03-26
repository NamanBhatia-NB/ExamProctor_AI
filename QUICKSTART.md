# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Keep this terminal running. You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 2: Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

### Step 3: Open Browser

Navigate to: `http://localhost:3000`

## 🎯 Test the System

### Test as Student

1. Click "Get Started" or "Login"
2. Use credentials:
   - Email: `student@test.com`
   - Password: `student123`
3. You'll be redirected to the exam page
4. Grant camera permissions when prompted
5. Take the exam while being monitored

### Test as Admin

1. Logout (if logged in as student)
2. Login with:
   - Email: `admin@test.com`
   - Password: `admin123`
3. Explore:
   - Dashboard: View analytics
   - Manage Exams: Create/edit/delete exams
   - View Sessions: See all exam sessions

## 🧪 Test Proctoring Features

### Face Detection
- **Normal**: Keep your face visible → Low suspicion
- **No Face**: Cover camera or move away → High suspicion + warning
- **Multiple Faces**: Have someone else in frame → Critical suspicion + warning

### Browser Monitoring
- **Tab Switch**: Press Alt+Tab or switch tabs → Logs event + adds suspicion
- **Window Blur**: Click outside browser → Logs event + adds suspicion

### Warning System
- Suspicion reaches 80% → Warning issued
- 20 warnings → Exam auto-submits

## 📊 View Results

As admin:
1. Go to "View Sessions" tab
2. Click on any session
3. Expand "View Activity Log" to see all events

## 🔧 Troubleshooting

### Camera Not Working
```bash
# Make sure you're on localhost or HTTPS
# Check browser permissions
# Try Chrome/Firefox
```

### AI Service Not Connecting
```bash
# Check if AI service is running on port 8000
# Visit http://localhost:8000/health
# Should return: {"status": "AI Service Running"}
```

### Port Already in Use
```bash
# Frontend (change port)
npm run dev -- -p 3001

# AI Service (change port)
uvicorn main:app --reload --port 8001
# Then update NEXT_PUBLIC_AI_SERVICE_URL in .env.local
```

## 📝 Creating Your First Exam

1. Login as admin
2. Click "Manage Exams" tab
3. Click "Create Exam" button
4. Fill in:
   - Exam Title
   - Duration (minutes)
   - Questions with 4 options each
   - Select correct answer (radio button)
5. Click "Create Exam"

## 🎓 Sample Exams

The system comes with 2 pre-loaded exams:
1. **Advanced Data Structures** (5 questions, 60 minutes)
2. **Algorithm Analysis** (3 questions, 45 minutes)

Students will automatically see the first available exam.

## 💾 Data Persistence

All data is stored in browser LocalStorage:
- User accounts
- Exams
- Exam sessions
- Activity logs

To reset everything:
```javascript
// Open browser console (F12)
localStorage.clear()
// Refresh page
```

## 🔐 Security Notes

Current implementation uses:
- SHA-256 password hashing
- JWT-like token simulation
- Session management

For production, replace with:
- Backend API with bcrypt
- Real JWT tokens
- Database storage

## 📱 Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ⚠️ Safari (may have camera issues)

## 🎨 Customization

### Change Suspicion Thresholds
Edit `frontend/src/services/examService.ts`:
```typescript
if (newScore >= 80) { // Change this value
  warningCount++;
}
```

### Change Warning Limit
Edit `frontend/src/services/examService.ts`:
```typescript
if (warningCount >= 20) { // Change this value
  examService.submitSession(sessionId, true);
}
```

### Change Frame Capture Interval
Edit `frontend/src/components/WebcamMonitor.tsx`:
```typescript
interval = setInterval(captureFrame, 4000); // Change milliseconds
```

## 🆘 Need Help?

Check the main README.md for detailed documentation.

---

**Happy Testing! 🎉**
