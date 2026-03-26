# API Documentation for Backend Integration

This document outlines the API endpoints needed for backend integration.

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "student" | "admin"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "token": "string"
}
```

### POST /api/auth/login
Authenticate user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "token": "string"
}
```

### POST /api/auth/logout
Logout user (invalidate token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
Get current user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string"
}
```

## Exam Management Endpoints

### POST /api/exams
Create a new exam (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "duration": "number",
  "questions": [
    {
      "text": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "number"
    }
  ]
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "duration": "number",
  "questions": [...],
  "createdBy": "string",
  "createdAt": "string"
}
```

### GET /api/exams
Get all exams.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "duration": "number",
    "questions": [...],
    "createdBy": "string",
    "createdAt": "string"
  }
]
```

### GET /api/exams/:id
Get exam by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "duration": "number",
  "questions": [...],
  "createdBy": "string",
  "createdAt": "string"
}
```

### PUT /api/exams/:id
Update exam (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "duration": "number",
  "questions": [...]
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "duration": "number",
  "questions": [...],
  "createdBy": "string",
  "createdAt": "string"
}
```

### DELETE /api/exams/:id
Delete exam (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Exam deleted successfully"
}
```

## Exam Session Endpoints

### POST /api/sessions/start
Start a new exam session.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "examId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "examId": "string",
  "studentId": "string",
  "startTime": "string",
  "answers": [],
  "suspicionScore": 0,
  "warningCount": 0,
  "events": [],
  "status": "active"
}
```

### GET /api/sessions/:id
Get session by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "examId": "string",
  "studentId": "string",
  "startTime": "string",
  "endTime": "string",
  "answers": [...],
  "suspicionScore": "number",
  "warningCount": "number",
  "events": [...],
  "status": "string"
}
```

### PUT /api/sessions/:id/answer
Save answer for a question.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "questionId": "string",
  "selectedOption": "number"
}
```

**Response:**
```json
{
  "message": "Answer saved"
}
```

### POST /api/sessions/:id/event
Log an activity event.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "FACE_NOT_DETECTED" | "MULTIPLE_FACES" | "TAB_SWITCH" | "WINDOW_BLUR" | "WARNING_ISSUED",
  "severity": "LOW" | "HIGH" | "CRITICAL",
  "details": "string"
}
```

**Response:**
```json
{
  "message": "Event logged"
}
```

### PUT /api/sessions/:id/suspicion
Update suspicion score.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "score": "number"
}
```

**Response:**
```json
{
  "suspicionScore": "number",
  "warningCount": "number",
  "status": "string"
}
```

### POST /api/sessions/:id/submit
Submit exam session.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "autoSubmit": "boolean"
}
```

**Response:**
```json
{
  "message": "Exam submitted",
  "session": {...}
}
```

### GET /api/sessions
Get all sessions (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `studentId` (optional): Filter by student
- `examId` (optional): Filter by exam
- `status` (optional): Filter by status

**Response:**
```json
[
  {
    "id": "string",
    "examId": "string",
    "studentId": "string",
    "startTime": "string",
    "endTime": "string",
    "answers": [...],
    "suspicionScore": "number",
    "warningCount": "number",
    "events": [...],
    "status": "string"
  }
]
```

## Analytics Endpoints

### GET /api/analytics/overview
Get analytics overview (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalExams": "number",
  "activeSessions": "number",
  "completedSessions": "number",
  "autoSubmittedSessions": "number",
  "averageSuspicionScore": "number"
}
```

### GET /api/analytics/suspicion-trends
Get suspicion score trends (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of sessions to include

**Response:**
```json
{
  "labels": ["string"],
  "data": ["number"]
}
```

### GET /api/analytics/event-distribution
Get event type distribution (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "FACE_NOT_DETECTED": "number",
  "MULTIPLE_FACES": "number",
  "TAB_SWITCH": "number",
  "WINDOW_BLUR": "number"
}
```

## Implementation Guide

### 1. Update Service Files

Replace the mock implementations in:
- `frontend/src/lib/auth.ts`
- `frontend/src/services/examService.ts`

### 2. Create API Client

Create `frontend/src/services/apiClient.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('exam_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('exam_auth_token');
      localStorage.removeItem('exam_current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Update Auth Service

```typescript
import apiClient from './apiClient';

export const auth = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('exam_auth_token', token);
    localStorage.setItem('exam_current_user', JSON.stringify(user));
    
    return { user, token };
  },
  
  // ... other methods
};
```

### 4. Update Exam Service

```typescript
import apiClient from './apiClient';

export const examService = {
  createExam: async (exam: Omit<Exam, 'id' | 'createdAt'>) => {
    const response = await apiClient.post('/exams', exam);
    return response.data;
  },
  
  getExams: async () => {
    const response = await apiClient.get('/exams');
    return response.data;
  },
  
  // ... other methods
};
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Exams Table
```sql
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL,
  questions JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id),
  student_id UUID REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  answers JSONB DEFAULT '[]',
  suspicion_score DECIMAL(5,2) DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'completed', 'auto-submitted')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **JWT Tokens**: Use strong secret, set expiration (24h recommended)
3. **CORS**: Configure allowed origins properly
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **Input Validation**: Validate all inputs on backend
6. **SQL Injection**: Use parameterized queries
7. **XSS Protection**: Sanitize user inputs
8. **HTTPS**: Use HTTPS in production

## Testing

Use tools like:
- Postman for API testing
- Jest for unit tests
- Cypress for E2E tests

---

**Ready for Backend Integration! 🚀**
