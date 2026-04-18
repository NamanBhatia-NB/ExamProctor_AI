import { useState, useEffect } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/auth';

export const useAuth = () => {
  // 1. Initialize with null. This guarantees the Server and Client match perfectly on the first render.
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const currentUser = auth.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await auth.login(email, password);
    setUser(user);
    return user;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
};