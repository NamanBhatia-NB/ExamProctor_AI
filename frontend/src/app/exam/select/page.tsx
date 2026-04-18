"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { examService } from "@/services/examService";
import { SafeAny } from "@/types";
import { AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SelectExamPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter(); // Ensure router is initialized
    const [exams, setExams] = useState<SafeAny[]>([]);
    const [loadingExams, setLoadingExams] = useState(true);
    const [mySessions, setMySessions] = useState<SafeAny[]>([]);

    useEffect(() => {
        // console.log("User from useAuth:", user);

        if (!user && !loading) {
            redirect('/login');
        }
    }, [user, loading]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const examRes = await api.get("/exams");
                setExams(Array.isArray(examRes.data) ? examRes.data : examRes.data.content || []);

                // Fetch sessions from DB!
                const sessionRes = await examService.getStudentSessions(user.id);
                setMySessions(sessionRes);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoadingExams(false);
            }
        };
        fetchData();
    }, [user]);

    // const mySessions = user ? examService.getStudentSessions(user.id) : [];

    const handleSelectExam = (examId: SafeAny) => {
        router.push(`/exam?examId=${examId}`);
    };

    if (loading || loadingExams) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Exams...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="max-w-4xl mx-auto mt-10 p-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Student Dashboard</h1>
                <p className="text-slate-600 mb-8">Here are your assigned examinations. Ensure you are in a quiet environment before starting.</p>

                {(!exams || exams.length === 0) ? (
                    <div className="p-8 bg-white rounded-xl border text-center text-slate-500">
                        No exams assigned to you currently.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exams.map(exam => {
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
                                            onClick={() => handleSelectExam(exam.id)}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                                        >
                                            <PlayCircle size={20} />
                                            {session?.status === 'active' ? 'Resume Exam' : 'Start Exam'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
