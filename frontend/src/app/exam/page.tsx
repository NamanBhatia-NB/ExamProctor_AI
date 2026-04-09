"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/examService";
import { Exam, ExamSession } from "@/types";
import WebcamMonitor from "@/components/WebcamMonitor";
import SuspicionIndicator from "@/components/SuspicionIndicator";
import Navbar from "@/components/Navbar";
import { Clock, AlertTriangle } from "lucide-react";

export default function ExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAutoSubmitWarning, setShowAutoSubmitWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const refreshSession = (sessionId: string) => {
    const updatedSession = examService.getSession(sessionId);
    if (updatedSession) {
      setSession(updatedSession);
      if (updatedSession.status === 'auto-submitted') {
        setShowAutoSubmitWarning(true);
      }
    }
  };

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().then(() => {
      setIsFullscreen(true);
    }).catch(err => {
      alert("You must allow fullscreen to take the exam.");
    });
  };

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== 'student') {
      window.location.href = '/login';
      return;
    }

    const exams = examService.getExams();
    if (exams.length === 0) {
      alert('No exams available');
      router.push('/');
      return;
    }

    const selectedExam = exams[0];
    setExam(selectedExam);

    // ✅ FIX: Check for existing sessions to prevent overwriting
    const existingSessions = examService.getStudentSessions(user.id);

    // Check if they already finished it
    const completedSession = existingSessions.find(
      s => s.examId === selectedExam.id && (s.status === 'completed' || s.status === 'auto-submitted')
    );

    if (completedSession) {
      setSession(completedSession);
      if (completedSession.status === 'auto-submitted') setShowAutoSubmitWarning(true);
      return;
    }

    // Check if they have an active session to restore
    const activeSession = existingSessions.find(
      s => s.examId === selectedExam.id && s.status === 'active'
    );

    if (activeSession) {
      setSession(activeSession);

      // Calculate real remaining time based on when they started
      const elapsedSeconds = Math.floor((new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000);
      const remaining = Math.max(0, (selectedExam.duration * 60) - elapsedSeconds);
      setTimeRemaining(remaining);

      const savedAnswer = activeSession.answers.find(a => a.questionId === selectedExam.questions[0].id);
      if (savedAnswer) setSelectedAnswer(savedAnswer.selectedOption);
    } else {
      // Only create a brand new session if no previous session exists
      const newSession = examService.startSession(selectedExam.id, user.id);
      setSession(newSession);
      setTimeRemaining(selectedExam.duration * 60);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  useEffect(() => {
    if (!session?.id || !exam) return;

    const currentSessionId = session.id;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        examService.logEvent(currentSessionId, { type: 'TAB_SWITCH', severity: 'HIGH', details: 'Switched tabs' });
        examService.updateSuspicion(currentSessionId, 15);
        refreshSession(currentSessionId); // ✅ UPDATE UI IMMEDIATELY
      }
    };

    const handleBlur = () => {
      examService.logEvent(currentSessionId, { type: 'WINDOW_BLUR', severity: 'HIGH', details: 'Window lost focus' });
      examService.updateSuspicion(currentSessionId, 10);
      refreshSession(currentSessionId); // ✅ UPDATE UI IMMEDIATELY
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false); // Kicks them back to the warning screen
        examService.logEvent(currentSessionId, { type: 'FULLSCREEN_EXIT', severity: 'HIGH', details: 'Exited full screen' });
        examService.updateSuspicion(currentSessionId, 40); // Big penalty for exiting
        refreshSession(currentSessionId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log("Click the screen to enable fullscreen"));
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [session?.id, exam]); // ✅ Only re-run if session ID changes, prevents infinite loops

  const handleDetection = useCallback((faceCount: number, suspicionScore: number, level: string) => {
    if (!session?.id) return;

    if (faceCount === 0) {
      examService.logEvent(session.id, { type: 'FACE_NOT_DETECTED', severity: 'HIGH', details: 'No face detected' });
      examService.updateSuspicion(session.id, 50); // Add big penalty
    } else if (faceCount > 1) {
      examService.logEvent(session.id, { type: 'MULTIPLE_FACES', severity: 'CRITICAL', details: `${faceCount} faces detected` });
      examService.updateSuspicion(session.id, 60); // Add bigger penalty
    } else {
      // ✅ NORMAL STATE: Pass 0 so the *0.9 decay mechanism slowly lowers the score!
      examService.updateSuspicion(session.id, 0);
    }

    refreshSession(session.id); // Update UI
  }, [session?.id, router]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (!exam || !session) return;

    setSelectedAnswer(optionIndex);
    examService.saveAnswer(session.id, {
      questionId: exam.questions[currentQuestion].id,
      selectedOption: optionIndex,
    });
  };

  const handleNext = () => {
    if (!exam) return;

    if (currentQuestion < exam.questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);

      const savedAnswer = session?.answers.find(a => a.questionId === exam.questions[nextQuestion].id);
      setSelectedAnswer(savedAnswer?.selectedOption ?? null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);

      const savedAnswer = session?.answers.find(a => a.questionId === exam!.questions[prevQuestion].id);
      setSelectedAnswer(savedAnswer?.selectedOption ?? null);
    }
  };

  const handleSubmit = () => {
    if (!session) return;

    if (confirm('Are you sure you want to submit the exam?')) {
      examService.submitSession(session.id);
      refreshSession(session.id);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!exam || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (showAutoSubmitWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
          <AlertTriangle size={64} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Exam Auto-Submitted</h2>
          <p className="text-slate-600">You have exceeded the maximum number of warnings (20).</p>
          <p className="text-slate-600 mt-2 mb-8">Your exam has been locked and submitted for manual review.</p>
          <button onClick={() => router.push('/')} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ NEW: Success UI that replaces the redirect loop
  if (session?.status === 'completed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Exam Submitted Successfully!</h2>
          <p className="text-slate-600 mb-8 text-lg">Your responses and AI proctoring logs have been securely uploaded to the server.</p>
          <button onClick={() => router.push('/')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isFullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Fullscreen Required</h2>
          <p className="text-slate-600 mb-6">To maintain exam integrity, you must take this test in full screen mode. Exiting fullscreen will result in a penalty.</p>
          <button onClick={enterFullscreen} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            Enter Fullscreen & Start Exam
          </button>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="flex gap-6 h-full">
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h1 className="text-2xl font-bold text-slate-800">{exam.title}</h1>
              <div className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                <Clock size={20} /> {formatTime(timeRemaining)} Remaining
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-700 mb-4">
                Question {currentQuestion + 1} of {exam.questions.length}
              </h3>
              <p className="text-slate-600 text-lg mb-6">{question.text}</p>

              <div className="space-y-3">
                {question.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedAnswer === i
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-slate-50 border-slate-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      checked={selectedAnswer === i}
                      onChange={() => handleAnswerSelect(i)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8 border-t pt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {currentQuestion === exam.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
                  >
                    Save & Next
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-80 flex flex-col gap-6">
            <WebcamMonitor
              onDetection={handleDetection}
              isActive={session.status === 'active'}
            />

            <SuspicionIndicator
              score={session.suspicionScore}
              warningCount={session.warningCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
