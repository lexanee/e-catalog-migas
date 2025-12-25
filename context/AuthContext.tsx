
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'vendor' | 'technical';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('iotace_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: UserRole) => {
    // Simulate API Login
    let name = 'System Administrator';
    let avatar = 'AD';
    let company = 'SKK Migas - SCM';

    if (role === 'vendor') {
      name = 'Global Suppliers Ltd.';
      avatar = 'GS';
      company = 'Global Suppliers Ltd.';
    } else if (role === 'technical') {
      name = 'Chief Engineer';
      avatar = 'TE';
      company = 'SKK Migas - Teknis';
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar,
      company
    };
    setUser(newUser);
    localStorage.setItem('iotace_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('iotace_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
