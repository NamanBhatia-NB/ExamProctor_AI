"use client";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { Exam, ExamSession, SafeAny } from "@/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ExamForm from "../ExamForm";
import { useRouter } from "next/navigation";

export default function AdminExamsTab() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [exams, setExams] = useState<Exam[]>([]);
    const [sessions, setSessions] = useState<ExamSession[]>([]);
    const [showCreateExam, setShowCreateExam] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);

    const loadData = async () => {
        try {
            // ✅ Fetch BOTH Exams and Sessions simultaneously
            const [examsRes, sessionsRes] = await Promise.all([
                api.get("/exams"),
                api.get("/sessions") // This calls the getAllSessions endpoint we made in Java!
            ]);

            setExams(Array.isArray(examsRes.data) ? examsRes.data : examsRes.data.content || []);
            setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : sessionsRes.data.content || []);

        } catch (err) {
            console.error("Error loading admin data:", err);
        }
    };

    useEffect(() => {
        if (loading) return;

        if (!user || user.role !== 'admin') {
            window.location.href = '/login';
            return;
        }

        const init = async () => {
            if (!user) return;
            await loadData();
        };

        init();
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-600">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    const handleCreateExam = async (examData: SafeAny) => {
        try {
            // Helper array to convert radio button index (0-3) to letters (A-D)
            const indexToLetter = ['A', 'B', 'C', 'D'];

            // 1. Format all questions into a clean array
            const formattedQuestions = examData.questions.map((q: SafeAny) => ({
                question: q.text,
                optionA: q.options[0] || "",
                optionB: q.options[1] || "",
                optionC: q.options[2] || "",
                optionD: q.options[3] || "",
                correctAnswer: indexToLetter[q.correctAnswer] || "A"
            }));

            // 2. Send ONE single request to Spring Boot with the Exam AND its Questions
            await api.post("/exams", {
                title: examData.title,
                duration: examData.duration,
                questions: formattedQuestions // ✅ Sent together!
            });

            // 3. Reload the dashboard
            await loadData();
            setShowCreateExam(false);

        } catch (err) {
            console.error("Error creating exam:", err);
            alert("Failed to save exam. Check console for details.");
        }
    };

    const handleUpdateExam = async (id: string, updates: SafeAny) => {
        try {
            // Helper array to convert radio button index (0-3) to letters (A-D)
            const indexToLetter = ['A', 'B', 'C', 'D'];

            // 1. Format all questions into the exact structure Spring Boot expects
            const formattedQuestions = updates.questions.map((q: SafeAny) => ({
                question: q.text || q.question, // Fallback in case it's already formatted
                optionA: q.options ? q.options[0] : q.optionA,
                optionB: q.options ? q.options[1] : q.optionB,
                optionC: q.options ? q.options[2] : q.optionC,
                optionD: q.options ? q.options[3] : q.optionD,
                correctAnswer: typeof q.correctAnswer === 'number'
                    ? indexToLetter[q.correctAnswer]
                    : q.correctAnswer
            }));

            // 2. Send the properly formatted data to the backend
            await api.put(`/exams/${id}`, {
                title: updates.title,
                duration: updates.duration,
                questions: formattedQuestions
            });

            // 3. Reload the dashboard
            await loadData();
            setEditingExam(null);
        } catch (err) {
            console.error("Error updating exam:", err);
            alert("Failed to update exam. Check console for details.");
        }
    };

    const handleDeleteExam = async (id: string) => {
        try {
            await api.delete(`/exams/${id}`);

            // update UI instantly
            setExams(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };
    return (
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
                                    {/* Safely fallback to an empty array if questions are missing */}
                                    {(exam.questions || []).length} questions • {exam.duration} minutes
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {/* Safely handle missing createdAt dates */}
                                    Created: {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString() : 'Recently'}
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
    )
}