import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  Zap, 
  Check, 
  RotateCcw,
  Copy,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  LogOut,
  AlertCircle,
  EyeOff,
  UserCheck,
  Settings,
  Facebook,
  Send,
  ExternalLink
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../types/news';
import { toBengaliNumber } from '../utils/bengaliDate';
import { 
  getFacebookPromoSnippet, 
  getNewsShareUrl, 
  getFacebookShareUrl, 
  getWhatsAppShareUrl, 
  copyTextToClipboard 
} from '../utils/shareUtils';

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

const SAMPLE_IMAGE_PRESETS = [
  { name: 'প্রেস কনফারেন্স / জাতীয়', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80' },
  { name: 'স্টুডিও সম্প্রচার / মিডিয়া', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80' },
  { name: 'ক্রিকেট / খেলাধুলা', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80' },
  { name: 'অর্থনীতি ও ব্যবসা', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80' },
  { name: 'প্রযুক্তি ও এআই', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { name: 'আন্তর্জাতিক কূটনীতি', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80' }
];

const ADMIN_CREDS_KEY = 'redline_admin_credentials_v1';
const ADMIN_SESSION_KEY = 'redline_admin_session_v1';

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
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  });

  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tabs for authenticated view: 'create' | 'list' | 'security'
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'security'>('create');
  
  // Post Form fields
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

  // Security Credentials settings form
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const [copiedLinkPostId, setCopiedLinkPostId] = useState<string | null>(null);
  const [copiedDirectUrlPostId, setCopiedDirectUrlPostId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Load or initialize Admin Credentials
  const getStoredCreds = () => {
    try {
      const stored = localStorage.getItem(ADMIN_CREDS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default initial credentials
    return {
      username: 'admin',
      password: 'redline2026'
    };
  };

  if (!isOpen) return null;

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const creds = getStoredCreds();
    if (
      inputUsername.trim().toLowerCase() === creds.username.toLowerCase() &&
      inputPassword === creds.password
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      setInputUsername('');
      setInputPassword('');
      showNotify('সফলভাবে অ্যাডমিন প্যানেলে লগইন হয়েছে!');
    } else {
      setLoginError('ভুল ইউজার আইডি অথবা পাসওয়ার্ড! পুনরায় সঠিক তথ্য দিন।');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    showNotify('লগআউট সফল হয়েছে।');
  };

  // Change Password / Username handler
  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    const creds = getStoredCreds();
    if (currentPassInput !== creds.password) {
      setSecurityMessage({ text: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!', isError: true });
      return;
    }

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setSecurityMessage({ text: 'নতুন পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে!', isError: true });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setSecurityMessage({ text: 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!', isError: true });
      return;
    }

    const updatedCreds = {
      username: newUsernameInput.trim() || creds.username,
      password: newPasswordInput
    };

    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updatedCreds));
    setCurrentPassInput('');
    setNewUsernameInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setSecurityMessage({ text: 'আপনার ইউজার আইডি ও পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! পরবর্তী লগইনে এটি প্রযোজ্য হবে।', isError: false });
    showNotify('লগইন তথ্য সফলভাবে আপডেট হয়েছে!');
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

  const handleSubmitPost = (e: React.FormEvent) => {
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
          imageCaption: imageCaption.trim() || '',
          summary: summary.trim() || title.trim(),
          content: paragraphs,
          reporter: reporter.trim() || 'রেড লাইন ডেস্ক',
          location: location.trim() || 'ঢাকা',
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
        imageCaption: imageCaption.trim() || '',
        reporter: reporter.trim() || 'রেড লাইন ডেস্ক',
        location: location.trim() || 'ঢাকা',
        publishedAt: new Date().toISOString(),
        readTimeMinutes: Math.max(1, Math.round(contentRaw.length / 500)),
        isBreaking,
        isLead,
        tags
      });
      showNotify('নতুন খবর সফলভাবে প্রকাশিত এবং পাবলিক হয়েছে!');
    }

    handleResetForm();
    setActiveTab('list');
  };

  const handleCopyFbCommentText = async (post: NewsArticle) => {
    const text = getFacebookPromoSnippet(post.title, post.id);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedLinkPostId(post.id);
      setTimeout(() => setCopiedLinkPostId(null), 2500);
      showNotify('ফেসবুক কমেন্ট টেক্সট কপি হয়েছে!');
    }
  };

  const handleCopyDirectUrl = async (post: NewsArticle) => {
    const url = getNewsShareUrl(post.id);
    const ok = await copyTextToClipboard(url);
    if (ok) {
      setCopiedDirectUrlPostId(post.id);
      setTimeout(() => setCopiedDirectUrlPostId(null), 2500);
      showNotify('খবরের সরাসরি লিংক কপি হয়েছে!');
    }
  };

  const handleOpenFacebookShare = (post: NewsArticle) => {
    const url = getFacebookShareUrl(post.id);
    window.open(url, '_blank', 'width=600,height=500,noopener,noreferrer');
  };

  const handleOpenWhatsAppShare = (post: NewsArticle) => {
    const url = getWhatsAppShareUrl(post.id, post.title);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const currentCreds = getStoredCreds();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="bg-[#0B1120] text-white px-6 py-4 flex items-center justify-between border-b border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-english font-black text-white text-xs ring-2 ring-red-400">
              RL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">RED LINE গোপনীয় অ্যাডমিন প্যানেল</h2>
                {isAuthenticated ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    লগইন আছেন
                  </span>
                ) : (
                  <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    লক করা
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">শুধুমাত্র প্রধান অ্যাডমিনের জন্য সুরক্ষিত কন্ট্রোল রুম</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-red-600 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                title="অ্যাডমিন থেকে লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification toast */}
        {notification && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* 🔒 IF NOT AUTHENTICATED: SHOW SECURE LOGIN CARD */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 flex items-center justify-center flex-1 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-100 shadow-inner">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900">অ্যাডমিন প্রমাণীকরণ</h3>
                <p className="text-xs text-slate-500 mt-1">
                  এই প্যানেলটি সাধারণ দর্শকদের জন্য নয়। প্রবেশ করতে ইউজার আইডি ও পাসওয়ার্ড লিখুন।
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ইউজার আইডি (User ID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: admin"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পাসওয়ার্ড (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="আপনার গোপন পাসওয়ার্ড"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      title={showPassword ? 'লুকান' : 'দেখান'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </button>
              </form>

              {/* Private Security Notice without showing credentials */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400">
                  🔒 এটি একটি সম্পূর্ণ সুরক্ষিত এলাকা। শুধুমাত্র প্রধান অ্যাডমিন সঠিক আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করতে পারবেন।
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* 🔓 AUTHENTICATED ADMIN AREA */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-slate-100 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 shrink-0">
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

                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'security'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>পাসওয়ার্ড পরিবর্তন (Security)</span>
                </button>
              </div>

              {confirmReset ? (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                  <span className="text-[11px] text-amber-800">নমুনা ডেটা ফিরিয়ে আনবেন?</span>
                  <button
                    onClick={() => {
                      onResetToDefault();
                      setConfirmReset(false);
                      showNotify('ডিফল্ট নমুনা সংবাদ রিস্টোর করা হয়েছে!');
                    }}
                    className="text-[11px] bg-red-600 text-white px-2 py-0.5 rounded font-bold hover:bg-red-700"
                  >
                    হ্যাঁ
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="text-[11px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-300"
                  >
                    না
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium"
                  title="নমুনা সংবাদ রিসেট করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">নমুনা ডেটা রিসেট</span>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'create' && (
                /* TAB 1: CREATE / EDIT NEWS POST */
                <form onSubmit={handleSubmitPost} className="space-y-4">
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
                      <span className="font-semibold text-slate-600">বা এক ক্লিকে ছবি নির্বাচন করুন:</span>
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
                      সংক্ষিপ্ত সারসংক্ষেপ (Summary / Facebook Teaser)
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
              )}

              {activeTab === 'list' && (
                /* TAB 2: POST LIST & DELETE/EDIT */
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
                    {[...articles]
                      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                      .map((item, idx) => (
                      <div key={item.id} className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${idx === 0 ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'}`}>
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

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {/* Direct Link Copy */}
                          <button
                            onClick={() => handleCopyDirectUrl(item)}
                            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            title="খবরের সরাসরি লিংক কপি করুন"
                          >
                            {copiedDirectUrlPostId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="hidden lg:inline">
                              {copiedDirectUrlPostId === item.id ? 'কপি হয়েছে' : 'লিংক'}
                            </span>
                          </button>

                          {/* Facebook Share */}
                          <button
                            onClick={() => handleOpenFacebookShare(item)}
                            className="p-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-colors"
                            title="ফেসবুকে শেয়ার করুন"
                          >
                            <Facebook className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* WhatsApp Share */}
                          <button
                            onClick={() => handleOpenWhatsAppShare(item)}
                            className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                            title="হোয়াটসঅ্যাপে পাঠান"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* FB Promo Copy */}
                          <button
                            onClick={() => handleCopyFbCommentText(item)}
                            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            title="ফেসবুক কমেন্টের জন্য টেক্সট ও লিংক কপি করুন"
                          >
                            {copiedLinkPostId === item.id ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">
                              {copiedLinkPostId === item.id ? 'কপি হয়েছে' : 'FB কমেন্ট'}
                            </span>
                          </button>

                          {/* View */}
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

                          {/* Delete with inline confirmation */}
                          {confirmDeleteId === item.id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-md border border-red-200">
                              <span className="text-[10px] text-red-700 font-bold px-1">মুছবেন?</span>
                              <button
                                onClick={() => {
                                  onDeleteArticle(item.id);
                                  setConfirmDeleteId(null);
                                  showNotify('সংবাদটি স্থায়ীভাবে মুছে ফেলা হয়েছে।');
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white text-[11px] px-2 py-0.5 rounded font-bold transition-colors"
                              >
                                হ্যাঁ
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] px-1.5 py-0.5 rounded transition-colors"
                              >
                                না
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                /* TAB 3: CHANGE USER ID & PASSWORD (SECURITY) */
                <div className="max-w-lg mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">অ্যাডমিন আইডি ও পাসওয়ার্ড পরিবর্তন</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      আপনার নিজস্ব গোপন ইউজার আইডি এবং নতুন পাসওয়ার্ড সেট করে রাখুন যাতে অন্য কেউ প্রবেশ করতে না পারে।
                    </p>
                  </div>

                  {securityMessage && (
                    <div
                      className={`mb-4 p-3 rounded-lg text-xs font-semibold ${
                        securityMessage.isError
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {securityMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleChangeCredentials} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বর্তমান পাসওয়ার্ড (Current Password) *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="আপনার বর্তমান পাসওয়ার্ড লিখুন"
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        নতুন ইউজার আইডি (New User ID)
                      </label>
                      <input
                        type="text"
                        placeholder={`বর্তমান: ${currentCreds.username}`}
                        value={newUsernameInput}
                        onChange={(e) => setNewUsernameInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <span className="text-[10px] text-slate-400">খালি রাখলে আগের ইউজার আইডিটি বহাল থাকবে।</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        নতুন পাসওয়ার্ড (New Password) *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="কমপক্ষে ৪ অক্ষরের নতুন শক্তিশালী পাসওয়ার্ড"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>তথ্য সংরক্ষণ করুন</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
