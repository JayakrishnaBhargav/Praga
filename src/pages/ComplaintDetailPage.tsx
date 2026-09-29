import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint } from '../types';
import { api } from '../services/api';
import { StatusTimeline } from '../components/StatusTimeline';
import { ComplaintMediaViewer } from '../components/ComplaintMediaViewer';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileEdit
} from 'lucide-react';

interface ComplaintDetailPageProps {
  complaintId: string;
  onNavigate: (tab: string, id?: string) => void;
}

export const ComplaintDetailPage: React.FC<ComplaintDetailPageProps> = ({
  complaintId,
  onNavigate
}) => {
  const { user, role } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Officer / Admin Quick Action form
  const [newStatus, setNewStatus] = useState<string>('');
  const [officerNote, setOfficerNote] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const fetchComplaint = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getComplaintById(complaintId);
      setComplaint(data);
      setNewStatus(data.status);
    } catch (e: any) {
      setError(e.message || 'Complaint not found');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setUpdating(true);
    setUpdateSuccess(false);
    try {
      const res = await api.updateComplaintStatus(complaint.complaint_id, {
        status: newStatus,
        note: officerNote || `Status updated to ${newStatus} by ${user?.name || 'Authorized Officer'}.`,
        officer_name: user?.name ? `${user.name} (${user.employee_code || user.role})` : undefined
      });
      setComplaint(res.complaint);
      setOfficerNote('');
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Retrieving grievance record from database...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 font-serif">Grievance Not Found</h2>
        <p className="text-xs text-slate-500">
          We could not locate any complaint matching ID <strong>{complaintId}</strong>.
        </p>
        <button
          onClick={() => onNavigate('track')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Tracker
        </button>
      </div>
    );
  }

  const isOfficerOrAdmin = role === 'employee' || role === 'admin';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => onNavigate(role === 'employee' ? 'employee-dashboard' : role === 'admin' ? 'admin-dashboard' : 'citizen-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Complaint Reference:</span>
          <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            {complaint.complaint_id}
          </span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaint Data & Media */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {complaint.category}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Priority:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  complaint.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                  complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {complaint.priority}
                </span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug">
              {complaint.summary || complaint.description.slice(0, 100)}
            </h1>

            {/* Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Location: <strong>{complaint.city}, {complaint.district}, {complaint.state}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Lodged: <strong>{new Date(complaint.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Citizen: <strong>{complaint.user_name}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Department: <strong>{complaint.assigned_department}</strong></span>
              </div>
            </div>

            {/* Grievance Description */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Full Description
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Photo & Video Evidence Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Attached Photographic / Video Evidence ({complaint.media_urls?.length || 0})
            </h3>
            <ComplaintMediaViewer media={complaint.media_urls || []} />
          </div>

          {/* AI Intelligence Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">Demo AI Text Analysis</span>
              </div>
              <span className="text-[11px] text-purple-300">LSTM Planned for V2</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-slate-800 rounded">
                <span className="text-[10px] text-slate-400 block">Category</span>
                <span className="font-semibold text-slate-200">{complaint.category}</span>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <span className="text-[10px] text-slate-400 block">Sentiment</span>
                <span className="font-semibold text-amber-300">{complaint.sentiment}</span>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <span className="text-[10px] text-slate-400 block">Urgency</span>
                <span className="font-semibold text-rose-300">{complaint.urgency}</span>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <span className="text-[10px] text-slate-400 block">Confidence</span>
                <span className="font-semibold text-emerald-300">{complaint.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Lifecycle & Officer Actions */}
        <div className="space-y-6">
          {/* Officer Action Card (Only if Employee or Admin) */}
          {isOfficerOrAdmin && (
            <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-sm space-y-4 ring-2 ring-indigo-50">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileEdit className="w-4 h-4 text-indigo-600" />
                  <span>Officer Action Console</span>
                </h3>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                  Direct Desk
                </span>
              </div>

              {updateSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Action log recorded & status updated!</span>
                </div>
              )}

              <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Transition Lifecycle Status:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
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
                    Official Inspection / Action Note:
                  </label>
                  <textarea
                    rows={3}
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    placeholder="Enter site verification observations, work order details, or resolution remarks..."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {updating ? 'Updating Milestone...' : 'Save & Append to Public Timeline'}
                </button>
              </form>
            </div>
          )}

          {/* Visual Lifecycle & Audit Trail */}
          <StatusTimeline
            currentStatus={complaint.status}
            timeline={complaint.timeline || []}
            assignedOfficerName={complaint.assigned_employee_name}
            assignedDepartment={complaint.assigned_department}
          />
        </div>
      </div>
    </div>
  );
};
