import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, authStorage } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  employeeLogin: (code: string, pass: string, dept?: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  quickSwitch: (role: 'citizen' | 'employee' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authStorage.getUser();
    const token = authStorage.getToken();
    if (savedUser && token) {
      setUser(savedUser);
      // verify token in background
      api.getMe().then(u => setUser(u)).catch(() => {
        // if invalid, clear
        authStorage.clear();
        setUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await api.login({ email, password: pass });
    setUser(res.user);
    return res.user;
  };

  const employeeLogin = async (code: string, pass: string, dept?: string): Promise<User> => {
    const res = await api.employeeLogin({ employee_code: code, password: pass, department: dept });
    setUser(res.user);
    return res.user;
  };

  const register = async (data: any): Promise<User> => {
    const res = await api.register(data);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  // Demo helper for seamless testing of the multi-role flows without typing
  const quickSwitch = async (targetRole: 'citizen' | 'employee' | 'admin') => {
    if (targetRole === 'citizen') {
      await login('citizen@praja.gov.in', 'citizenpassword123');
    } else if (targetRole === 'employee') {
      await employeeLogin('EMP-RD-101', 'employee123', 'Roads & Highway Maintenance');
    } else if (targetRole === 'admin') {
      await login('admin@praja.gov.in', 'adminpassword123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        login,
        employeeLogin,
        register,
        logout,
        quickSwitch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
