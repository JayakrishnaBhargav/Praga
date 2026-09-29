import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scheme } from '../types';
import { api } from '../services/api';
import { SchemeCard } from '../components/SchemeCard';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal, 
  IndianRupee, 
  User, 
  MapPin, 
  Briefcase,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

const SECTORS = [
  'All',
  'Agriculture',
  'Education',
  'Health',
  'Employment',
  'Housing',
  'Financial Assistance',
  'Women & Child',
  'Energy',
  'Other'
];

export const SchemeExplorerPage: React.FC = () => {
  const { user } = useAuth();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Eligibility Filter Form States (pre-filled from user profile if logged in)
  const [age, setAge] = useState<number>(user?.age || 32);
  const [income, setIncome] = useState<number>(user?.income || 250000);
  const [occupation, setOccupation] = useState<string>(user?.occupation || 'Farmer');
  const [state, setState] = useState<string>(user?.state || 'Telangana');

  const [isEligibilityActive, setIsEligibilityActive] = useState(false);
  const [eligibleCount, setEligibleCount] = useState<number | null>(null);

  useEffect(() => {
    fetchSchemes();
  }, [selectedSector]);

  // Initial auto-evaluation if user has profile
  useEffect(() => {
    if (user?.age && user?.income) {
      handleCheckEligibility();
    }
  }, [user]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.getSchemes({
        category: selectedSector,
        search: searchQuery
      });
      setSchemes(res.schemes);
      setIsEligibilityActive(false);
      setEligibleCount(null);
    } catch (e) {
      console.error('Failed to load schemes:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchemes();
  };

  // Run Smart Eligibility Matcher across all schemes
  const handleCheckEligibility = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.checkEligibility({
        age: Number(age),
        income: Number(income),
        occupation,
        state
      });

      let filtered = res.schemes;
      if (selectedSector !== 'All') {
        filtered = filtered.filter(s => s.category.toLowerCase() === selectedSector.toLowerCase());
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }

      setSchemes(filtered);
      setIsEligibilityActive(true);
      setEligibleCount(res.eligible_count);
    } catch (err) {
      console.error('Failed to check eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setIsEligibilityActive(false);
    setEligibleCount(null);
    api.getSchemes().then(res => setSchemes(res.schemes));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Introduction */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-3 border border-blue-200">
          <Layers className="w-3.5 h-3.5 text-blue-700" />
          <span>Universal Citizen Welfare Database</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          Government Scheme Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Search welfare programs across all government departments. Fill in your socio-economic details to calculate which schemes you and your family are eligible to receive benefits from.
        </p>
      </div>

      {/* Natural Language Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-blue-600 shadow-xs overflow-hidden transition-all">
          <div className="pl-4 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try natural search: 'Are there any government loans for farmers?' or 'Scholarships for girls' or 'Solar rooftop subsidies'..."
            className="w-full py-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            Search Schemes
          </button>
        </div>

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
          <span className="text-[11px] font-semibold text-slate-400">Popular Queries:</span>
          {[
            'Loans for farmers',
            'Ayushman health insurance',
            'Solar roof free electricity',
            'Street vendor working capital',
            'Class 9 merit scholarship'
          ].map((query) => (
            <button
              type="button"
              key={query}
              onClick={() => {
                setSearchQuery(query);
                api.getSchemes({ search: query }).then(res => setSchemes(res.schemes));
              }}
              className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              "{query}"
            </button>
          ))}
        </div>
      </form>

      {/* Personalized Eligibility Calculator Form */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Eligibility Assessment Engine</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your age, income, and occupation to let the system highlight matching benefits.
            </p>
          </div>

          {isEligibilityActive && eligibleCount !== null && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>You qualify for {eligibleCount} Government Scheme(s)!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Age */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Beneficiary Age (Yrs)
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Income */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Annual Family Income (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                step="10000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Current Occupation
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Farmer, Student, Artisan"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              State / Region
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Telangana"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Check Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluate My Eligibility</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sector Category Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold uppercase tracking-wider text-slate-700">Filter by Sector:</span>
          {isEligibilityActive && (
            <button
              onClick={resetFilters}
              className="text-blue-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Assessment Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedSector === sector
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="p-20 text-center text-xs text-slate-500">
          Scanning government scheme repositories...
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No schemes found matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try broadening your search query, choosing 'All' sectors, or clearing your occupation filter.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};
