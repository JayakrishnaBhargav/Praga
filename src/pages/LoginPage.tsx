import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string, id?: string) => void;
  onOpenDemoCreds: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onOpenDemoCreds }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('citizen@praja.gov.in');
  const [password, setPassword] = useState('citizenpassword123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('citizen-dashboard');
      }
    } catch (e: any) {
      setError(e.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Citizen & Admin Login
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your grievance desk or track government schemes.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@praja.gov.in"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-3 text-center">
          <button
            type="button"
            onClick={onOpenDemoCreds}
            className="text-xs text-blue-700 hover:underline font-semibold"
          >
            Click here for Quick Role Switcher & Passwords
          </button>

          <div className="text-xs text-slate-500">
            Are you a Government Field Officer?{' '}
            <button
              onClick={() => onNavigate('employee-login')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Officer Portal (Code Login)
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-blue-600 font-bold hover:underline"
            >
              Register as Citizen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
