"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/auth';
import { initializeSampleData } from '@/utils/initData';
import { Shield, Video, BarChart3, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    auth.initializeDefaultUsers();
    initializeSampleData();
  }, []);
  
  useEffect(() => {
    if (user) {
      window.location.href = user.role === 'admin' ? '/admin' : '/exam';
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ExamProctor AI</h1>
          <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Get Started
          </Link>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-800 mb-4">
            AI-Powered Online Examination System
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Secure, intelligent proctoring for remote exams with real-time monitoring
          </p>
          <Link href="/login" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
            Start Exam
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <Video className="text-blue-600 mb-4" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">Live Monitoring</h3>
            <p className="text-sm text-slate-600">Real-time webcam-based face detection and tracking</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <Shield className="text-green-600 mb-4" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">AI Proctoring</h3>
            <p className="text-sm text-slate-600">Intelligent detection of suspicious behavior patterns</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <BarChart3 className="text-purple-600 mb-4" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-slate-600">Comprehensive insights and activity reports</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <CheckCircle className="text-orange-600 mb-4" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">Auto-Submit</h3>
            <p className="text-sm text-slate-600">Automatic submission on excessive violations</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-semibold text-slate-800">Login & Start Exam</h4>
                <p className="text-slate-600">Students log in and begin their examination</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-semibold text-slate-800">AI Monitoring</h4>
                <p className="text-slate-600">Webcam captures frames analyzed by AI for face detection</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold text-slate-800">Suspicion Tracking</h4>
                <p className="text-slate-600">System tracks violations and issues warnings at 80% threshold</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-semibold text-slate-800">Admin Analytics</h4>
                <p className="text-slate-600">Admins review detailed reports and activity logs</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Demo Credentials</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Student Account:</p>
              <p className="text-blue-700">Email: student@test.com</p>
              <p className="text-blue-700">Password: student123</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Admin Account:</p>
              <p className="text-blue-700">Email: admin@test.com</p>
              <p className="text-blue-700">Password: admin123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
