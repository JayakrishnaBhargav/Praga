import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Search, 
  AlertCircle, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Briefcase, 
  Layers,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, id?: string) => void;
  onOpenDemoCreds: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenDemoCreds }) => {
  const { user, role, logout, quickSwitch } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Government Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 font-medium text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>National E-Governance Initiative</span>
          </div>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Direct Citizen-to-Officer Grievance Redressal</span>
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <button
            onClick={onOpenDemoCreds}
            className="text-amber-300 hover:text-amber-200 font-medium underline flex items-center gap-1 cursor-pointer"
          >
            <span>Role Switcher & Demo Passwords</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Toll Free: 1800-PRAJA-24</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo & Emblem */}
          <div 
            onClick={() => handleNav('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-600/20 group-hover:bg-blue-800 transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                  Praja to Policy
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Gov Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Public Insight & Direct Civic Governance
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('landing')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentTab === 'landing' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('schemes')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentTab === 'schemes' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Explore Schemes</span>
            </button>

            <button
              onClick={() => handleNav('report')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentTab === 'report' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Report Grievance</span>
            </button>

            <button
              onClick={() => handleNav('track')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                currentTab === 'track' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Track Status</span>
            </button>

            {/* Role specific portals */}
            {user && (
              <>
                <div className="h-5 w-px bg-slate-200 mx-1"></div>
                {role === 'citizen' && (
                  <button
                    onClick={() => handleNav('citizen-dashboard')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentTab === 'citizen-dashboard' ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    My Grievance Desk
                  </button>
                )}
                {role === 'employee' && (
                  <button
                    onClick={() => handleNav('employee-dashboard')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                      currentTab === 'employee-dashboard' ? 'text-indigo-700 bg-indigo-50 font-semibold' : 'text-indigo-600 hover:bg-indigo-50/50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Officer Desk ({user.employee_code})</span>
                  </button>
                )}
                {role === 'admin' && (
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                      currentTab === 'admin-dashboard' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-rose-600 hover:bg-rose-50/50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Central</span>
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                    {user.name}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    {user.role === 'employee' ? `${user.employee_code} • ${user.department?.split(' ')[0]}` : user.role}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Citizen Login
                </button>
                <button
                  onClick={() => handleNav('employee-login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                >
                  Officer Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('landing')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('schemes')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
          >
            Explore Welfare Schemes
          </button>
          <button
            onClick={() => handleNav('report')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
          >
            Report Civic Grievance
          </button>
          <button
            onClick={() => handleNav('track')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100"
          >
            Track Grievance Status
          </button>

          {user && (
            <div className="pt-2 border-t border-slate-100">
              {role === 'citizen' && (
                <button
                  onClick={() => handleNav('citizen-dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md"
                >
                  Citizen Dashboard
                </button>
              )}
              {role === 'employee' && (
                <button
                  onClick={() => handleNav('employee-dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md"
                >
                  Officer Desk ({user.employee_code})
                </button>
              )}
              {role === 'admin' && (
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-rose-700 bg-rose-50 rounded-md"
                >
                  Admin Central Dashboard
                </button>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <div className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-md">
                <div>
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-slate-500 uppercase">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2 text-center text-sm font-medium text-slate-700 border border-slate-300 rounded-md"
                >
                  Citizen Login
                </button>
                <button
                  onClick={() => handleNav('employee-login')}
                  className="w-full py-2 text-center text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md"
                >
                  Officer Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="col-span-2 w-full py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md"
                >
                  Citizen Registration
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
