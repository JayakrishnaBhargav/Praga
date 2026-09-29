import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint } from '../types';
import { api } from '../services/api';
import { 
  Briefcase, 
  UserCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Camera, 
  Video, 
  FileEdit, 
  ShieldAlert, 
  Search,
  Filter,
  CheckCircle
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Selected complaint for quick status update modal
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [actionStatus, setActionStatus] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOfficerComplaints();
  }, [user, statusFilter]);

  const loadOfficerComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints({
        employee_code: user?.employee_code,
        department: user?.department,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setComplaints(res.complaints);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    setUpdating(true);
    try {
      await api.updateComplaintStatus(activeComplaint.complaint_id, {
        status: actionStatus,
        note: actionNote || `Status updated to ${actionStatus} by ${user?.name || 'Assigned Officer'}.`,
        officer_name: `${user?.name || 'Officer'} (${user?.employee_code})`
      });

      setActiveComplaint(null);
      setActionNote('');
      loadOfficerComplaints();
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
  };

  const pendingCount = complaints.filter(c => c.status !== 'Resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' || c.priority === 'High').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 text-xs font-mono font-semibold border border-indigo-700/50">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Direct Officer Desk: {user?.employee_code || 'EMP-RD-101'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              {user?.name || 'Authorized Field Officer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-3">
              <span>Department: <strong>{user?.department || 'Roads & Highway Maintenance'}</strong></span>
              <span>•</span>
              <span>Designation: <strong>{user?.designation || 'Executive Field Officer'}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mediator Bypass Active (Direct Dispatch)</span>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('track')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              Public Tracker
            </button>
          </div>
        </div>
      </div>

      {/* Officer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Direct Desks
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-serif">
              {complaints.length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Total citizen reports</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Critical / High Urgency
            </p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-serif">
              {criticalCount}
            </h3>
            <p className="text-[11px] text-amber-600/80 mt-0.5">Prioritized by AI Demo</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Resolved & Closed
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-serif">
              {resolvedCount}
            </h3>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Completed work orders</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Complaints Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Grievances Assigned Directly to Your Jurisdiction
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review citizen-provided photo/video evidence and update resolution milestones.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1">
            {['all', 'Submitted', 'Under Review', 'In Progress', 'Resolved'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            Querying officer assignment table...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No active grievances in this queue</h3>
            <p className="text-xs text-slate-500">
              All direct complaints assigned to your desk have been resolved or filter returned zero results.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Citizen & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority / AI Urgency</th>
                  <th className="py-3 px-4">Media Proof</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(item => {
                  const statusColors: Record<string, string> = {
                    'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
                    'Forwarded to Department': 'bg-amber-50 text-amber-700 border-amber-200',
                    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {item.complaint_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{item.user_name}</div>
                        <div className="text-[11px] text-slate-500">{item.city}, {item.district}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                            item.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.priority}
                          </span>
                          <span className="text-[10px] text-slate-400">({item.urgency} urgency)</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.media_urls && item.media_urls.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold border border-blue-200">
                            <Camera className="w-3 h-3" />
                            <span>{item.media_urls.length} Attached</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">No media</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[item.status] || ''}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActiveComplaint(item);
                            setActionStatus(item.status);
                            setActionNote('');
                          }}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Take Action
                        </button>
                        <button
                          onClick={() => onNavigate('detail', item.complaint_id)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Full
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

      {/* Quick Action Modal */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-indigo-300" />
                  <span>Update Grievance: {activeComplaint.complaint_id}</span>
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Logged in as {user?.name} ({user?.employee_code})
                </p>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="text-indigo-300 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleQuickStatusSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Citizen Issue:</span>
                <p className="text-slate-800 font-medium mt-0.5 line-clamp-2">{activeComplaint.description}</p>
                <div className="text-[11px] text-slate-500 mt-1">Location: {activeComplaint.city}, {activeComplaint.district}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Status:
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Forwarded to Department">Forwarded to Department</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Field Action Note / Work Order:
                </label>
                <textarea
                  rows={4}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="e.g. Inspected site at 11:30 AM. Contractor deployed for patch work. Expected completion by tomorrow morning."
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  {updating ? 'Saving Action...' : 'Save & Notify Citizen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
