import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint, Scheme } from '../types';
import { api } from '../services/api';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Layers, 
  PlusCircle, 
  Search, 
  MapPin, 
  AlertCircle, 
  Eye, 
  ArrowRight, 
  Sparkles,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface CitizenDashboardProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [recommendedSchemes, setRecommendedSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load complaints for this citizen (or all demo complaints if guest)
      const res = await api.getComplaints({
        user_id: user?.id
      });
      setComplaints(res.complaints);

      // Load recommended schemes based on citizen's profile
      if (user?.age && user?.income) {
        const elig = await api.checkEligibility({
          age: user.age,
          income: user.income,
          occupation: user.occupation || 'Farmer',
          state: user.state || 'Telangana'
        });
        setRecommendedSchemes(elig.schemes.filter(s => s.is_eligible).slice(0, 3));
      } else {
        const schemesRes = await api.getSchemes();
        setRecommendedSchemes(schemesRes.schemes.slice(0, 3));
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = complaints.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-700/80 text-blue-200 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified Citizen Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Namaste, {user?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-300" />
                <span>{user?.city || 'Hyderabad'}, {user?.state || 'Telangana'}</span>
              </span>
              <span>•</span>
              <span>Occupation: <strong>{user?.occupation || 'Farmer / General Citizen'}</strong></span>
              {user?.income && (
                <>
                  <span>•</span>
                  <span>Annual Income: <strong>₹{user.income.toLocaleString('en-IN')}</strong></span>
                </>
              )}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Complaint</span>
            </button>
            <button
              onClick={() => onNavigate('schemes')}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Find Schemes</span>
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Track Complaints</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total My Complaints */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              My Complaints
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-serif">
              {complaints.length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Total registered</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Complaints
            </p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-serif">
              {pendingCount}
            </h3>
            <p className="text-[11px] text-amber-600/80 mt-0.5">Under field resolution</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resolved Complaints
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-serif">
              {resolvedCount}
            </h3>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Verified & closed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Recommended Schemes */}
        <div 
          onClick={() => onNavigate('schemes')}
          className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors group"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Recommended Schemes
            </p>
            <h3 className="text-2xl font-extrabold text-blue-800 mt-1 font-serif">
              {recommendedSchemes.length}+
            </h3>
            <p className="text-[11px] text-blue-600/80 mt-0.5 flex items-center gap-1 group-hover:underline">
              <span>View Eligible Schemes</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              My Civic Grievances
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status tracking with direct officer assignment
            </p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <span>+ Report New Issue</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Loading your grievances...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No complaints filed yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Spot a pothole, broken streetlight, or water pipeline burst? Submit a grievance with photo or video evidence.
            </p>
            <button
              onClick={() => onNavigate('report')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report a Civic Issue
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Complaint ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => {
                  const statusColors: Record<string, string> = {
                    'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
                    'Forwarded to Department': 'bg-amber-50 text-amber-700 border-amber-200',
                    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  };

                  const priorityColors: Record<string, string> = {
                    'Low': 'text-slate-600 bg-slate-100',
                    'Medium': 'text-amber-700 bg-amber-50',
                    'High': 'text-orange-700 bg-orange-50',
                    'Critical': 'text-rose-700 bg-rose-50 font-bold'
                  };

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => onNavigate('detail', item.complaint_id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {item.complaint_id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${priorityColors[item.priority] || ''}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[item.status] || ''}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('detail', item.complaint_id);
                          }}
                          className="p-1.5 rounded text-blue-700 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Schemes Spotlight */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Recommended Government Schemes For You</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Matched automatically based on your occupation ({user?.occupation || 'General'}), age ({user?.age || 'Adult'}), and income ceiling.
            </p>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All Sectors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => onNavigate('schemes')}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {scheme.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                  {scheme.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {scheme.benefits}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-700">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
