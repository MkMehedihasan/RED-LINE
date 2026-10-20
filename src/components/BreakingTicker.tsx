import React, { useState, useEffect } from 'react';
import { Zap, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface BreakingTickerProps {
  breakingArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  breakingArticles,
  onSelectArticle
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fallback if no breaking news flagged
  const items = breakingArticles.length > 0 ? breakingArticles : [];

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="bg-white border-y border-red-200 shadow-xs mb-6">
      <div className="max-w-7xl mx-auto flex items-center h-11 px-4">
        {/* Breaking Badge */}
        <div className="flex items-center gap-1.5 bg-red-600 text-white font-bold text-xs md:text-sm px-3.5 py-1.5 rounded-sm shrink-0 tracking-wide select-none shadow-xs">
          <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
          <span>ব্রেকিং নিউজ</span>
        </div>

        {/* Ticker Content */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => onSelectArticle(currentItem)}
          className="flex-1 px-3 md:px-4 flex items-center overflow-hidden cursor-pointer group"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
            <p className="text-slate-800 font-semibold text-xs md:text-sm truncate group-hover:text-red-600 transition-colors">
              {currentItem.title}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors hidden sm:block"
            title={isPaused ? 'চালু করুন' : 'থামুন'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="পূর্ববর্তী খবর"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-english text-slate-400 px-1 select-none">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="পরবর্তী খবর"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
