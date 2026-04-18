import { Exam, ExamSession, Answer, ActivityEvent } from '@/types';
import { storage } from '@/utils/storage';
import { api } from './api';

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
  startSession: async (examId: string | number, studentId: string | number): Promise<ExamSession> => {
    const res = await api.post('/sessions/start', { examId, studentId });
    return res.data;
  },

  getSession: async (sessionId: string): Promise<ExamSession | null> => {
    try {
      const res = await api.get(`/sessions/${sessionId}`);
      return res.data;
    } catch (err) {
      console.error("Session not found");
      return null;
    }
  },

  getSessions: async (): Promise<ExamSession[]> => {
    const res = await api.get('/sessions');
    return res.data;
  },

  getStudentSessions: async (studentId: string | number): Promise<ExamSession[]> => {
    try {
      const res = await api.get(`/sessions/student/${studentId}`);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return [];
    }
  },

  updateSession: (id: string, updates: Partial<ExamSession>): ExamSession | null => {
    const sessions = storage.getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;

    sessions[index] = { ...sessions[index], ...updates };
    storage.saveSessions(sessions);
    return sessions[index];
  },

  saveAnswer: async (sessionId: string, answer: Answer): Promise<void> => {
    await api.post(`/sessions/${sessionId}/answers`, answer);
  },

  logEvent: async (sessionId: string, event: Omit<ActivityEvent, 'id' | 'timestamp'>): Promise<void> => {
    await api.post(`/sessions/${sessionId}/events`, event);
  },

  updateSuspicion: async (sessionId: string, score: number): Promise<ExamSession | null> => {
    // Notice how simple this is now! 
    // Java handles the 10% decay, the 80+ warnings, and the 20 limit auto-submit.
    const res = await api.put(`/sessions/${sessionId}/suspicion`, { score });
    return res.data;
  },

  submitSession: async (sessionId: string): Promise<ExamSession> => {
    const res = await api.put(`/sessions/${sessionId}/submit`);
    return res.data;
  },
};
