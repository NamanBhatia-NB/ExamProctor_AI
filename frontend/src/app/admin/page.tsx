"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/examService";
import { Exam, ExamSession, Question } from "@/types";
import Navbar from "@/components/Navbar";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Plus, Trash2, Edit, Eye, AlertTriangle, Users, FileText } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exams' | 'sessions'>('dashboard');
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  
  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== 'admin') {
      window.location.href = '/login';
      return;
    }
    
    loadData();
  }, [user, loading, router]);
  
  const loadData = () => {
    setExams(examService.getExams());
    setSessions(examService.getSessions());
  };
  
  const handleCreateExam = (exam: Omit<Exam, 'id' | 'createdAt'>) => {
    examService.createExam(exam);
    loadData();
    setShowCreateExam(false);
  };
  
  const handleUpdateExam = (id: string, updates: Partial<Exam>) => {
    examService.updateExam(id, updates);
    loadData();
    setEditingExam(null);
  };
  
  const handleDeleteExam = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      examService.deleteExam(id);
      loadData();
    }
  };
  
  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const autoSubmittedSessions = sessions.filter(s => s.status === 'auto-submitted');
  
  const suspicionData = {
    labels: sessions.slice(-10).map((_, i) => `Session ${i + 1}`),
    datasets: [{
      label: 'Suspicion Score',
      data: sessions.slice(-10).map(s => s.suspicionScore),
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
    }],
  };
  
  const eventsData = {
    labels: ['Face Not Detected', 'Multiple Faces', 'Tab Switch', 'Window Blur'],
    datasets: [{
      label: 'Event Count',
      data: [
        sessions.reduce((acc, s) => acc + s.events.filter(e => e.type === 'FACE_NOT_DETECTED').length, 0),
        sessions.reduce((acc, s) => acc + s.events.filter(e => e.type === 'MULTIPLE_FACES').length, 0),
        sessions.reduce((acc, s) => acc + s.events.filter(e => e.type === 'TAB_SWITCH').length, 0),
        sessions.reduce((acc, s) => acc + s.events.filter(e => e.type === 'WINDOW_BLUR').length, 0),
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(59, 130, 246, 0.8)',
      ],
    }],
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage exams and monitor student activity</p>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'exams' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Manage Exams
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'sessions' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            View Sessions
          </button>
        </div>
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="text-blue-600" size={24} />
                  <span className="text-2xl font-bold text-slate-800">{exams.length}</span>
                </div>
                <p className="text-slate-600 text-sm">Total Exams</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-green-600" size={24} />
                  <span className="text-2xl font-bold text-slate-800">{activeSessions.length}</span>
                </div>
                <p className="text-slate-600 text-sm">Active Sessions</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="text-purple-600" size={24} />
                  <span className="text-2xl font-bold text-slate-800">{completedSessions.length}</span>
                </div>
                <p className="text-slate-600 text-sm">Completed</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="text-red-600" size={24} />
                  <span className="text-2xl font-bold text-slate-800">{autoSubmittedSessions.length}</span>
                </div>
                <p className="text-slate-600 text-sm">Auto-Submitted</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Suspicion Trends</h3>
                <Line data={suspicionData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Suspicious Events</h3>
                <Bar data={eventsData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {sessions.slice(-10).reverse().map(session => {
                  const exam = exams.find(e => e.id === session.examId);
                  return (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{exam?.title || 'Unknown Exam'}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(session.startTime).toLocaleString()} • 
                          <span className={`ml-2 ${
                            session.status === 'active' ? 'text-green-600' :
                            session.status === 'auto-submitted' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {session.status}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Suspicion: {session.suspicionScore.toFixed(0)}%</p>
                        <p className="text-sm text-slate-600">Warnings: {session.warningCount}/20</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Exam Management</h2>
              <button
                onClick={() => setShowCreateExam(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Create Exam
              </button>
            </div>
            
            <div className="grid gap-4">
              {exams.map(exam => (
                <div key={exam.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{exam.title}</h3>
                      <p className="text-slate-600 mt-1">
                        {exam.questions.length} questions • {exam.duration} minutes
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Created: {new Date(exam.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingExam(exam)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {showCreateExam && (
              <ExamForm
                onSubmit={handleCreateExam}
                onCancel={() => setShowCreateExam(false)}
                userId={user.id}
              />
            )}
            
            {editingExam && (
              <ExamForm
                exam={editingExam}
                onSubmit={(data) => handleUpdateExam(editingExam.id, data)}
                onCancel={() => setEditingExam(null)}
                userId={user.id}
              />
            )}
          </div>
        )}
        
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Exam Sessions</h2>
            
            <div className="space-y-4">
              {sessions.map(session => {
                const exam = exams.find(e => e.id === session.examId);
                return (
                  <div key={session.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{exam?.title || 'Unknown Exam'}</h3>
                        <p className="text-slate-600">Session ID: {session.id.slice(0, 8)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session.status === 'active' ? 'bg-green-100 text-green-700' :
                        session.status === 'auto-submitted' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">Start Time</p>
                        <p className="font-medium">{new Date(session.startTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Suspicion Score</p>
                        <p className="font-medium text-red-600">{session.suspicionScore.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Warnings</p>
                        <p className="font-medium">{session.warningCount}/20</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Events</p>
                        <p className="font-medium">{session.events.length}</p>
                      </div>
                    </div>
                    
                    <details className="mt-4">
                      <summary className="cursor-pointer text-blue-600 font-medium">View Activity Log</summary>
                      <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                        {session.events.map(event => (
                          <div key={event.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                            <div className="flex justify-between items-start">
                              <span className={`font-medium ${
                                event.severity === 'CRITICAL' ? 'text-red-600' :
                                event.severity === 'HIGH' ? 'text-orange-600' : 'text-yellow-600'
                              }`}>
                                {event.type.replace(/_/g, ' ')}
                              </span>
                              <span className="text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                            </div>
                            {event.details && <p className="text-slate-600 mt-1">{event.details}</p>}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExamForm({ 
  exam, 
  onSubmit, 
  onCancel, 
  userId 
}: { 
  exam?: Exam; 
  onSubmit: (data: Omit<Exam, 'id' | 'createdAt'>) => void; 
  onCancel: () => void;
  userId: string;
}) {
  const [title, setTitle] = useState(exam?.title || '');
  const [duration, setDuration] = useState(exam?.duration || 60);
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>(
    exam?.questions.map(q => ({ text: q.text, options: q.options, correctAnswer: q.correctAnswer })) || 
    [{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]
  );
  
  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };
  
  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };
  
  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedQuestions: Question[] = questions.map(q => ({
      id: crypto.randomUUID(),
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));
    
    onSubmit({
      title,
      duration,
      questions: formattedQuestions,
      createdBy: userId,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {exam ? 'Edit Exam' : 'Create New Exam'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Exam Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              min="1"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-slate-700">Questions</label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>
            
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border border-slate-300 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-700">Question {qIndex + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    placeholder="Enter question text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {exam ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
