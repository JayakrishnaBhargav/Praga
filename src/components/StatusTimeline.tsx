import React from 'react';
import { TimelineEvent } from '../types';
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: string;
  timeline: TimelineEvent[];
  assignedOfficerName?: string;
  assignedDepartment?: string;
}

const ORDERED_STEPS = [
  'Submitted',
  'Under Review',
  'Forwarded to Department',
  'In Progress',
  'Resolved'
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  timeline,
  assignedOfficerName,
  assignedDepartment
}) => {
  const currentIndex = ORDERED_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center justify-between">
          <span>Grievance Progression Lifecycle</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Current: {currentStatus}
          </span>
        </h4>

        <div className="relative">
          {/* Track line behind */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          <div 
            className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 -z-0"
            style={{ width: `${Math.max(0, (currentIndex / (ORDERED_STEPS.length - 1)) * 95)}%` }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {ORDERED_STEPS.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <div key={step} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs shrink-0 ${
                      isPast
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-blue-700 font-bold'
                          : isPast
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </p>
                    <p className="text-[10px] text-slate-500 hidden md:block mt-0.5">
                      {idx === 0 && 'Direct dispatch'}
                      {idx === 1 && 'Officer audit'}
                      {idx === 2 && 'Department queue'}
                      {idx === 3 && 'On-site execution'}
                      {idx === 4 && 'Citizen verified'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Officer Notice */}
        {assignedDepartment && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Direct Routing Officer: <strong className="text-slate-900">{assignedOfficerName || 'Assigned Officer'}</strong>
              </span>
            </div>
            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Dept: {assignedDepartment}
            </span>
          </div>
        )}
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Milestone Event Trail & Official Notes</span>
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timeline.map((event, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white border-2 border-white shadow-xs"></div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {event.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(event.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {event.note}
                </p>
                <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>Logged by: {event.updated_by_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
