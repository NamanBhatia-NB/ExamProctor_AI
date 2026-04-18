import { Line, Bar } from 'react-chartjs-2';
import { FileText, Users, Eye, AlertTriangle } from "lucide-react";
import { Exam, ExamSession } from "@/types";

export default function AdminDashboardTab({ exams, sessions }: { exams: Exam[], sessions: ExamSession[] }) {
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
                sessions.reduce((acc, s) => acc + (s.events?.filter(e => e.type === 'FACE_NOT_DETECTED').length || 0), 0),
                sessions.reduce((acc, s) => acc + (s.events?.filter(e => e.type === 'MULTIPLE_FACES').length || 0), 0),
                sessions.reduce((acc, s) => acc + (s.events?.filter(e => e.type === 'TAB_SWITCH').length || 0), 0),
                sessions.reduce((acc, s) => acc + (s.events?.filter(e => e.type === 'WINDOW_BLUR').length || 0), 0),
            ],
            backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(59, 130, 246, 0.8)'],
        }],
    };

    return (
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
                                    {/* ✅ ADDED THE STUDENT EMAIL HERE */}
                                    <p className="font-bold text-blue-600">{session.student?.email || 'Unknown Student'}</p>
                                    <p className="font-medium text-slate-800">{exam?.title || 'Unknown Exam'}</p>
                                    <p className="text-sm text-slate-600">
                                        {new Date(session.startTime).toLocaleString()} •
                                        <span className={`ml-2 ${session.status === 'active' ? 'text-green-600' :
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
    );
}