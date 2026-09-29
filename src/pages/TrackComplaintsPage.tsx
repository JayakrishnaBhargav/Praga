import React, { useState, useEffect } from 'react';
import { Complaint } from '../types';
import { api } from '../services/api';
import { 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ArrowRight, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface TrackComplaintsPageProps {
  onNavigate: (tab: string, id?: string) => void;
}

export const TrackComplaintsPage: React.FC<TrackComplaintsPageProps> = ({ onNavigate }) => {
  const [complaintIdInput, setComplaintIdInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    loadRecentComplaints();
  }, [selectedStatus]);

  const loadRecentComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints({
        status: selectedStatus !== 'all' ? selectedStatus : undefined
      });
      setComplaints(res.complaints);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintIdInput.trim()) {
      loadRecentComplaints();
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      // If exact ID format like PTP-2026-XXXX, try getComplaintById
      const trimmed = complaintIdInput.trim();
      const res = await api.getComplaints({ search: trimmed });
      setComplaints(res.complaints);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Real-time Public Grievance Verification</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">
          Track Grievance Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Enter your unique Complaint ID (e.g. <strong>PTP-2026-0001</strong>) to view direct officer field notes, photo/video proofs, and milestone progress.
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-blue-600 shadow-sm overflow-hidden">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={complaintIdInput}
            onChange={(e) => setComplaintIdInput(e.target.value)}
            placeholder="Enter Complaint ID (e.g. PTP-2026-0001) or Area Name..."
            className="w-full py-3.5 px-3 text-xs sm:text-sm focus:outline-hidden text-slate-800 placeholder-slate-400 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            Track Status
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500">
          <span>Try Sample IDs:</span>
          {['PTP-2026-0001', 'PTP-2026-0002', 'PTP-2026-0003'].map(id => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setComplaintIdInput(id);
                api.getComplaints({ search: id }).then(res => setComplaints(res.complaints));
              }}
              className="font-mono text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider">
          Filter by Status:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'Submitted', 'Under Review', 'Forwarded to Department', 'In Progress', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500">
          Loading grievance records...
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No grievances found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check the complaint reference ID or clear search filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map(item => {
            const statusColors: Record<string, string> = {
              'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
              'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
              'Forwarded to Department': 'bg-amber-50 text-amber-700 border-amber-200',
              'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
              'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200'
            };

            return (
              <div
                key={item.id}
                onClick={() => onNavigate('detail', item.complaint_id)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {item.complaint_id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[item.status] || ''}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.summary || item.description.slice(0, 90)}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.city}, {item.district}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.assigned_department}</span>
                    </span>
                    <span>
                      Lodged: {new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('detail', item.complaint_id);
                    }}
                    className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View Timeline & Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
