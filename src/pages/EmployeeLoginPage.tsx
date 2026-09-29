import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Key, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface EmployeeLoginPageProps {
  onNavigate: (tab: string, id?: string) => void;
  onOpenDemoCreds: () => void;
}

const SAMPLE_CODES = [
  { code: 'EMP-RD-101', dept: 'Roads & Highway Maintenance', name: 'Er. R. K. Sharma' },
  { code: 'EMP-WTR-202', dept: 'Municipal Water Supply & Sewerage', name: 'Smt. Ananya Rao' },
  { code: 'EMP-SAN-303', dept: 'Municipal Solid Waste & Sanitation', name: 'Sri Suresh Kumar' },
  { code: 'EMP-ELEC-404', dept: 'State Electricity Distribution Corp', name: 'Er. Vikram Patel' }
];

export const EmployeeLoginPage: React.FC<EmployeeLoginPageProps> = ({ onNavigate, onOpenDemoCreds }) => {
  const { employeeLogin } = useAuth();
  const [employeeCode, setEmployeeCode] = useState('EMP-RD-101');
  const [password, setPassword] = useState('employee123');
  const [department, setDepartment] = useState('Roads & Highway Maintenance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await employeeLogin(employeeCode, password, department);
      onNavigate('employee-dashboard');
    } catch (e: any) {
      setError(e.message || 'Invalid Employee Code or credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_CODES[0]) => {
    setEmployeeCode(sample.code);
    setDepartment(sample.dept);
    setPassword('employee123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center mx-auto shadow-xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
            <span>Official Government Personnel</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif">
            Officer Desk Login
          </h2>
          <p className="text-xs text-slate-500">
            Designated field employees authenticate with unique Employee Code to access direct citizen grievances without mediator intervention.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Official Employee Code (ID) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
                placeholder="e.g. EMP-RD-101"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono font-bold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Roads & Highway Maintenance"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
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
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-300 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating Officer...' : 'Access Direct Officer Desk'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick select employee badges */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
            Click to auto-fill sample Officer code:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_CODES.map((s) => (
              <button
                type="button"
                key={s.code}
                onClick={() => handleSelectSample(s)}
                className={`p-2 rounded text-left border text-[11px] transition-all cursor-pointer ${
                  employeeCode === s.code
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-mono text-indigo-700">{s.code}</div>
                <div className="truncate text-slate-500 text-[10px]">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Return to Citizen / Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};
