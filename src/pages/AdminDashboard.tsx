import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Complaint, AdminStats } from '../types';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Search, 
  Edit3, 
  Eye, 
  Users,
  ChevronRight,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit / Reassignment Modal
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editEmployeeCode, setEditEmployeeCode] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, [statusFilter]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, complaintsData] = await Promise.all([
        api.getAdminStats(),
        api.getComplaints({
          status: statusFilter !== 'all' ? statusFilter : undefined
        })
      ]);
      setStats(statsData);
      setComplaints(complaintsData.complaints);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;

    setSaving(true);
    try {
      await api.updateComplaintStatus(editingComplaint.complaint_id, {
        status: editStatus,
        priority: editPriority,
        assigned_employee_code: editEmployeeCode || undefined,
        note: adminNote || `Updated by Central Administrator (${user?.name}).`,
        officer_name: `Admin Central (${user?.name})`
      });

      setEditingComplaint(null);
      loadAdminData();
    } catch (e: any) {
      alert(e.message || 'Failed to update grievance');
    } finally {
      setSaving(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.complaint_id.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.assigned_department.toLowerCase().includes(q) ||
      c.user_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>State Central Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">
            {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {user?.designation || 'Principal Secretary'} • {user?.department || 'General Administration Department'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('schemes')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Manage Schemes
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Complaints */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Complaints
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-serif">
              {stats?.total ?? 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorded across all sectors</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending
            </p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-serif">
              {stats?.pending ?? 0}
            </h3>
            <p className="text-[11px] text-amber-600/80 mt-0.5">In field review & execution</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
              High / Critical Priority
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1 font-serif">
              {stats?.highPriority ?? 0}
            </h3>
            <p className="text-[11px] text-rose-600/80 mt-0.5">Urgent public risk</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Resolved
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1 font-serif">
              {stats?.resolved ?? 0}
            </h3>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">
              {stats?.total ? Math.round(((stats?.resolved || 0) / stats.total) * 100) : 0}% Resolution Rate
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Real Database Analytics Charts */}
      {(!stats || stats.total === 0) ? (
        <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          No complaints available.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Complaints by Category */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Complaints by Category (Real Database Count)</span>
            </h3>

            <div className="space-y-3 pt-2">
              {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / stats.total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{cat}</span>
                      <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Complaints by Status */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Complaints by Status Lifecycle</span>
            </h3>

            <div className="space-y-3 pt-2">
              {Object.entries(stats.statusCounts).map(([status, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                const colors: Record<string, string> = {
                  'Submitted': 'bg-blue-500',
                  'Under Review': 'bg-purple-500',
                  'Forwarded to Department': 'bg-amber-500',
                  'In Progress': 'bg-indigo-500',
                  'Resolved': 'bg-emerald-500'
                };
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{status}</span>
                      <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors[status] || 'bg-slate-400'}`}
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Complaints by Priority */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Complaints by Priority Matrix</span>
            </h3>

            <div className="grid grid-cols-4 gap-3 text-center pt-2">
              {[
                { label: 'Low', count: stats.priorityCounts['Low'] || 0, color: 'text-slate-600 bg-slate-50' },
                { label: 'Medium', count: stats.priorityCounts['Medium'] || 0, color: 'text-amber-700 bg-amber-50' },
                { label: 'High', count: stats.priorityCounts['High'] || 0, color: 'text-orange-700 bg-orange-50' },
                { label: 'Critical', count: stats.priorityCounts['Critical'] || 0, color: 'text-rose-700 bg-rose-50' }
              ].map(p => (
                <div key={p.label} className={`p-3 rounded-lg border border-slate-200 ${p.color}`}>
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className="text-2xl font-extrabold block mt-1">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 4: Complaints Over Time */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Complaints Intake Volume Over Time</span>
            </h3>

            <div className="flex items-end justify-between h-36 pt-6 px-2 gap-2">
              {stats.recentDays.map((d, idx) => {
                const maxVal = Math.max(1, ...stats.recentDays.map(r => r.count));
                const barHeightPct = Math.max(15, (d.count / maxVal) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[11px] font-mono font-bold text-slate-700">{d.count}</span>
                    <div
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all"
                      style={{ height: `${barHeightPct}%` }}
                    />
                    <span className="text-[10px] text-slate-500 truncate text-center w-full">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Admin Grievances Table & Management */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Statewide Grievance Redressal Audit Table
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Change status, reassign department/employee, change priority, add notes, or mark resolved.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, category, city..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Forwarded to Department">Forwarded to Department</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            Querying all departments...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No complaints available matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Department / Officer</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map(item => {
                  const statusColors: Record<string, string> = {
                    'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
                    'Forwarded to Department': 'bg-amber-50 text-amber-700 border-amber-200',
                    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {item.complaint_id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.city}, {item.district}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 truncate max-w-[140px]">{item.assigned_department}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.assigned_employee_name || 'Desk Officer'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                          item.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[item.status] || ''}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingComplaint(item);
                            setEditStatus(item.status);
                            setEditPriority(item.priority);
                            setEditDepartment(item.assigned_department);
                            setEditEmployeeCode(item.assigned_employee_code || '');
                            setAdminNote('');
                          }}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => onNavigate('detail', item.complaint_id)}
                          className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs transition-colors cursor-pointer"
                        >
                          View
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

      {/* Admin Complaint Management Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-rose-400" />
                  <span>Admin Management: {editingComplaint.complaint_id}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Category: {editingComplaint.category} • Location: {editingComplaint.city}
                </p>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Change Status:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
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
                    Change Priority:
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Officer / Employee Code:
                </label>
                <select
                  value={editEmployeeCode}
                  onChange={(e) => setEditEmployeeCode(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="EMP-RD-101">EMP-RD-101 (Er. R. K. Sharma - Roads)</option>
                  <option value="EMP-WTR-202">EMP-WTR-202 (Smt. Ananya Rao - Water)</option>
                  <option value="EMP-SAN-303">EMP-SAN-303 (Sri Suresh Kumar - Sanitation)</option>
                  <option value="EMP-ELEC-404">EMP-ELEC-404 (Er. Vikram Patel - Electricity)</option>
                  <option value="EMP-HLT-505">EMP-HLT-505 (Dr. Meera Nambiar - Health)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Administrative Directive / Note:
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Enter administrative directive to field engineer or mark reason for status transition..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  {saving ? 'Updating...' : 'Save Directive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
