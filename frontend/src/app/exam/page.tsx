"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/examService";
import { api } from "@/services/api";
import { Exam, ExamSession, SafeAny } from "@/types";
import WebcamMonitor from "@/components/WebcamMonitor";
import SuspicionIndicator from "@/components/SuspicionIndicator";
import Navbar from "@/components/Navbar";
import { Clock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function ExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  const [exam, setExam] = useState<Exam | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAutoSubmitWarning, setShowAutoSubmitWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const initialized = useRef(false);

  const refreshSession = useCallback(async (sessionId: string) => {
    const updatedSession = await examService.getSession(sessionId);
    if (updatedSession) {
      setSession(updatedSession);
      if (updatedSession.status === 'auto-submitted') {
        setShowAutoSubmitWarning(true);
      }
    }
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().then(() => {
      setIsFullscreen(true);
    }).catch(err => {
      alert("You must allow fullscreen to take the exam.");
    });
  };

  useEffect(() => {
    if (loading || !user || !examId) return;
    if (user.role !== 'student') {
      window.location.href = '/login';
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    const initExam = async () => {
      try {
        const res = await api.get(`/exams`);
        const allExams = Array.isArray(res.data) ? res.data : res.data.content || [];
        let currentExam = allExams.find((e: SafeAny) => e.id.toString() === examId.toString());

        if (!currentExam) {
          alert("Exam not found!");
          router.push('/');
          return;
        }

        currentExam = {
          ...currentExam,
          questions: currentExam.questions || []
        };

        setExam(currentExam);

        const existingSessions = await examService.getStudentSessions(user.id);
        const completedSession = existingSessions.find(
          s => s.examId === currentExam.id && (s.status === 'completed' || s.status === 'auto-submitted')
        );

        if (completedSession) {
          setSession(completedSession);
          if (completedSession.status === 'auto-submitted') setShowAutoSubmitWarning(true);
          return;
        }

        const activeSession = existingSessions.find(
          s => s.examId === currentExam.id && s.status === 'active'
        );

        if (activeSession) {
          const ageInSeconds = (new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000;

          if (ageInSeconds > 10) {
            examService.submitSession(activeSession.id);
            refreshSession(activeSession.id);
            setShowAutoSubmitWarning(true);
            return;
          } else {
            setSession(activeSession);
            setTimeRemaining(currentExam.duration * 60);
            return;
          }
        }

        const newSession = await examService.startSession(currentExam.id, user.id);
        setSession(newSession);
        setTimeRemaining(currentExam.duration * 60);

      } catch (err) {
        console.error("Error loading exam:", err);
        router.push('/');
      }
    };

    initExam();
  }, [user, loading, examId, router, refreshSession]);

  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          examService.submitSession(session.id);
          refreshSession(session.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.id, session?.status, refreshSession]);

  // ==========================================
  // ANTI-CHEAT: BROWSER LOCKDOWN
  // ==========================================
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("Right-click is disabled during the exam.");
    };

    // 2. Disable Copy, Cut, Paste
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("Clipboard actions are disabled.");
    };

    // 3. Disable Keyboard Shortcuts (F12, Ctrl+C, Ctrl+V, Ctrl+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Chrome DevTools
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "p" || e.key === "s")) // Copy/Paste/Print/Save
      ) {
        e.preventDefault();
        // alert("This keyboard shortcut is prohibited during the exam.");
        toast.error("This keyboard shortcut is prohibited during the exam.");

        // Optional: Punish the student for trying to open DevTools or Copy/Paste
        if (session?.id) {
          examService.logEvent(session.id, { type: 'WARNING_ISSUED', severity: 'HIGH', details: `Attempted prohibited shortcut: ${e.key}` });
          examService.updateSuspicion(session.id, 20); // Add 20% suspicion
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [session?.id]);

  useEffect(() => {
    if (!session?.id || !exam) return;

    const currentSessionId = session.id;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        examService.logEvent(currentSessionId, { type: 'TAB_SWITCH', severity: 'HIGH', details: 'Switched tabs' });
        examService.updateSuspicion(currentSessionId, 15);
        refreshSession(currentSessionId);
      }
    };

    const handleBlur = () => {
      examService.logEvent(currentSessionId, { type: 'WINDOW_BLUR', severity: 'HIGH', details: 'Window lost focus' });
      examService.updateSuspicion(currentSessionId, 10);
      refreshSession(currentSessionId);
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        examService.logEvent(currentSessionId, { type: 'FULLSCREEN_EXIT', severity: 'HIGH', details: 'Exited full screen' });
        examService.updateSuspicion(currentSessionId, 40);
        refreshSession(currentSessionId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [session?.id, exam, refreshSession]);

  // ✅ FIX: Signature updated to accept the flags array and the exact backend score
  const handleDetection = useCallback((flags: string[], backendScore: number) => {
    if (!session?.id) return;

    if (flags.length > 0) {
      // 1. Log every single flag (Talking, Noise, Looking Away, etc.) to the database
      flags.forEach(flag => {
        examService.logEvent(session.id, {
          type: flag as SafeAny,
          severity: 'HIGH',
          details: `AI Flag: ${flag.replace(/_/g, ' ')}`
        });
      });

      // 2. Convert the backend's decimal score (e.g., 0.3) to the frontend's percentage penalty (e.g., 30)
      const penalty = Math.round(backendScore * 100);
      examService.updateSuspicion(session.id, penalty);

    } else {
      // 3. No flags detected! Decay the suspicion score back toward 0.
      examService.updateSuspicion(session.id, 0);
    }

    refreshSession(session.id);
  }, [session, refreshSession]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (!exam || !session || !exam.questions || exam.questions.length === 0) return;

    setSelectedAnswer(optionIndex);
    examService.saveAnswer(session.id, {
      questionId: exam.questions[currentQuestion].id,
      selectedOption: optionIndex,
    });
  };

  const handleNext = () => {
    if (!exam || !exam.questions) return;

    if (currentQuestion < exam.questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);

      const savedAnswer = session?.answers.find(a => a.questionId === exam.questions[nextQuestion]?.id);
      setSelectedAnswer(savedAnswer?.selectedOption ?? null);
    }
  };

  const handlePrevious = () => {
    if (!exam || !exam.questions) return;

    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);

      const savedAnswer = session?.answers.find(a => a.questionId === exam.questions[prevQuestion]?.id);
      setSelectedAnswer(savedAnswer?.selectedOption ?? null);
    }
  };

  // ✅ FIX: Process the custom modal submission instead of native confirm
  const confirmSubmit = async () => {
    if (!session) return;
    setShowSubmitModal(false);
    await examService.submitSession(session.id);
    await refreshSession(session.id);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !exam || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (showAutoSubmitWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
          <AlertTriangle size={64} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Exam Auto-Submitted</h2>
          <p className="text-slate-600">You left the exam environment or exceeded the maximum warnings.</p>
          <p className="text-slate-600 mt-2 mb-8">Your exam has been locked and submitted for manual review.</p>
          <button onClick={() => router.push('/')} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

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
            Return to Homepage
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
          <p className="text-slate-600 mb-6">To maintain exam integrity, you must take this test in full screen mode in one sitting. Exiting fullscreen will result in a penalty.</p>
          <button onClick={enterFullscreen} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            Enter Fullscreen & Start Exam
          </button>
        </div>
      </div>
    );
  }

  const questionsList = exam.questions || [];
  let question = questionsList[currentQuestion];

  if (question) {
    question = {
      ...question,
      options: [
        question.optionA || question.options?.[0] || "A",
        question.optionB || question.options?.[1] || "B",
        question.optionC || question.options?.[2] || "C",
        question.optionD || question.options?.[3] || "D"
      ]
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="flex gap-6 h-full">
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h1 className="text-2xl font-bold text-slate-800">{exam.title}</h1>
              <div className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                <Clock size={20} /> {formatTime(timeRemaining)} Remaining
              </div>
            </div>

            {question ? (
              <div className="flex-1">
                <h3 className="text-lg font-medium text-slate-700 mb-4">
                  Question {currentQuestion + 1} of {questionsList.length}
                </h3>
                <p className="text-slate-600 text-lg mb-6">{question.text || question.text}</p>

                <div className="space-y-3">
                  {question.options.map((opt: string, i: number) => (
                    <label
                      key={i}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedAnswer === i ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50 border-slate-300'}`}
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
            ) : (
              <div className="flex-1 text-slate-500 italic flex items-center justify-center bg-slate-50 rounded-lg">
                No questions have been added to this exam yet.
              </div>
            )}

            <div className="flex justify-between mt-8 border-t pt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-3">
                {currentQuestion >= questionsList.length - 1 ? (
                  // ✅ FIX: Open custom modal instead of native confirm
                  <button onClick={() => setShowSubmitModal(true)} className="px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition">
                    Submit Exam
                  </button>
                ) : (
                  <button onClick={handleNext} className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition">
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

      {/* ✅ FIX: Custom Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Submit Exam?</h3>
            <p className="text-slate-600 mb-8">Are you sure you want to submit? You cannot change your answers after submitting.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 