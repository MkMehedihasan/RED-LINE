import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Search, 
  PlusCircle, 
  Code2, 
  ShieldCheck, 
  Menu, 
  X, 
  Share2, 
  Sparkles,
  Flame,
  Radio
} from 'lucide-react';
import { NewsCategory } from '../types/news';
import { getBengaliDateTime, LiveBengaliDateTime } from '../utils/bengaliDate';

interface HeaderProps {
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  onOpenBloggerModal: () => void;
  onOpenCreatePost: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onGoHome: () => void;
}

const CATEGORIES: NewsCategory[] = [
  'জাতীয়',
  'রাজনীতি',
  'আন্তর্জাতিক',
  'অর্থনীতি',
  'খেলাধুলা',
  'তথ্যপ্রযুক্তি',
  'বিনোদন',
  'মতামত'
];

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenAdmin,
  onOpenBloggerModal,
  onOpenCreatePost,
  searchQuery,
  onSearchChange,
  onGoHome
}) => {
  const [bengaliTime, setBengaliTime] = useState<LiveBengaliDateTime>(getBengaliDateTime());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBengaliTime(getBengaliDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* 1. TOP UTILITY BAR (Live Clock, Date, Weather & Quick Actions) */}
      <div className="bg-[#0B1120] text-slate-300 text-xs py-2 px-4 border-b border-red-600/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Live Bengali Date & Real-time Clock */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>ঢাকা</span>
              <span className="text-slate-500">·</span>
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>{bengaliTime.dateStr}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400/90">{bengaliTime.banglaEraDate}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-slate-300 font-english tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{bengaliTime.timeStr}</span>
            </div>

            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <span className="text-slate-600">|</span>
              <span>তাপমাত্রা: ২৮° সে. রৌদ্রোজ্জ্বল</span>
            </div>
          </div>

          {/* Right: Quick Portal Tool Buttons */}
          <div className="flex items-center gap-2">
            {/* Blogger HTML Theme Code Button */}
            <button
              onClick={onOpenBloggerModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-all shadow-sm shadow-red-900/30"
              title="Blogger.com-এর জন্য রেডি এইচটিএমএল থিম কোড দেখুন"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>ব্লগার থিম কোড (HTML)</span>
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded text-[11px] font-medium transition-colors border border-slate-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>অ্যাডমিন প্যানেল</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="py-3.5 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative">
              <img
                src="/assets/aistudio/image_5c563c18.png"
                alt="RED LINE News Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-red-600/80 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full uppercase tracking-tighter">
                Live
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-english font-black text-2xl md:text-3xl tracking-tight text-red-600 leading-none">
                  RED
                </span>
                <span className="font-english font-extrabold text-2xl md:text-3xl tracking-tight text-slate-900 leading-none">
                  LINE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
                সত্যের সন্ধানে নির্ভীক · অনলাইন নিউজ মিডিয়া
              </p>
            </div>
          </div>

          {/* Desktop Search Bar & Fast New Post Button */}
          <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md ml-auto">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="খবর খুঁজুন... (শিরোনাম বা কিওয়ার্ড)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  মুছুন
                </button>
              )}
            </div>

            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shadow-sm active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন পোস্ট</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenCreatePost}
              className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
              title="নতুন পোস্ট"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Collapse */}
        {isSearchOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 max-w-7xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="খবর খুঁজুন..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* 3. CATEGORY NAVIGATION BAR */}
      <nav className="bg-[#1E293B] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden md:flex items-center gap-1 overflow-x-auto py-0 scrollbar-none text-sm font-semibold">
            <li>
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onGoHome();
                }}
                className={`px-4 py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  currentCategory === 'all'
                    ? 'border-red-600 text-white bg-slate-900/60'
                    : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>প্রচ্ছদ</span>
              </button>
            </li>

            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    currentCategory === cat
                      ? 'border-red-600 text-white bg-slate-900/60'
                      : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}

            <li className="ml-auto">
              <button
                onClick={onOpenBloggerModal}
                className="px-3 py-2 my-1 text-xs font-medium text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Blogger XML কোড</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1 text-sm font-medium">
            <button
              onClick={() => {
                onSelectCategory('all');
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className={`text-left p-2.5 rounded ${
                currentCategory === 'all' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              প্রচ্ছদ
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2.5 rounded ${
                  currentCategory === cat ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenBloggerModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 bg-red-600 text-white p-2.5 rounded font-semibold text-sm"
            >
              <Code2 className="w-4 h-4" />
              <span>ব্লগার থিম HTML কোড দেখুন</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 bg-slate-800 text-slate-200 p-2.5 rounded font-medium text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>অ্যাডমিন ড্যাশবোর্ড</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
