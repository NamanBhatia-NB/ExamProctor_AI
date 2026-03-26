import { User } from '@/types';
import { storage } from '@/utils/storage';

// Simple hash function (in production, use bcrypt on backend)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Simple JWT simulation (in production, use proper JWT library on backend)
const createToken = (userId: string): string => {
  const payload = { userId, exp: Date.now() + 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
};

const verifyToken = (token: string): { userId: string } | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
};

export const auth = {
  register: async (email: string, password: string, name: string, role: 'student' | 'admin'): Promise<User> => {
    const users = storage.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await hashPassword(password);
    const user: User & { password: string } = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      password: hashedPassword,
    };
    
    storage.saveUsers([...users, user]);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },
  
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const users = storage.getUsers() as (User & { password: string })[];
    const hashedPassword = await hashPassword(password);
    
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = createToken(user.id);
    const userWithoutPassword = { id: user.id, email: user.email, name: user.name, role: user.role };
    
    storage.setCurrentUser(userWithoutPassword);
    storage.setAuthToken(token);
    
    return { user: userWithoutPassword, token };
  },
  
  logout: () => {
    storage.setCurrentUser(null);
    storage.setAuthToken(null);
  },
  
  getCurrentUser: (): User | null => {
    const token = storage.getAuthToken();
    if (!token) return null;
    
    const payload = verifyToken(token);
    if (!payload) {
      auth.logout();
      return null;
    }
    
    return storage.getCurrentUser();
  },
  
  initializeDefaultUsers: async () => {
    const users = storage.getUsers();
    if (users.length === 0) {
      await auth.register('admin@test.com', 'admin123', 'Admin User', 'admin');
      await auth.register('student@test.com', 'student123', 'Student User', 'student');
    }
  }
};
