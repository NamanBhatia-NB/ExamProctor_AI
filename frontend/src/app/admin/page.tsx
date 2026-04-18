"use client";
import Navbar from "@/components/Navbar";
import AdminDashboardTab from "@/components/admin/AdminDashboardTab";
import AdminExamsTab from "@/components/admin/AdminExamsTab";
import AdminSessionsTab from "@/components/admin/AdminSessionsTab";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { Exam, ExamSession } from "@/types";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'exams'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            Manage Exams
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'sessions'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
          >
            View Sessions
          </button>
        </div>

        {activeTab === 'dashboard' &&
          <AdminDashboardTab exams={exams} sessions={sessions} />
        }

        {activeTab === 'sessions' &&
          <AdminSessionsTab exams={exams} sessions={sessions} />
        }


        {activeTab === 'exams' && (
          <AdminExamsTab />
        )}


      </div>
    </div>
  );
}

