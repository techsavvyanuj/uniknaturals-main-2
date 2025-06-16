'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on client side
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      setIsAuthenticated(!!adminAuth);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      if (email === 'admin@uniknaturals.com' && password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        
        // Also set a cookie for the middleware
        document.cookie = `adminAuth=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    
    // Clear the auth cookie
    document.cookie = 'adminAuth=; path=/; max-age=0';
    
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
} 