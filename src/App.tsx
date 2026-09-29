import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoCredentialsModal } from './components/DemoCredentialsModal';

import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { SchemeExplorerPage } from './pages/SchemeExplorerPage';
import { TrackComplaintsPage } from './pages/TrackComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { LoginPage } from './pages/LoginPage';
import { EmployeeLoginPage } from './pages/EmployeeLoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const { user, role, quickSwitch } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('PTP-2026-0001');
  const [demoCredsOpen, setDemoCredsOpen] = useState(false);

  const handleNavigate = (tab: string, id?: string) => {
    // Role guard: Citizens must not access admin or employee desks
    if (tab === 'admin-dashboard' && role !== 'admin') {
      alert('Access Restricted: Government Admin credentials required.');
      setCurrentTab('login');
      return;
    }
    if (tab === 'employee-dashboard' && role !== 'employee') {
      alert('Access Restricted: Official Government Employee credentials required.');
      setCurrentTab('employee-login');
      return;
    }

    if (id) {
      setSelectedComplaintId(id);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = async (targetRole: 'citizen' | 'employee' | 'admin') => {
    await quickSwitch(targetRole);
    if (targetRole === 'citizen') {
      setCurrentTab('citizen-dashboard');
    } else if (targetRole === 'employee') {
      setCurrentTab('employee-dashboard');
    } else if (targetRole === 'admin') {
      setCurrentTab('admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenDemoCreds={() => setDemoCredsOpen(true)}
      />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenDemoCreds={() => setDemoCredsOpen(true)}
          />
        )}

        {currentTab === 'schemes' && (
          <SchemeExplorerPage />
        )}

        {currentTab === 'report' && (
          <SubmitComplaintPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'track' && (
          <TrackComplaintsPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'detail' && (
          <ComplaintDetailPage
            complaintId={selectedComplaintId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'citizen-dashboard' && (
          <CitizenDashboard
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'employee-dashboard' && (
          <EmployeeDashboard
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onOpenDemoCreds={() => setDemoCredsOpen(true)}
          />
        )}

        {currentTab === 'employee-login' && (
          <EmployeeLoginPage
            onNavigate={handleNavigate}
            onOpenDemoCreds={() => setDemoCredsOpen(true)}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer />

      {/* Demo Credentials & Fast Role Switcher Modal */}
      <DemoCredentialsModal
        isOpen={demoCredsOpen}
        onClose={() => setDemoCredsOpen(false)}
        onSelectRole={handleSelectRole}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
