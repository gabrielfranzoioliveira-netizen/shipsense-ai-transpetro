import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string; avatar?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('shipsense-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('shipsense-users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser && existingUser.password === password) {
      const userData = { id: existingUser.id, email: existingUser.email, name: existingUser.name, avatar: existingUser.avatar };
      setUser(userData);
      localStorage.setItem('shipsense-user', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Email ou senha incorretos' };
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('shipsense-users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: 'Este email já está cadastrado' };
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=10b981`
    };
    
    users.push(newUser);
    localStorage.setItem('shipsense-users', JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name, avatar: newUser.avatar };
    setUser(userData);
    localStorage.setItem('shipsense-user', JSON.stringify(userData));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shipsense-user');
  };

  const updateProfile = (data: { name?: string; avatar?: string }) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('shipsense-user', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('shipsense-users') || '[]');
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem('shipsense-users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
