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
    
    const newSession = examService.startSession(selectedExam.id, user.id);
    setSession(newSession);
    setTimeRemaining(selectedExam.duration * 60);
    
    const savedAnswer = newSession.answers.find(a => a.questionId === selectedExam.questions[0].id);
    if (savedAnswer) {
      setSelectedAnswer(savedAnswer.selectedOption);
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
    if (!session || !exam) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        examService.logEvent(session.id, {
          type: 'TAB_SWITCH',
          severity: 'HIGH',
          details: 'Student switched tabs or minimized window',
        });
        examService.updateSuspicion(session.id, 15);
      }
    };
    
    const handleBlur = () => {
      examService.logEvent(session.id, {
        type: 'WINDOW_BLUR',
        severity: 'HIGH',
        details: 'Window lost focus',
      });
      examService.updateSuspicion(session.id, 10);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [session, exam]);
  
  const handleDetection = useCallback((faceCount: number, suspicionScore: number, level: string) => {
    if (!session) return;
    
    if (faceCount === 0) {
      examService.logEvent(session.id, {
        type: 'FACE_NOT_DETECTED',
        severity: 'HIGH',
        details: 'No face detected in camera',
      });
      examService.updateSuspicion(session.id, suspicionScore * 100);
    } else if (faceCount > 1) {
      examService.logEvent(session.id, {
        type: 'MULTIPLE_FACES',
        severity: 'CRITICAL',
        details: `${faceCount} faces detected`,
      });
      examService.updateSuspicion(session.id, suspicionScore * 100);
    }
    
    const updatedSession = examService.getSession(session.id);
    if (updatedSession) {
      setSession(updatedSession);
      
      if (updatedSession.status === 'auto-submitted') {
        setShowAutoSubmitWarning(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    }
  }, [session, router]);
  
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
      alert('Exam submitted successfully!');
      router.push('/');
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
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <AlertTriangle size={64} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Exam Auto-Submitted</h2>
          <p className="text-slate-600">You have exceeded the maximum number of warnings (20).</p>
          <p className="text-slate-600 mt-2">Your exam has been automatically submitted.</p>
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
              <div className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
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
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      selectedAnswer === i 
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
