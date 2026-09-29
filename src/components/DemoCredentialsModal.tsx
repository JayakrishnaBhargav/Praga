import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Briefcase, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

interface DemoCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'citizen' | 'employee' | 'admin') => void;
}

export const DemoCredentialsModal: React.FC<DemoCredentialsModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Multi-Role Access & Official Officer Credentials</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Switch roles instantly to test citizen reporting, direct officer desk, and admin oversight.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Current Session */}
          {user && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>
                  Currently Logged in as: <strong>{user.name}</strong> ({user.role})
                </span>
              </div>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800 text-[11px]">
                {user.email || user.employee_code}
              </span>
            </div>
          )}

          {/* 1. Citizen Role */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Role 1: Citizen (Praja)</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      Standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    File grievances with photo/video proof, run Demo AI Analysis, and track live milestones.
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    Email: <strong>citizen@praja.gov.in</strong> | Password: <strong>citizenpassword123</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectRole('citizen');
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0 cursor-pointer"
              >
                Switch to Citizen
              </button>
            </div>
          </div>

          {/* 2. Government Employee Role */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-indigo-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Role 2: Government Employee (Direct Desk)</h4>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                      Official Code
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct citizen grievance queue. No mediator. Officer reviews media & updates milestones.
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 space-y-1">
                    <div>Roads Officer Code: <strong>EMP-RD-101</strong> (Er. R. K. Sharma)</div>
                    <div>Water Works Code: <strong>EMP-WTR-202</strong> (Smt. Ananya Rao)</div>
                    <div>Password: <strong>employee123</strong></div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectRole('employee');
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shrink-0 cursor-pointer"
              >
                Switch to Officer Desk
              </button>
            </div>
          </div>

          {/* 3. Government Admin Role */}
          <div className="border border-slate-200 rounded-xl p-4 hover:border-rose-400 transition-colors bg-rose-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Role 3: Government Admin (Central Oversight)</h4>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real database stats & charts (by category, priority, status, time) and department re-assignment.
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    Email: <strong>admin@praja.gov.in</strong> | Password: <strong>adminpassword123</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectRole('admin');
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shrink-0 cursor-pointer"
              >
                Switch to Admin
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
