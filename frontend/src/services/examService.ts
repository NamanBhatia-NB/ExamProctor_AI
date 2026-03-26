import { Exam, ExamSession, Answer, ActivityEvent } from '@/types';
import { storage } from '@/utils/storage';

export const examService = {
  // Exam Management
  createExam: (exam: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const exams = storage.getExams();
    const newExam: Exam = {
      ...exam,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    storage.saveExams([...exams, newExam]);
    return newExam;
  },
  
  getExams: (): Exam[] => {
    return storage.getExams();
  },
  
  getExamById: (id: string): Exam | null => {
    const exams = storage.getExams();
    return exams.find(e => e.id === id) || null;
  },
  
  updateExam: (id: string, updates: Partial<Exam>): Exam | null => {
    const exams = storage.getExams();
    const index = exams.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    exams[index] = { ...exams[index], ...updates };
    storage.saveExams(exams);
    return exams[index];
  },
  
  deleteExam: (id: string): boolean => {
    const exams = storage.getExams();
    const filtered = exams.filter(e => e.id !== id);
    if (filtered.length === exams.length) return false;
    storage.saveExams(filtered);
    return true;
  },
  
  // Session Management
  startSession: (examId: string, studentId: string): ExamSession => {
    const sessions = storage.getSessions();
    const newSession: ExamSession = {
      id: crypto.randomUUID(),
      examId,
      studentId,
      startTime: new Date().toISOString(),
      answers: [],
      suspicionScore: 0,
      warningCount: 0,
      events: [],
      status: 'active',
    };
    storage.saveSessions([...sessions, newSession]);
    return newSession;
  },
  
  getSession: (id: string): ExamSession | null => {
    const sessions = storage.getSessions();
    return sessions.find(s => s.id === id) || null;
  },
  
  updateSession: (id: string, updates: Partial<ExamSession>): ExamSession | null => {
    const sessions = storage.getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    sessions[index] = { ...sessions[index], ...updates };
    storage.saveSessions(sessions);
    return sessions[index];
  },
  
  saveAnswer: (sessionId: string, answer: Answer): void => {
    const session = examService.getSession(sessionId);
    if (!session) return;
    
    const answers = session.answers.filter(a => a.questionId !== answer.questionId);
    answers.push(answer);
    
    examService.updateSession(sessionId, { answers });
  },
  
  logEvent: (sessionId: string, event: Omit<ActivityEvent, 'id' | 'timestamp'>): void => {
    const session = examService.getSession(sessionId);
    if (!session) return;
    
    const newEvent: ActivityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    examService.updateSession(sessionId, {
      events: [...session.events, newEvent],
    });
  },
  
  updateSuspicion: (sessionId: string, score: number): void => {
    const session = examService.getSession(sessionId);
    if (!session) return;
    
    const newScore = Math.min(100, session.suspicionScore + score);
    let warningCount = session.warningCount;
    
    if (newScore >= 80 && session.suspicionScore < 80) {
      warningCount++;
      examService.logEvent(sessionId, {
        type: 'WARNING_ISSUED',
        severity: 'HIGH',
        details: `Warning ${warningCount}/20: Suspicion threshold reached`,
      });
      
      if (warningCount >= 20) {
        examService.submitSession(sessionId, true);
        return;
      }
    }
    
    examService.updateSession(sessionId, {
      suspicionScore: newScore,
      warningCount,
    });
  },
  
  submitSession: (sessionId: string, autoSubmit = false): void => {
    examService.updateSession(sessionId, {
      endTime: new Date().toISOString(),
      status: autoSubmit ? 'auto-submitted' : 'completed',
    });
  },
  
  getSessions: (): ExamSession[] => {
    return storage.getSessions();
  },
  
  getStudentSessions: (studentId: string): ExamSession[] => {
    return storage.getSessions().filter(s => s.studentId === studentId);
  },
};
