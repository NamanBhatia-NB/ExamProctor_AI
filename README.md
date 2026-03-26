# Cloud-Based Online Examination System with AI Proctoring

A complete web application for conducting online exams with AI-powered proctoring that monitors students through webcam and browser activity.

## 🚀 Features

### Student Features
- **Exam Interface**: Clean, intuitive exam-taking experience
- **Live Webcam Monitoring**: Real-time face detection using AI
- **Suspicion Tracking**: Visual indicator of suspicious behavior
- **Auto-Submit**: Automatic submission after 20 warnings
- **Browser Monitoring**: Detects tab switching and window blur events

### Admin Features
- **Question Management**: Create, edit, and delete exams
- **Real-time Monitoring**: View active exam sessions
- **Analytics Dashboard**: Charts showing suspicion trends and events
- **Activity Logs**: Detailed logs of all suspicious activities
- **Session History**: View completed and auto-submitted exams

### AI Proctoring
- **Face Detection**: Detects 0, 1, or multiple faces
- **Suspicion Scoring**: 
  - 1 face = LOW (10% suspicion)
  - 0 faces = HIGH (85% suspicion)
  - Multiple faces = CRITICAL (95% suspicion)
- **Warning System**: Issues warning at 80% suspicion threshold
- **Auto-Submit**: Exam auto-submits after 20 warnings

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- Chart.js & react-chartjs-2
- Axios
- WebRTC

### AI Service
- Python 3.8+
- FastAPI
- OpenCV
- MediaPipe
- NumPy

## 📁 Project Structure

```
online-exam-system/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── login/page.tsx        # Login page
│   │   │   ├── exam/page.tsx         # Student exam page
│   │   │   └── admin/page.tsx        # Admin dashboard
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── WebcamMonitor.tsx
│   │   │   └── SuspicionIndicator.tsx
│   │   ├── services/
│   │   │   ├── aiService.ts          # AI service client
│   │   │   └── examService.ts        # Exam management
│   │   ├── lib/
│   │   │   └── auth.ts               # Authentication
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── utils/
│   │   │   └── storage.ts            # LocalStorage utilities
│   │   └── types/
│   │       └── index.ts              # TypeScript types
│   └── package.json
└── ai-service/
    ├── main.py                        # FastAPI server
    └── requirements.txt
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- pip

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### 2. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The AI service will run on `http://localhost:8000`

### 3. Environment Variables (Optional)

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

## 👤 Demo Accounts

### Student Account
- Email: `student@test.com`
- Password: `student123`

### Admin Account
- Email: `admin@test.com`
- Password: `admin123`

## 📖 Usage Guide

### For Students

1. **Login**: Use student credentials
2. **Start Exam**: Click on available exam
3. **Grant Camera Access**: Allow webcam permissions
4. **Take Exam**: Answer questions while being monitored
5. **Monitor Status**: Check suspicion score and warnings
6. **Submit**: Click submit or exam auto-submits at 20 warnings

### For Admins

1. **Login**: Use admin credentials
2. **Dashboard**: View analytics and statistics
3. **Manage Exams**: 
   - Click "Create Exam" to add new exam
   - Add questions with multiple choice options
   - Set correct answers and duration
4. **Monitor Sessions**: View real-time and historical data
5. **Review Logs**: Check detailed activity logs for each session

## 🔒 Security Features

- **Password Hashing**: SHA-256 hashing (ready for bcrypt backend)
- **JWT Tokens**: Session management with expiry
- **Camera Monitoring**: Continuous face detection
- **Browser Monitoring**: Tab switch and focus detection
- **Auto-Submit**: Prevents cheating with automatic submission

## 📊 Suspicion Detection Logic

| Event | Suspicion Added | Severity |
|-------|----------------|----------|
| No face detected | 85% | HIGH |
| Multiple faces | 95% | CRITICAL |
| Tab switch | 15% | HIGH |
| Window blur | 10% | HIGH |

**Warning Threshold**: 80% suspicion score
**Auto-Submit**: 20 warnings

## 🔄 Backend Integration Ready

The system is designed for easy backend integration:

### API Endpoints (Future)
```
POST /api/auth/login
POST /api/auth/register
POST /api/exams/create
GET  /api/exams
POST /api/sessions/start
POST /api/sessions/submit
POST /api/activity/log
GET  /api/admin/analytics
```

### Current Implementation
- Uses LocalStorage for persistence
- Mock authentication with JWT simulation
- All services structured for API integration
- Simply replace service functions with API calls

## 🧪 Testing

### Test Proctoring Features

1. **Face Detection**:
   - Cover camera → triggers "No face detected"
   - Multiple people in frame → triggers "Multiple faces"

2. **Browser Monitoring**:
   - Switch tabs → logs tab switch event
   - Click outside window → logs window blur

3. **Auto-Submit**:
   - Accumulate 20 warnings → exam auto-submits

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

### AI Service Connection Failed
- Verify AI service is running on port 8000
- Check CORS settings
- System falls back to mock data if service unavailable

### LocalStorage Issues
- Clear browser cache
- Check browser storage limits
- Use incognito mode for testing

## 📝 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real backend API with Express/FastAPI
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Advanced AI features (gaze tracking, emotion detection)
- [ ] Mobile app support
- [ ] Multi-language support
- [ ] Video recording of exam sessions

## 📄 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Developer Notes

### Adding New Question Types
Edit `src/types/index.ts` and add new question type:
```typescript
type: 'multiple-choice' | 'true-false' | 'essay'
```

### Customizing Suspicion Thresholds
Edit `src/services/examService.ts`:
```typescript
if (newScore >= 80) { // Change threshold here
  warningCount++;
}
```

### Modifying AI Detection Interval
Edit `src/components/WebcamMonitor.tsx`:
```typescript
interval = setInterval(captureFrame, 4000); // Change interval (ms)
```

## 🤝 Contributing

Contributions welcome! Please follow these steps:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📧 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for secure online education**
