"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/auth';
import { initializeSampleData } from '@/utils/initData';
import { examService } from '@/services/examService';
import { Shield, Video, BarChart3, CheckCircle, PlayCircle, AlertCircle, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    setIsClient(true);
    // auth.initializeDefaultUsers();
    initializeSampleData();
  }, []);

  // Redirect admins to their specific portal
  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    if (logout) logout();
    else auth.logout();
    router.push('/');
  };

  // Prevent hydration mismatch & flicker
  if (!isClient || loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  // ==========================================
  // VIEW 1: PUBLIC LANDING PAGE (Logged Out)
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">ExamProctor AI</h1>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">AI-Powered Online Examination System</h2>
            <p className="text-xl text-slate-600 mb-8">Secure, intelligent proctoring for remote exams with real-time monitoring</p>
            <Link href="/login" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-md">
              Start Exam
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <Video className="text-blue-600 mb-4" size={32} />
              <h3 className="font-semibold text-slate-800 mb-2">Live Monitoring</h3>
              <p className="text-sm text-slate-600">Real-time webcam-based face detection and tracking</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <Shield className="text-green-600 mb-4" size={32} />
              <h3 className="font-semibold text-slate-800 mb-2">AI Proctoring</h3>
              <p className="text-sm text-slate-600">Intelligent detection of suspicious behavior patterns</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <BarChart3 className="text-purple-600 mb-4" size={32} />
              <h3 className="font-semibold text-slate-800 mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-slate-600">Comprehensive insights and activity reports</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <CheckCircle className="text-orange-600 mb-4" size={32} />
              <h3 className="font-semibold text-slate-800 mb-2">Auto-Submit</h3>
              <p className="text-sm text-slate-600">Automatic submission on excessive violations</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: STUDENT DASHBOARD (Logged In)
  // ==========================================
  const exams = examService.getExams();
  const mySessions = examService.getStudentSessions(user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">ExamProctor AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">{user.name}</span>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition rounded-lg hover:bg-red-50">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav> */}

      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Student Dashboard</h1>
        <p className="text-slate-600 mb-8">Here are your assigned examinations. Ensure you are in a quiet environment before starting.</p>

        <div className="space-y-4">
          {exams.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border text-center text-slate-500">
              No exams assigned to you currently.
            </div>
          ) : (
            exams.map(exam => {
              const session = mySessions.find(s => s.examId === exam.id);
              const isCompleted = session?.status === 'completed' || session?.status === 'auto-submitted';

              return (
                <div key={exam.id} className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between transition hover:shadow-md">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{exam.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">Duration: {exam.duration} Minutes</p>
                  </div>

                  {isCompleted ? (
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${session.status === 'auto-submitted' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {session.status === 'auto-submitted' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                        {session.status === 'auto-submitted' ? 'Auto-Submitted (Flagged)' : 'Completed'}
                      </span>
                      <p className="text-xs text-slate-400 mt-2">
                        Total Warnings: {session.warningCount}/20
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push('/exam')}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                    >
                      <PlayCircle size={20} />
                      {session?.status === 'active' ? 'Resume Exam' : 'Start Exam'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}