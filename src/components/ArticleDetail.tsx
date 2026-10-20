import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Printer, 
  MessageSquare, 
  Eye, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ThumbsUp, 
  Send,
  Bookmark,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NewsArticle, Comment } from '../types/news';
import { formatNewsTimeAgo, toBengaliNumber } from '../utils/bengaliDate';

interface ArticleDetailProps {
  article: NewsArticle;
  onBack: () => void;
  onAddComment: (articleId: string, author: string, content: string) => void;
  onSelectArticle: (article: NewsArticle) => void;
  relatedArticles: NewsArticle[];
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  onAddComment,
  onSelectArticle,
  relatedArticles
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'medium' | 'large'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFbPromo, setCopiedFbPromo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCommentTab, setActiveCommentTab] = useState<'portal' | 'fb_preview'>('portal');

  // Comment Form state
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Text size classes
  const fontClass = 
    fontSize === 'large' 
      ? 'text-xl leading-relaxed' 
      : fontSize === 'medium' 
      ? 'text-lg leading-relaxed' 
      : 'text-base leading-relaxed';

  // Copy standard URL
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Ready-to-paste text for Facebook comments (as requested in user prompt)
  const handleCopyFacebookPromo = () => {
    const currentUrl = window.location.href;
    const promoText = `📌 ${article.title}\n\n👉 পুরো বিস্তারিত খবরটি পড়তে নিচের লিংকে ক্লিক করুন:\n🔗 ${currentUrl}\n\n#REDLINE #News #Bangladesh`;
    navigator.clipboard.writeText(promoText);
    setCopiedFbPromo(true);
    setTimeout(() => setCopiedFbPromo(false), 2500);
  };

  // Web Speech API Reader (Bengali voice if available, or browser TTS)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে টেক্সট-টু-স্পিচ সমর্থিত নয়।');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullText = `${article.title}। ${article.summary}। ${article.content.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Handle Comment Submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    onAddComment(article.id, commentName.trim(), commentText.trim());
    setCommentName('');
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-4 md:py-6 animate-in fade-in duration-300">
      {/* Back Button & Category Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সব খবর</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>প্রচ্ছদ</span>
          <span>/</span>
          <span className="text-red-600 font-semibold">{article.category}</span>
          <span>/</span>
          <span className="truncate max-w-[180px]">{article.title}</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-[1.3] mb-4">
        {article.title}
      </h1>

      {/* Summary / Kicker */}
      {article.summary && (
        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed mb-6 bg-slate-50 p-4 rounded-lg border-l-4 border-red-600">
          {article.summary}
        </p>
      )}

      {/* Reporter Bylines, Date & Operational Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-200 text-xs sm:text-sm text-slate-600 mb-6 bg-white rounded-md px-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-slate-900">
            <User className="w-4 h-4 text-red-600" />
            <span>{article.reporter}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatNewsTimeAgo(article.publishedAt)}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="flex items-center gap-1 text-slate-500 font-english tabular-nums">
            <Eye className="w-3.5 h-3.5" />
            <span>{toBengaliNumber(article.views)} বার পঠিত</span>
          </div>
        </div>

        {/* Reader Utility Tools */}
        <div className="flex items-center gap-2">
          {/* Text Size Control */}
          <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 ${fontSize === 'normal' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              title="স্বাভাবিক ফন্ট"
            >
              অ
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={`px-2 py-1 ${fontSize === 'medium' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              title="মাঝারি ফন্ট"
            >
              অ+
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 ${fontSize === 'large' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              title="বড় ফন্ট"
            >
              অ++
            </button>
          </div>

          {/* Text-to-Speech Button */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="খবর শুনুন (অডিও)"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-600" />}
            <span className="hidden sm:inline">{isSpeaking ? 'থামুন' : 'শুনুন'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="নিউজপ্রিন্ট / খবরের কাগজ প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Lead Image with Caption */}
      <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-auto max-h-[500px] object-cover"
        />
        {article.imageCaption && (
          <p className="p-3 text-xs sm:text-sm text-slate-600 bg-slate-50 border-t border-slate-200 italic">
            ছবি: {article.imageCaption}
          </p>
        )}
      </div>

      {/* 🚀 FACEBOOK COMMENT PROMOTION HELPER TOOL */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>ফেসবুক কমেন্টে শেয়ার করার দ্রুত টুল</span>
            </h4>
            <p className="text-xs text-blue-700 mt-0.5">
              ফেসবুক পোস্টে বা কমেন্টে ড্রপ করার জন্য প্রস্তুতকৃত লিংক ও শিরোনাম এক ক্লিকে কপি করুন
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyFacebookPromo}
              className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#0c63d4] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              {copiedFbPromo ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFbPromo ? 'কপি হয়েছে!' : 'কমেন্ট ফরম্যাট কপি'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'লিংক কপি হয়েছে' : 'লিংক কপি'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Body Content */}
      <div className={`prose prose-slate max-w-none text-slate-800 space-y-4 mb-8 ${fontClass}`}>
        {article.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-justify">
            {index === 0 ? (
              <>
                <span className="font-bold text-red-600">{article.location} : </span>
                {paragraph}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-t border-slate-200 mb-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ট্যাগসমূহ:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* COMMENTS SECTION */}
      <div className="mt-10 pt-6 border-t-2 border-slate-200 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-slate-900">
              পাঠকদের মন্তব্য ({toBengaliNumber(article.comments?.length || 0)})
            </h3>
          </div>

          {/* Toggle between Web Comments & Blogger/Facebook Comment explanation */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveCommentTab('portal')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeCommentTab === 'portal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              ওয়েব মন্তব্য
            </button>
            <button
              onClick={() => setActiveCommentTab('fb_preview')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeCommentTab === 'fb_preview' ? 'bg-[#1877F2] text-white' : 'text-slate-600'
              }`}
            >
              Blogger / FB কমেন্ট
            </button>
          </div>
        </div>

        {activeCommentTab === 'portal' ? (
          <div>
            {/* New Comment Submission Form */}
            <form onSubmit={handleSubmitComment} className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">আপনার মন্তব্য লিখুন</h4>
              {commentSuccess && (
                <div className="mb-3 p-2 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-200">
                  আপনার মন্তব্যটি সফলভাবে প্রকাশিত হয়েছে!
                </div>
              )}
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                  className="bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <textarea
                  rows={3}
                  placeholder="খবরের বিষয়ে আপনার মতামত লিখুন..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  className="bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>মন্তব্য প্রকাশ করুন</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-4">
              {article.comments && article.comments.length > 0 ? (
                article.comments.map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-800">{comment.author}</span>
                      <span className="text-xs text-slate-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        <span>লাইক ({toBengaliNumber(comment.likes || 0)})</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  এখনো কোনো মন্তব্য নেই। আপনি প্রথম মন্তব্যকারী হন!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Blogger & Facebook Integration Guide */
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold">
              <span>Blogger এবং Facebook কমেন্ট সিস্টেমের সুবিধা:</span>
            </div>
            <p>
              আপনি যখন এই সাইটটি অথবা উপরের ব্লগার থিম কোডটি ব্যবহার করবেন, তখন প্রতিটি খবরের নিচে ব্লগার-এর নিজস্ব কমেন্ট ফর্ম এবং ফেসবুক কমেন্ট প্লাগইন স্বয়ংক্রিয়ভাবে সক্রিয় থাকবে।
            </p>
            <div className="p-3 bg-white rounded border border-slate-200">
              <span className="font-semibold block text-slate-900 mb-1">💡 ফেসবুক কমেন্ট ট্রিক:</span>
              <span>
                আপনি ফেসবুকে যেকোনো স্ট্যাটাস বা পেজের পোস্টে লিখুন: <em>&quot;বিস্তারিত খবর কমেন্টের প্রথম লিংকে&quot;</em>। এরপর কমেন্টে আমাদের &quot;কমেন্ট ফরম্যাট কপি&quot; বোতামটি ব্যবহার করে লিংকটি পেস্ট করে দিন। দর্শকরা সরাসরি এখানে এসে পুরো খবর পড়বেন এবং গুগল অ্যাডসেন্স বা ব্লগার ট্রাফিক বৃদ্ধি পাবে!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RELATED ARTICLES SECTION */}
      {relatedArticles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-red-600 inline-block">
            আরও পড়ুন ({article.category})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectArticle(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden group cursor-pointer hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-red-600 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    {formatNewsTimeAgo(item.publishedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
