import React, { useState } from 'react';
import { Scheme } from '../types';
import { 
  Building2, 
  CheckCircle, 
  ExternalLink, 
  FileCheck, 
  Gift, 
  Info, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  IndianRupee, 
  AlertTriangle 
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  onApplyClick?: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onApplyClick }) => {
  const [expanded, setExpanded] = useState(false);

  // Sector badge color mapping
  const categoryColors: Record<string, string> = {
    'Agriculture': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Health': 'bg-rose-100 text-rose-800 border-rose-200',
    'Education': 'bg-blue-100 text-blue-800 border-blue-200',
    'Housing': 'bg-amber-100 text-amber-800 border-amber-200',
    'Financial Assistance': 'bg-purple-100 text-purple-800 border-purple-200',
    'Employment': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Women & Child': 'bg-pink-100 text-pink-800 border-pink-200',
    'Energy': 'bg-orange-100 text-orange-800 border-orange-200',
    'Other': 'bg-slate-100 text-slate-800 border-slate-200'
  };

  const badgeColor = categoryColors[scheme.category] || categoryColors['Other'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        {/* Header: Sector & Eligibility Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {scheme.category}
          </span>

          {scheme.is_eligible !== undefined && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                scheme.is_eligible
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {scheme.is_eligible ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Eligible for You</span>
                </>
              ) : (
                <>
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Criteria Mismatch</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Scheme Name & Department */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
          {scheme.name}
        </h3>
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{scheme.department}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {scheme.description}
        </p>

        {/* Highlighted Benefits Bar */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <Gift className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide block">
                Primary Benefit:
              </span>
              <p className="text-xs text-blue-900 font-medium leading-relaxed">
                {scheme.benefits}
              </p>
            </div>
          </div>
        </div>

        {/* Quick parameters */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pb-2">
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-100">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Age: {scheme.min_age} - {scheme.max_age} yrs</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-100">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            <span>Income: {scheme.max_income ? `≤ ₹${(scheme.max_income / 100000).toFixed(1)}L` : 'No Cap'}</span>
          </div>
        </div>

        {/* Eligibility reasons if evaluated */}
        {scheme.reasons && scheme.reasons.length > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 text-[11px] space-y-1 border border-slate-200">
            <span className="font-semibold text-slate-700 block">Personal Assessment:</span>
            {scheme.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-1 text-slate-600">
                <span className="text-slate-400">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible detailed sections */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Eligibility Criteria:
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                {scheme.eligibility}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                Required Documents:
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                {scheme.required_documents}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                <Info className="w-3.5 h-3.5 text-purple-600" />
                Application Process:
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                {scheme.application_process}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
        >
          <span>{expanded ? 'Show Less' : 'Full Eligibility & Docs'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <a
          href={scheme.official_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
