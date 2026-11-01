import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Share2, 
  Eye, 
  Sparkles,
  Zap,
  Check,
  Newspaper,
  Film,
  Coins,
  Globe2,
  Trophy,
  Cpu,
  MessageSquare,
  Bookmark
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../types/news';
import { formatNewsTimeAgo, toBengaliNumber } from '../utils/bengaliDate';
import { getNewsShareUrl, copyTextToClipboard } from '../utils/shareUtils';

interface NewsHomeProps {
  articles: NewsArticle[];
  selectedCategory: string;
  onSelectArticle: (article: NewsArticle) => void;
  onSelectCategory: (cat: string) => void;
}

const FEED_FILTERS: { label: string; value: string }[] = [
  { label: 'সব খবর', value: 'all' },
  { label: 'জাতীয়', value: 'জাতীয়' },
  { label: 'রাজনীতি', value: 'রাজনীতি' },
  { label: 'আন্তর্জাতিক', value: 'আন্তর্জাতিক' },
  { label: 'অর্থনীতি', value: 'অর্থনীতি' },
  { label: 'বিনোদন', value: 'বিনোদন' },
  { label: 'খেলাধুলা', value: 'খেলাধুলা' },
  { label: 'তথ্যপ্রযুক্তি', value: 'তথ্যপ্রযুক্তি' },
  { label: 'মতামত', value: 'মতামত' }
];

export const NewsHome: React.FC<NewsHomeProps> = ({
  articles,
  selectedCategory,
  onSelectArticle,
  onSelectCategory
}) => {
  const [sidebarTab, setSidebarTab] = useState<'latest' | 'popular'>('latest');
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  const handleCardShare = async (e: React.MouseEvent, article: NewsArticle) => {
    e.stopPropagation();
    const url = getNewsShareUrl(article.id);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || article.title,
          url
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    const ok = await copyTextToClipboard(url);
    if (ok) {
      setCopiedCardId(article.id);
      setTimeout(() => setCopiedCardId(null), 2500);
    }
  };

  // 1. CATEGORY ARCHIVE VIEW (when user clicks navbar category)
  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  if (selectedCategory !== 'all') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-red-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-600 inline-block"></span>
            <h1 className="text-2xl font-black text-slate-900">{selectedCategory} সংবাদ</h1>
          </div>
          <span className="text-xs text-slate-500 font-medium font-roboto">
            মোট খবর: {toBengaliNumber(filteredArticles.length)}টি
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-base">এই বিভাগে আপাতত কোনো খবর নেই।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col"
              >
                <div className="aspect-video bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isBreaking && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      ব্রেকিং
                    </span>
                  )}
                  {item.isLead && (
                    <span className="absolute top-2 right-2 bg-slate-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      প্রধান সংবাদ
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-red-600 mb-1.5 inline-block">
                      {item.category} · {item.location}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed font-regular">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatNewsTimeAgo(item.publishedAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-roboto tabular-nums flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {toBengaliNumber(item.views)}
                      </span>
                      <button
                        onClick={(e) => handleCardShare(e, item)}
                        className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="শেয়ার বা লিংক কপি করুন"
                      >
                        {copiedCardId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. HOMEPAGE VIEW
  const safeArticles = (articles || []).filter((a): a is NewsArticle => Boolean(a && a.id && a.title));

  if (safeArticles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-lg mx-auto shadow-xs">
          <p className="text-slate-700 font-semibold text-lg mb-2">আপাতত কোনো খবর প্রকাশিত হয়নি</p>
          <p className="text-slate-500 text-sm">অ্যাডমিন প্যানেলে লগইন করে নতুন খবর প্রকাশ করুন।</p>
        </div>
      </div>
    );
  }

  // Lead Story logic: Newest article marked lead, or latest article
  const leadStory = safeArticles.find(a => a.isLead) || safeArticles[0];
  const secondaryLeadStories = safeArticles.filter(a => a.id !== leadStory?.id).slice(0, 2);
  
  // Sorted feeds
  const latestNews = [...safeArticles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const mostPopular = [...safeArticles].sort((a, b) => (b.views || 0) - (a.views || 0));

  // Category specific groupings
  const nationalArticles = safeArticles.filter(a => a.category === 'জাতীয়').slice(0, 4);
  const politicsArticles = safeArticles.filter(a => a.category === 'রাজনীতি').slice(0, 3);
  const internationalArticles = safeArticles.filter(a => a.category === 'আন্তর্জাতিক').slice(0, 3);
  const entertainmentArticles = safeArticles.filter(a => a.category === 'বিনোদন').slice(0, 4);
  const economyArticles = safeArticles.filter(a => a.category === 'অর্থনীতি').slice(0, 3);
  const sportsArticles = safeArticles.filter(a => a.category === 'খেলাধুলা').slice(0, 3);
  const techArticles = safeArticles.filter(a => a.category === 'তথ্যপ্রযুক্তি').slice(0, 3);
  const opinionArticles = safeArticles.filter(a => a.category === 'মতামত').slice(0, 3);

  // Stream articles filtered by stream chip
  const streamArticles = streamFilter === 'all'
    ? latestNews
    : latestNews.filter(a => a.category === streamFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-10">
      
      {/* 1. TOP HERO SECTION: LEAD NEWS + SECONDARY + TABBED SIDEBAR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lead Main Story (7 cols on lg) */}
        {leadStory && (
          <div 
            onClick={() => onSelectArticle(leadStory)}
            className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              <img
                src={leadStory.imageUrl}
                alt={leadStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-sm">
                  প্রধান সংবাদ
                </span>
                {leadStory.isBreaking && (
                  <span className="bg-black/80 text-amber-300 font-bold text-xs px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-300" />
                    ব্রেকিং
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="text-red-600 font-bold">{leadStory.category}</span>
                <span>·</span>
                <span>{leadStory.location}</span>
                <span>·</span>
                <span>{formatNewsTimeAgo(leadStory.publishedAt)}</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 group-hover:text-red-600 leading-snug transition-colors">
                {leadStory.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 line-clamp-3 mt-3 leading-relaxed font-regular">
                {leadStory.summary}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-slate-500 font-medium">প্রতিবেদক: {leadStory.reporter}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleCardShare(e, leadStory)}
                    className="flex items-center gap-1 text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                    title="খবরের লিংক কপি বা শেয়ার করুন"
                  >
                    {copiedCardId === leadStory.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedCardId === leadStory.id ? 'কপি হয়েছে' : 'শেয়ার'}</span>
                  </button>
                  <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    পুরো খবর পড়ুন <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: 2 Secondary Leads & Tabbed Sidebar (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Secondary Leads */}
          <div className="space-y-3.5">
            {secondaryLeadStories.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="bg-white border border-slate-200 rounded-lg p-3.5 flex gap-3.5 hover:border-red-400 hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="w-28 sm:w-32 aspect-4/3 shrink-0 rounded-md overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-red-600">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 line-clamp-2 leading-snug mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    {formatNewsTimeAgo(item.publishedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Tab: সর্বশেষ সংবাদ vs সর্বাধিক পঠিত */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => setSidebarTab('latest')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                  sidebarTab === 'latest'
                    ? 'border-red-600 text-red-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>সর্বশেষ সংবাদ</span>
              </button>
              <button
                onClick={() => setSidebarTab('popular')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                  sidebarTab === 'popular'
                    ? 'border-red-600 text-red-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>সর্বাধিক পঠিত</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 p-2 max-h-[380px] overflow-y-auto">
              {(sidebarTab === 'latest' ? latestNews : mostPopular).slice(0, 8).map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="p-2 flex items-start gap-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors"
                >
                  <span className="font-roboto font-bold text-base text-slate-400 group-hover:text-red-600 w-5 text-center shrink-0 mt-0.5">
                    {toBengaliNumber(idx + 1)}
                  </span>
                  <div className="w-14 h-10 rounded overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-red-600 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="text-red-600 font-medium">{item.category}</span>
                      <span>·</span>
                      <span>{formatNewsTimeAgo(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 🌟 COMPREHENSIVE LATEST NEWS STREAM (সকল প্রকাশিত সংবাদের লাইভ স্ট্রিম) */}
      {/* This ensures NO POST EVER GETS LOST regardless of category or lead status! */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-red-600">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 bg-red-600 inline-block rounded-xs"></span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">সর্বশেষ প্রকাশিত সংবাদ</h2>
              <p className="text-xs text-slate-500 mt-0.5">সবগুলো ক্যাটাগরির সাম্প্রতিক খবর ও প্রতিবেদন</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto font-roboto">
            মোট খবর: {toBengaliNumber(streamArticles.length)}টি
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
          {FEED_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStreamFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                streamFilter === f.value
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {streamArticles.slice(0, 12).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectArticle(item)}
              className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-red-400 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {item.category}
                    </span>
                    {item.isBreaking && (
                      <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        ব্রেকিং
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-600 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-regular">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 mt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatNewsTimeAgo(item.publishedAt)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-roboto tabular-nums flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {toBengaliNumber(item.views)}
                  </span>
                  <button
                    onClick={(e) => handleCardShare(e, item)}
                    className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="শেয়ার বা লিংক কপি করুন"
                  >
                    {copiedCardId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NATIONAL NEWS SECTION (জাতীয়) */}
      {nationalArticles.length > 0 && (
        <section className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-red-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-5 bg-red-600 inline-block"></span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">জাতীয় সংবাদ</h2>
            </div>
            <button
              onClick={() => onSelectCategory('জাতীয়')}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nationalArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-red-600 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  {formatNewsTimeAgo(item.publishedAt)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 🎭 ENTERTAINMENT & LIFESTYLE (বিনোদন ও সংস্কৃতি) */}
      {entertainmentArticles.length > 0 && (
        <section className="bg-gradient-to-r from-purple-900/5 via-pink-900/5 to-red-900/5 p-5 sm:p-6 rounded-2xl border border-purple-200/60 bg-white">
          <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-purple-600">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">বিনোদন ও সংস্কৃতি</h2>
            </div>
            <button
              onClick={() => onSelectCategory('বিনোদন')}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              আরও বিনোদন <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {entertainmentArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-xs transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-700 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 font-regular">
                    {item.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <span>{formatNewsTimeAgo(item.publishedAt)}</span>
                  <span className="font-roboto flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {toBengaliNumber(item.views)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. TWO COLUMNS: POLITICS (রাজনীতি) & INTERNATIONAL (আন্তর্জাতিক) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Politics */}
        {politicsArticles.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-5 bg-slate-900 inline-block"></span>
                <h2 className="text-lg font-bold text-slate-900">রাজনীতি</h2>
              </div>
              <button
                onClick={() => onSelectCategory('রাজনীতি')}
                className="text-xs font-bold text-slate-700 hover:text-red-600 flex items-center gap-1"
              >
                আরও <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {politicsArticles.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className={`group cursor-pointer ${i !== 0 ? 'pt-3 border-t border-slate-100' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="w-24 aspect-video rounded overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatNewsTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* International */}
        {internationalArticles.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-red-600">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-slate-900">আন্তর্জাতিক</h2>
              </div>
              <button
                onClick={() => onSelectCategory('আন্তর্জাতিক')}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                আরও <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {internationalArticles.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className={`group cursor-pointer ${i !== 0 ? 'pt-3 border-t border-slate-100' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="w-24 aspect-video rounded overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatNewsTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. 💰 ECONOMY & OPINION (অর্থনীতি ও মতামত) */}
      {(economyArticles.length > 0 || opinionArticles.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Economy */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-emerald-600">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">অর্থনীতি ও বাণিজ্য</h2>
              </div>
              <button
                onClick={() => onSelectCategory('অর্থনীতি')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                সব খবর <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {economyArticles.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className={`group cursor-pointer ${i !== 0 ? 'pt-3 border-t border-slate-100' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="w-24 aspect-video rounded overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatNewsTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opinion & Special */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-amber-600">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">মতামত ও সম্পাদকীয়</h2>
              </div>
              <button
                onClick={() => onSelectCategory('মতামত')}
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
              >
                আরও <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {opinionArticles.length > 0 ? (
                opinionArticles.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectArticle(item)}
                    className={`group cursor-pointer ${i !== 0 ? 'pt-3 border-t border-slate-100' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-24 aspect-video rounded overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          কলামিস্ট: {item.reporter}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  শীঘ্রই মতামত ও সম্পাদকীয় কলাম যুক্ত হচ্ছে।
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. SPORTS & TECH SPOTLIGHT */}
      <section className="bg-slate-900 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-5 bg-red-600 inline-block rounded-xs"></span>
            <h2 className="text-xl font-black text-white">খেলাধুলা ও প্রযুক্তি বিশেষ</h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">রেড লাইন এক্সক্লুসিভ কাভারেজ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...sportsArticles, ...techArticles].slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectArticle(item)}
              className="bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/60 group cursor-pointer hover:border-red-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-red-400 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed font-regular">
                    {item.summary}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 text-[11px] text-slate-500">
                {formatNewsTimeAgo(item.publishedAt)}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
