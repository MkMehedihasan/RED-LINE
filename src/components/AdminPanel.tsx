import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Save, 
  ExternalLink, 
  Share2, 
  Eye, 
  Zap, 
  Check, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Copy
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../types/news';
import { toBengaliNumber } from '../utils/bengaliDate';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  onAddArticle: (article: Omit<NewsArticle, 'id' | 'views' | 'comments'>) => void;
  onDeleteArticle: (id: string) => void;
  onUpdateArticle: (article: NewsArticle) => void;
  onResetToDefault: () => void;
  onViewArticle: (article: NewsArticle) => void;
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

// Preset news photography URLs for easy selection
const SAMPLE_IMAGE_PRESETS = [
  { name: 'প্রেস কনফারেন্স / জাতীয়', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80' },
  { name: 'স্টুডিও সম্প্রচার / মিডিয়া', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80' },
  { name: 'ক্রিকেট / খেলাধুলা', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80' },
  { name: 'অর্থনীতি ও ব্যবসা', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80' },
  { name: 'প্রযুক্তি ও এআই', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { name: 'আন্তর্জাতিক কূটনীতি', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80' }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
  onDeleteArticle,
  onUpdateArticle,
  onResetToDefault,
  onViewArticle
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  
  // Form fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('জাতীয়');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [summary, setSummary] = useState('');
  const [contentRaw, setContentRaw] = useState('');
  const [reporter, setReporter] = useState('স্টাফ রিপোর্টার');
  const [location, setLocation] = useState('ঢাকা');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [tagsStr, setTagsStr] = useState('জাতীয়, রেড লাইন');

  const [notification, setNotification] = useState<string | null>(null);
  const [copiedLinkPostId, setCopiedLinkPostId] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditClick = (article: NewsArticle) => {
    setEditingId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setImageUrl(article.imageUrl);
    setImageCaption(article.imageCaption || '');
    setSummary(article.summary);
    setContentRaw(article.content.join('\n\n'));
    setReporter(article.reporter);
    setLocation(article.location);
    setIsBreaking(!!article.isBreaking);
    setIsLead(!!article.isLead);
    setTagsStr(article.tags?.join(', ') || '');
    setActiveTab('create');
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('জাতীয়');
    setImageUrl('');
    setImageCaption('');
    setSummary('');
    setContentRaw('');
    setReporter('স্টাফ রিপোর্টার');
    setLocation('ঢাকা');
    setIsBreaking(false);
    setIsLead(false);
    setTagsStr('জাতীয়, রেড লাইন');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentRaw.trim()) {
      showNotify('অনুগ্রহ করে শিরোনাম এবং বিস্তারিত খবর লিখুন।');
      return;
    }

    const paragraphs = contentRaw
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const finalImage = imageUrl.trim() || SAMPLE_IMAGE_PRESETS[0].url;

    if (editingId) {
      const existing = articles.find(a => a.id === editingId);
      if (existing) {
        onUpdateArticle({
          ...existing,
          title: title.trim(),
          category,
          imageUrl: finalImage,
          imageCaption: imageCaption.trim() || undefined,
          summary: summary.trim(),
          content: paragraphs,
          reporter: reporter.trim(),
          location: location.trim(),
          isBreaking,
          isLead,
          tags
        });
        showNotify('খবরটি সফলভাবে আপডেট করা হয়েছে!');
      }
    } else {
      onAddArticle({
        title: title.trim(),
        slug: title.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 50),
        category,
        summary: summary.trim() || title.trim(),
        content: paragraphs,
        imageUrl: finalImage,
        imageCaption: imageCaption.trim() || undefined,
        reporter: reporter.trim() || 'রেড লাইন ডেস্ক',
        location: location.trim() || 'ঢাকা',
        publishedAt: new Date().toISOString(),
        readTimeMinutes: Math.max(1, Math.round(contentRaw.length / 500)),
        isBreaking,
        isLead,
        tags
      });
      showNotify('নতুন খবর সফলভাবে প্রকাশিত হয়েছে!');
    }

    handleResetForm();
    setActiveTab('list');
  };

  const handleCopyFbCommentText = (post: NewsArticle) => {
    const currentUrl = window.location.origin;
    const text = `📌 ${post.title}\n\n👉 পুরো বিস্তারিত খবরটি পড়তে নিচের লিংকে ক্লিক করুন:\n🔗 ${currentUrl}#post-${post.id}\n\n#REDLINE #News`;
    navigator.clipboard.writeText(text);
    setCopiedLinkPostId(post.id);
    setTimeout(() => setCopiedLinkPostId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-english font-black text-white text-xs">
              RL
            </div>
            <div>
              <h2 className="text-lg font-bold">RED LINE অ্যাডমিন ড্যাশবোর্ড</h2>
              <p className="text-xs text-slate-400">নিউজ পাবলিশিং, ডিলিট এবং ফেসবুক কমেন্ট লিংক জেনারেটর</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar & Alerts */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{editingId ? 'পোস্ট সম্পাদনা' : 'নতুন পোস্ট তৈরি'}</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>সকল পোস্ট তালিকা ({toBengaliNumber(articles.length)})</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm('আপনি কি ডিফল্ট সংবাদসমূহ পুনরায় লোড করতে চান?')) {
                onResetToDefault();
                showNotify('ডিফল্ট সংবাদ রিস্টোর করা হয়েছে!');
              }
            }}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium"
            title="নমুনা সংবাদ রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">নমুনা ডেটা রিসেট</span>
          </button>
        </div>

        {notification && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'create' ? (
            /* CREATE / EDIT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    খবরের শিরোনাম (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="আকর্ষণীয় শিরোনাম লিখুন..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাটাগরি (Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL & Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ফিচার্ড ছবির লিংক (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://... ছবির ওয়েব লিংক দিন"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 mb-2"
                />

                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">বা দ্রুত ছবি বাছুন:</span>
                  {SAMPLE_IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded border border-slate-200 transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ছবির ক্যাপশন (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="ছবি সম্পর্কে এক লাইন..."
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      রিপোর্টার
                    </label>
                    <input
                      type="text"
                      value={reporter}
                      onChange={(e) => setReporter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      স্থান
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ (Summary / Lead Teaser)
                </label>
                <textarea
                  rows={2}
                  placeholder="খবরের মূল কথা বা প্রথম ১-২ লাইন যা ফেসবুকে বা লিড বক্সে দেখাবে..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সম্পূর্ণ সংবাদ (Full Story Content) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="এখানে সম্পূর্ণ প্রতিবেদন বা খবরটি বিস্তারিত লিখুন। প্রতিটি প্যারার মাঝে এন্টার (Enter) চাপুন..."
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              {/* Toggles: Breaking & Lead */}
              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-red-600" />
                    ব্রেকিং নিউজ হিসেবে টিকার-এ দেখান
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isLead}
                    onChange={(e) => setIsLead(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    প্রধান সংবাদ (Lead Story) হিসেবে সেট করুন
                  </span>
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  placeholder="জাতীয়, ঢাকা, ব্রেকিং"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    বাতিল করুন
                  </button>
                )}
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'আপডেট সংরক্ষণ করুন' : 'খবরটি প্রকাশ করুন'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* POST LIST & MANAGEMENT */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-600">
                  মোট প্রকাশিত পোস্ট: {toBengaliNumber(articles.length)}টি
                </span>
                <span className="text-xs text-slate-400">
                  নিউজ ডিলিট ও ফেসবুক কমেন্ট শেয়ার সুবিধা
                </span>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {articles.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-16 h-12 rounded overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          {item.isBreaking && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              ব্রেকিং
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            পঠিত: {toBengaliNumber(item.views)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Copy FB Comment Promo */}
                      <button
                        onClick={() => handleCopyFbCommentText(item)}
                        className="flex items-center gap-1 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        title="ফেসবুক কমেন্টের জন্য টেক্সট ও লিংক কপি করুন"
                      >
                        {copiedLinkPostId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">
                          {copiedLinkPostId === item.id ? 'কপি হয়েছে' : 'FB কমেন্ট ফরম্যাট'}
                        </span>
                      </button>

                      {/* View Post */}
                      <button
                        onClick={() => {
                          onViewArticle(item);
                          onClose();
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        title="খবরটি দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="সম্পাদনা করুন"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${item.title}" সংবাদটি নিশ্চিত মুছে ফেলতে চান?`)) {
                            onDeleteArticle(item.id);
                            showNotify('সংবাদটি মুছে ফেলা হয়েছে।');
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
