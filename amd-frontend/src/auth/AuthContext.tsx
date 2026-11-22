import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponseData } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: AuthResponseData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Rehydrate user from token/localStorage if needed on mount
    const token = localStorage.getItem('ams_token');
    // Note: Since JWT validation happens on the backend and we don't have an endpoint 
    // to fetch current user profile details in this spec, we might need to decode 
    // the JWT payload or just rely on storing email/role in localStorage as well.
    // For simplicity, we'll store basic user info in localStorage along with token.
    const storedUser = localStorage.getItem('ams_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('ams_token');
        localStorage.removeItem('ams_user');
      }
    }
  }, []);

  const login = (data: AuthResponseData) => {
    localStorage.setItem('ams_token', data.token);
    const userInfo: User = { email: data.email, role: data.role, fullName: data.fullName };
    localStorage.setItem('ams_user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('ams_token');
    localStorage.removeItem('ams_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
