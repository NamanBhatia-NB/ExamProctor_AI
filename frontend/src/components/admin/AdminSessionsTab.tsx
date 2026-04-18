import { Exam, ExamSession } from "@/types";
import { Users } from "lucide-react";

export default function AdminSessionsTab({ exams, sessions }: { exams: Exam[], sessions: ExamSession[] }) {
    return (
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
                                    <p className="text-blue-600 font-medium flex items-center gap-2 mt-1">
                                        <Users size={16} /> {session.student?.email || 'Unknown Student'}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${session.status === 'active' ? 'bg-green-100 text-green-700' :
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
                                                <span className={`font-medium ${event.severity === 'CRITICAL' ? 'text-red-600' :
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
    );
}