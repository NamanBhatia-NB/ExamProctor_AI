# System Architecture

## Overview

The Online Examination System with AI Proctoring is built using a microservices architecture with two main components:

1. **Frontend Application** (Next.js)
2. **AI Proctoring Service** (Python FastAPI)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Home Page   │  │  Login Page  │  │  Exam Page   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │              Admin Dashboard                      │           │
│  │  - Analytics  - Exam Management  - Sessions      │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │                 Components                        │           │
│  │  - WebcamMonitor  - SuspicionIndicator           │           │
│  │  - Navbar                                         │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │                  Services                         │           │
│  │  - Auth Service    - Exam Service                │           │
│  │  - AI Service Client                             │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │              LocalStorage (Mock DB)               │           │
│  │  - Users  - Exams  - Sessions  - Events          │           │
│  └──────────────────────────────────────────────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP POST /detect
                            │ (Image Frame)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AI PROCTORING SERVICE (FastAPI)                │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │              FastAPI Endpoints                    │           │
│  │  - GET  /health                                   │           │
│  │  - POST /detect                                   │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │           Face Detection Pipeline                 │           │
│  │                                                    │           │
│  │  1. Receive Image                                 │           │
│  │  2. Decode with OpenCV                            │           │
│  │  3. Process with MediaPipe                        │           │
│  │  4. Count Faces                                   │           │
│  │  5. Calculate Suspicion Score                     │           │
│  │  6. Return Result                                 │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User → Login Page → Auth Service → LocalStorage
                         ↓
                    JWT Token
                         ↓
                  Store in Storage
                         ↓
                  Redirect to Dashboard
```

### 2. Exam Taking Flow

```
Student → Select Exam → Start Session
              ↓
        Initialize Webcam
              ↓
    ┌─────────────────────┐
    │   Every 4 seconds   │
    └─────────────────────┘
              ↓
        Capture Frame
              ↓
        Send to AI Service
              ↓
    ┌─────────────────────┐
    │  Face Detection     │
    │  - Count faces      │
    │  - Calculate score  │
    └─────────────────────┘
              ↓
        Return Result
              ↓
    Update Suspicion Score
              ↓
    ┌─────────────────────┐
    │  Score >= 80%?      │
    └─────────────────────┘
         Yes ↓    No ↓
    Issue Warning  Continue
              ↓
    ┌─────────────────────┐
    │  Warnings >= 20?    │
    └─────────────────────┘
         Yes ↓    No ↓
    Auto-Submit   Continue
```

### 3. Browser Monitoring Flow

```
Student Taking Exam
        ↓
    ┌───────────────┐
    │ Tab Switch?   │
    └───────────────┘
         Yes ↓
    Log Event
         ↓
    Add Suspicion (15%)
         ↓
    Check Warning Threshold
```

### 4. Admin Analytics Flow

```
Admin → Dashboard
         ↓
    Load Sessions
         ↓
    Calculate Metrics
         ↓
    Generate Charts
         ↓
    Display Analytics
```

## Component Architecture

### Frontend Components

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── login/page.tsx           # Authentication
│   ├── exam/page.tsx            # Student exam interface
│   └── admin/page.tsx           # Admin dashboard
│
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── WebcamMonitor.tsx        # Webcam + AI integration
│   └── SuspicionIndicator.tsx   # Visual suspicion display
│
├── services/
│   ├── aiService.ts             # AI API client
│   └── examService.ts           # Exam CRUD operations
│
├── lib/
│   └── auth.ts                  # Authentication logic
│
├── hooks/
│   └── useAuth.ts               # Auth state management
│
├── utils/
│   ├── storage.ts               # LocalStorage wrapper
│   └── initData.ts              # Sample data initialization
│
└── types/
    └── index.ts                 # TypeScript definitions
```

## State Management

### LocalStorage Structure

```javascript
{
  "exam_users": [
    {
      "id": "uuid",
      "email": "string",
      "password": "hashed",
      "name": "string",
      "role": "student|admin"
    }
  ],
  
  "exam_exams": [
    {
      "id": "uuid",
      "title": "string",
      "duration": "number",
      "questions": [...],
      "createdBy": "uuid",
      "createdAt": "timestamp"
    }
  ],
  
  "exam_sessions": [
    {
      "id": "uuid",
      "examId": "uuid",
      "studentId": "uuid",
      "startTime": "timestamp",
      "endTime": "timestamp",
      "answers": [...],
      "suspicionScore": "number",
      "warningCount": "number",
      "events": [...],
      "status": "active|completed|auto-submitted"
    }
  ],
  
  "exam_current_user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  
  "exam_auth_token": "jwt-token"
}
```

## AI Service Architecture

### MediaPipe Face Detection

```python
# Initialize
mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

# Process
image = cv2.imdecode(image_data)
results = face_detection.process(image)
face_count = len(results.detections) if results.detections else 0

# Calculate Suspicion
if face_count == 0:
    suspicion = 0.85  # HIGH
elif face_count > 1:
    suspicion = 0.95  # CRITICAL
else:
    suspicion = 0.1   # LOW
```

## Security Architecture

### Current Implementation (Mock)

```
Password → SHA-256 Hash → Store
Login → Verify Hash → Generate JWT-like Token
Token → Base64(userId + expiry) → Store in LocalStorage
```

### Production Implementation (Recommended)

```
Password → bcrypt(salt=10) → Store in DB
Login → Verify bcrypt → Generate JWT (RS256)
JWT → Store in HttpOnly Cookie
Refresh Token → Rotate every 7 days
```

## Scalability Considerations

### Current Architecture
- Single-page application
- Client-side state management
- LocalStorage persistence
- Direct AI service calls

### Production Architecture

```
┌──────────────┐
│   CDN        │ (Static assets)
└──────────────┘
       ↓
┌──────────────┐
│ Load Balancer│
└──────────────┘
       ↓
┌──────────────────────────────┐
│   Frontend Servers (N)       │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│   API Gateway                │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│   Backend Services           │
│   - Auth Service             │
│   - Exam Service             │
│   - Session Service          │
│   - Analytics Service        │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│   Database Cluster           │
│   - PostgreSQL (Primary)     │
│   - Redis (Cache)            │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│   AI Service Cluster         │
│   - Multiple instances       │
│   - Load balanced            │
└──────────────────────────────┘
```

## Performance Optimization

### Current
- Frame capture: Every 4 seconds
- Image quality: 80% JPEG
- No caching
- Synchronous processing

### Optimizations
1. **Frame Capture**: Adaptive interval based on suspicion
2. **Image Compression**: Dynamic quality adjustment
3. **Caching**: Cache AI results for similar frames
4. **Async Processing**: Queue-based frame processing
5. **CDN**: Serve static assets from CDN
6. **Code Splitting**: Lazy load components
7. **Database Indexing**: Index frequently queried fields

## Monitoring & Logging

### Frontend Logging
```javascript
console.log('[AUTH]', 'User logged in');
console.log('[EXAM]', 'Session started');
console.log('[AI]', 'Face detection result:', result);
```

### Backend Logging
```python
logging.info(f"{datetime.now()} | Faces: {face_count}")
```

### Production Monitoring
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Server monitoring (Prometheus + Grafana)
- Log aggregation (ELK Stack)

## Deployment Architecture

### Development
```
localhost:3000 → Frontend
localhost:8000 → AI Service
```

### Production
```
https://exam.example.com → Frontend (Vercel/Netlify)
https://api.exam.example.com → Backend (AWS/GCP)
https://ai.exam.example.com → AI Service (Docker/K8s)
```

## Technology Choices

### Why Next.js?
- Server-side rendering
- API routes capability
- Built-in optimization
- Great developer experience

### Why FastAPI?
- High performance
- Async support
- Automatic API documentation
- Easy integration with ML libraries

### Why MediaPipe?
- Accurate face detection
- Lightweight
- Cross-platform
- Google-maintained

### Why LocalStorage?
- No backend required initially
- Fast development
- Easy to migrate to backend
- Good for prototyping

## Migration Path to Production

1. **Phase 1**: Current (LocalStorage)
2. **Phase 2**: Add backend API (keep LocalStorage as fallback)
3. **Phase 3**: Migrate to database (PostgreSQL)
4. **Phase 4**: Add caching layer (Redis)
5. **Phase 5**: Scale horizontally (Load balancers)
6. **Phase 6**: Add monitoring and analytics

---

**Architecture designed for growth! 🚀**
