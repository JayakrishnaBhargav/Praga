import React from 'react';
import { Building2, Shield, HeartHandshake, PhoneCall, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Mandate */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white font-serif tracking-tight">
                Praja to Policy
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Public Insight and Governance platform. Bridging citizens directly with field government officers, eliminating intermediaries, and democratizing access to welfare benefits.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>Certified Citizen Grievance Portal</span>
            </div>
          </div>

          {/* Grievance Sectors */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Direct Officer Desks</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Roads & Highway Infrastructure</li>
              <li>• Municipal Water Supply & Drainage</li>
              <li>• Electricity & Renewable Grid Corp</li>
              <li>• Solid Waste Management & Sanitation</li>
              <li>• Public Health & Family Welfare</li>
            </ul>
          </div>

          {/* Quick Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Citizen Services</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Government Welfare Scheme Explorer</li>
              <li>• Smart Eligibility Assessment</li>
              <li>• AI-Assisted Issue Categorization (V1 Demo)</li>
              <li>• Milestone Grievance Tracking Timeline</li>
              <li>• Official Action Reports & Audit Trail</li>
            </ul>
          </div>

          {/* Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Helpline & Support</h4>
            <div className="text-xs space-y-2 text-slate-400">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span>Toll-Free Helpline: <strong>1800-PRAJA-24</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@praja.gov.in</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700/60 text-[11px] text-slate-300 mt-2">
                Citizen charter response guarantee: Grievances routed to department officers within <strong>0 hours</strong> of submission.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>© 2026 Praja to Policy – Public Insight & Governance. Designed for Transparent E-Governance.</p>
          <div className="flex space-x-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Hyperlinking Policy</span>
            <span>Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
