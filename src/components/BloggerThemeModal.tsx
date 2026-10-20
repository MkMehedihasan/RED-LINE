import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { generateBloggerThemeCode } from '../utils/bloggerThemeTemplate';

interface BloggerThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloggerThemeModal: React.FC<BloggerThemeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'instructions'>('code');

  if (!isOpen) return null;

  const themeCode = generateBloggerThemeCode({
    blogTitle: 'RED LINE News Portal',
    logoUrl: '/assets/aistudio/image_5c563c18.png'
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(themeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([themeCode], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RED_LINE_Blogger_Theme.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-red-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>Google Blogger (Blogspot) থিম HTML/XML কোড</span>
                <span className="text-xs bg-red-600/30 text-red-400 border border-red-600/50 px-2 py-0.5 rounded-full font-english">
                  RED LINE v1.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Blogger.com-এ হুবহু সময় টিভির মতো নিউজ পোর্টাল ও কমেন্ট সিস্টেম চালুর জন্য সম্পূর্ণ কোড
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar & Action Buttons */}
        <div className="bg-slate-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'code'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              XML কোড ভিউয়ার
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'instructions'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>কিভাবে ব্লগারে ইনস্টল করবেন? (গাইড)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাউনলোড XML</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কোড কপি হয়েছে!' : 'সম্পূর্ণ কোড কপি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {activeTab === 'code' ? (
            <div>
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  এই কোডটি সরাসরি Blogger &gt; Theme &gt; Edit HTML-এ পেস্ট করার জন্য প্রস্তুত।
                </span>
                <span className="font-english tabular-nums">সাইজ: ~{Math.round(themeCode.length / 1024)} KB</span>
              </div>

              <div className="relative bg-[#0F172A] rounded-xl p-4 overflow-hidden border border-slate-700 shadow-inner">
                <pre className="text-xs text-emerald-400 font-mono overflow-x-auto max-h-[460px] whitespace-pre leading-relaxed scrollbar-thin">
                  <code>{themeCode}</code>
                </pre>
              </div>
            </div>
          ) : (
            /* STEP BY STEP BLOGGER SETUP GUIDE */
            <div className="space-y-6 text-slate-800">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="font-bold text-red-900 text-base mb-1">
                  💡 ব্লগারে এই থিমটি যুক্ত করার সহজ ৩টি ধাপ:
                </h3>
                <p className="text-xs text-red-700">
                  নিচে দেওয়া ধাপগুলো অনুসরণ করলে আপনার Blogger.com সাইটটি হুবহু RED LINE নিউজ পেপারের মতো হয়ে যাবে।
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    ১
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Blogger.com-এ লগইন করে Theme অপশনে যান
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      প্রথমে আপনার ব্রাউজারে <a href="https://blogger.com" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">Blogger.com</a> খুলুন এবং আপনার ব্লগে যান। বাম পাশের মেনু থেকে <strong>&apos;Theme&apos;</strong> এ ক্লিক করুন।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    ২
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Edit HTML নির্বাচন করুন
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      &apos;Customize&apos; বোতামের পাশে থাকা ছোট তীরচিহ্ন (ড্রপডাউন) বাটনে ক্লিক করুন। সেখান থেকে <strong>&apos;Edit HTML&apos;</strong> বেছে নিন।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    ৩
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      কোড পেস্ট করে Save দিন
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      ব্লগারের কোড বক্সে যা কিছু আছে সব সিলেক্ট করে (Ctrl + A) মুছে দিন। এরপর এখান থেকে <strong>&apos;সম্পূর্ণ কোড কপি করুন&apos;</strong> বাটনে চাপ দিয়ে কপি করা কোডটি সেখানে পেস্ট (Ctrl + V) করুন এবং ওপরের ডানদিকের <strong>&apos;Save&apos;</strong> আইকনে ক্লিক করুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                <h5 className="font-bold text-slate-900 text-sm">✨ এতে কি কি স্বয়ংক্রিয়ভাবে কাজ করবে?</h5>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li><strong>লাইভ তারিখ ও সময়:</strong> ঢাকা সময় ও বাংলা ক্যালেন্ডার স্বয়ংক্রিয়ভাবে টপ বারে টিক করবে।</li>
                  <li><strong>ব্রেকিং নিউজ সেকশন:</strong> আপনার সাইটের উপরে লাল রঙের স্ক্রোলিং ব্রেকিং নিউজ থাকবে।</li>
                  <li><strong>নিউজ কার্ড ও ছবি:</strong> নতুন পোস্ট করলেই প্রথম ছবিটি থাম্বনেইল হিসেবে চমৎকার কার্ডে দেখাবে।</li>
                  <li><strong>Blogger কমেন্ট সিস্টেম:</strong> প্রতিটি নিউজে পাঠকরা সরাসরি মন্তব্য করতে পারবে।</li>
                  <li><strong>ফেসবুক কমেন্ট শেয়ার:</strong> ফেসবুক কমেন্টে শুধু পোস্টের লিংক ড্রপ করলেই ভিজিটররা এখানে এসে পুরো খবর পড়বে।</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
