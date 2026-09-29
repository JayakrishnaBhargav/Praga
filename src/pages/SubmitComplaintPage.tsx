import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AIAnalysisResult, ComplaintMedia } from '../types';
import { 
  AlertCircle, 
  Cpu, 
  Sparkles, 
  Upload, 
  Image, 
  Video, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Info, 
  ShieldAlert,
  HelpCircle,
  Camera
} from 'lucide-react';

interface SubmitComplaintPageProps {
  onNavigate: (tab: string, id?: string) => void;
}

const CATEGORIES = [
  'Roads',
  'Water',
  'Electricity',
  'Sanitation',
  'Healthcare',
  'Education',
  'Transport',
  'Public Safety',
  'Other'
];

// Sample media presets for fast testing
const SAMPLE_PRESETS: { name: string; type: 'image' | 'video'; url: string }[] = [
  {
    name: 'road_pothole_crater.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'water_pipe_leakage.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'garbage_overflow_dump.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'
  }
];

export const SubmitComplaintPage: React.FC<SubmitComplaintPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads');
  const [state, setState] = useState(user?.state || 'Telangana');
  const [district, setDistrict] = useState(user?.district || 'Hyderabad');
  const [city, setCity] = useState(user?.city || 'Khairatabad');
  
  // Media attachments (photos or videos)
  const [mediaList, setMediaList] = useState<ComplaintMedia[]>([]);
  
  // AI Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaList((prev) => [
            ...prev,
            {
              type: isVideo ? 'video' : 'image',
              url: event.target!.result as string,
              name: file.name
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const addPresetMedia = (preset: { name: string; type: 'image' | 'video'; url: string }) => {
    setMediaList((prev) => [...prev, preset]);
  };

  // Run Demo AI Analysis
  const handleAnalyzeComplaint = async () => {
    if (!description.trim()) {
      setError('Please write a complaint description before running AI analysis.');
      return;
    }
    setError(null);
    setAnalyzing(true);
    try {
      const res = await api.analyzeComplaint({
        description,
        category
      });
      setAiAnalysis(res);
      // Auto-update category if detected
      if (res.category && CATEGORIES.includes(res.category)) {
        setCategory(res.category);
      }
    } catch (e: any) {
      setError(e.message || 'AI analysis request failed');
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit Complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !state.trim() || !district.trim() || !city.trim()) {
      setError('Please fill in the description, state, district, and city/area.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await api.submitComplaint({
        description,
        category,
        state,
        district,
        city,
        media_urls: mediaList,
        user_id: user?.id || 'USR-DEMO-CITIZEN',
        user_name: user?.name || 'Verified Citizen',
        user_phone: user?.phone || '+91 98480 22338',
        ai_analysis: aiAnalysis || undefined
      });

      setSubmittedId(res.complaint.complaint_id);
    } catch (e: any) {
      setError(e.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  // If already submitted successfully, show confirmation screen
  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Grievance Successfully Registered!
            </h2>
            <p className="text-xs text-slate-500">
              Directly routed to the designated Department Officer Desk without intermediaries.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-xs uppercase font-bold text-blue-700 tracking-wider mb-1">
              Your Unique Complaint ID
            </p>
            <p className="text-3xl font-extrabold text-blue-900 font-mono tracking-wider">
              {submittedId}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              Save this number to track live resolution progress, inspection photos, and officer remarks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('detail', submittedId)}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Grievance Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('citizen-dashboard')}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Back to My Desk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>Direct Civic Grievance Lodging</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">
          Report a Civic Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Submit local infrastructure or public service grievances directly to field government authorities with photographic and video evidence.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Issue Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Civic Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs ring-2 ring-blue-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Telangana"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Hyderabad"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Ward / Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Khairatabad Ward 14"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Complaint Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Detailed Grievance Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Be specific about landmarks and hazard level
              </span>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the civic issue in detail. Example: Large pothole measuring 4ft across on Main Bus Route near Pillar 45. Two two-wheelers skidded last night. Needs immediate bitumen quick-patch."
              required
              className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* AI Analysis Trigger Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-50/60 border border-purple-100 p-4 rounded-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <Cpu className="w-4 h-4 text-purple-700" />
                <span>Run Demo AI Analysis</span>
              </div>
              <p className="text-[11px] text-purple-700">
                Auto-evaluates category, sentiment, urgency & priority before submitting.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeComplaint}
              disabled={analyzing || !description.trim()}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Analyzing Text...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Complaint</span>
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Display Result (Clearly labeled as Demo AI Analysis) */}
          {aiAnalysis && (
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                    Demo AI Analysis
                  </span>
                  <span className="text-xs text-slate-400">
                    (LSTM Model Planned for V2)
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {aiAnalysis.confidence}% Confidence
                </span>
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Detected Category
                  </span>
                  <span className="font-bold text-blue-300">{aiAnalysis.category}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Sentiment
                  </span>
                  <span className="font-bold text-amber-300">{aiAnalysis.sentiment}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Urgency
                  </span>
                  <span className={`font-bold ${aiAnalysis.urgency === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {aiAnalysis.urgency}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Priority Score
                  </span>
                  <span className="font-bold text-rose-400">{aiAnalysis.priority}</span>
                </div>
              </div>

              {/* Complaint Summary */}
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/40 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  AI Generated Complaint Summary
                </span>
                <p className="text-slate-200">{aiAnalysis.summary}</p>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Note: {aiAnalysis.notice}
              </p>
            </div>
          )}
        </div>

        {/* Media Upload Card (Photos or Videos) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Upload Photos or Video Evidence (Grievance Media)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Attach photographic proof or video footage to expedite field officer verification without mediators.
              </p>
            </div>

            {/* Quick Presets for Demo */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px]">Quick Attach:</span>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => addPresetMedia(preset)}
                  className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded text-[11px] border border-slate-200 transition-colors cursor-pointer"
                >
                  +{preset.name.split('_')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Input Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-2 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Click or drag & drop photos or videos here
              </p>
              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP, MP4, MOV (Multiple files accepted)
              </p>
            </div>
          </div>

          {/* Attached Media List */}
          {mediaList.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Attached Files ({mediaList.length}):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {mediaList.map((m, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-900"
                  >
                    {m.type === 'video' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-white">
                        <Video className="w-6 h-6 text-blue-400 mb-1" />
                        <span className="text-[10px] truncate max-w-full text-slate-300 font-mono">{m.name}</span>
                      </div>
                    ) : (
                      <img
                        src={m.url}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 max-w-md">
            Upon clicking submit, a unique tracking ID (e.g. PTP-2026-XXXX) will be assigned and forwarded directly to the designated department officer desk.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Dispatching Directly to Officer Desk...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Complaint</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
