import React from 'react';
import { 
  Building2, 
  Search, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Camera, 
  Video, 
  Cpu, 
  Users, 
  TrendingUp,
  MapPin,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string, id?: string) => void;
  onOpenDemoCreds: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenDemoCreds }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* National Governance Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-6 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Direct Citizen-to-Officer E-Governance Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
              Praja to Policy
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl font-bold text-blue-700 mb-6">
              Your Voice. Better Governance.
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Discover government schemes, report civic issues, and track your complaints through one intelligent platform.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('schemes')}
                className="px-6 py-3.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Schemes</span>
              </button>

              <button
                onClick={() => onNavigate('report')}
                className="px-6 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="px-5 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="px-5 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                Register
              </button>
            </div>

            {/* Direct routing note */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Middlemen: Direct to Field Officers</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Photo & Video Evidence Support</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Demo AI Text Analyzer (LSTM Planned for V2)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Section: Citizen Input → Smart Analysis → Government Insight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-700 mb-2">
            Intelligent Governance Workflow
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Citizen Input → Smart Analysis → Government Insight
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            A transparent 3-step loop ensuring citizen voices convert into accountable civic action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1: Citizen Input */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between relative group">
            <div className="absolute top-5 right-5 text-4xl font-extrabold text-slate-100 group-hover:text-blue-50 transition-colors font-serif">
              01
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                1. Citizen Input
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Citizens submit local grievances with photo or video evidence, exact location, and detailed description without dealing with intermediaries or paper queues.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-700">
              <span>Direct submission</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 2: Smart Analysis */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-colors flex flex-col justify-between relative group">
            <div className="absolute top-5 right-5 text-4xl font-extrabold text-slate-100 group-hover:text-purple-50 transition-colors font-serif">
              02
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                2. Smart Analysis
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated text intelligence categorizes grievance domain, gauges sentiment, detects emergency risk, and calculates urgency priority for instantaneous routing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-700">
              <span>Demo AI Analysis (LSTM V2)</span>
              <Sparkles className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Step 3: Government Insight */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between relative group">
            <div className="absolute top-5 right-5 text-4xl font-extrabold text-slate-100 group-hover:text-emerald-50 transition-colors font-serif">
              03
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                3. Government Insight
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Department officers receive direct task work orders with unique IDs (e.g., PTP-2026-0001), while central administrators track SLA metrics across categories.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
              <span>Accountable Resolution</span>
              <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Government Employee Dedicated Portal Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-amber-400 text-xs font-mono font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Official Department Employee Access</span>
            </div>
            <h3 className="text-2xl font-bold font-serif">
              Are you a Designated Government Field Officer?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Log in with your official Employee Code (e.g. <strong className="text-white">EMP-RD-101</strong>) and department credentials to access grievances assigned directly to your desk. Inspect photo/video proofs and log action notes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('employee-login')}
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors text-center cursor-pointer"
            >
              Officer Portal Login
            </button>
            <button
              onClick={onOpenDemoCreds}
              className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 text-center cursor-pointer"
            >
              View Sample Officer Codes
            </button>
          </div>
        </div>
      </section>

      {/* Welfare Schemes Across All Sectors Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Universal Welfare Catalog
            </span>
            <h3 className="text-2xl font-bold font-serif">
              Explore Government Schemes for All Sectors
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Agriculture, Healthcare, Education, Housing, Employment, Energy & Financial Support. Enter your details to instantly discover which government schemes you are eligible for!
            </p>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="px-6 py-3 rounded-lg bg-white text-blue-900 hover:bg-blue-50 text-sm font-bold shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Launch Scheme Explorer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
