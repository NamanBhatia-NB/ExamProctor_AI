export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
  createdBy: string;
  createdAt: string;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
}

export interface ExamSession {
  id: string;
  examId: string;
  studentId: string;
  startTime: string;
  endTime?: string;
  answers: Answer[];
  suspicionScore: number;
  warningCount: number;
  events: ActivityEvent[];
  status: 'active' | 'completed' | 'auto-submitted';
  lastWarningLevel?: number;    
}

export interface ActivityEvent {
  id: string;
  type: 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'TAB_SWITCH' | 'WINDOW_BLUR' | 'WARNING_ISSUED';
  timestamp: string;
  severity: 'LOW' | 'HIGH' | 'CRITICAL';
  details?: string;
}

export interface AIDetectionResult {
  timestamp: string;
  face_count: number;
  suspicion_score: number;
  level: 'LOW' | 'HIGH' | 'CRITICAL';
}
