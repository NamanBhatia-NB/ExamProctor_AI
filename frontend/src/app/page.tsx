"use client";
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/auth';
import { initializeSampleData } from '@/utils/initData';
import { BarChart3, CheckCircle, Shield, Video } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  // const [isClient, setIsClient] = useState(false);
  const isClient = typeof window !== "undefined";

  // Initialize data on mount
  // useEffect(() => {
  //   setIsClient(true);
  //   // auth.initializeDefaultUsers();
  //   initializeSampleData();
  // }, []);

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

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">ExamProctor AI</h1>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">AI-Powered Online Examination System</h2>
            <p className="text-xl text-slate-600 mb-8">Secure, intelligent proctoring for remote exams with real-time monitoring</p>
            <Link href="/exam/select" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-md">
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