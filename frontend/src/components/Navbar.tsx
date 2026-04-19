"use client";
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ExamProctor AI
        </Link>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/exam/select'} className="text-slate-600 hover:text-blue-600">
                {user.role === 'admin' ? 'Dashboard' : 'Exams'}
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <User size={16} />
                  <span className="text-slate-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register
              </Link>
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
