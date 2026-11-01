import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Youtube, 
  Twitter, 
  ShieldCheck,
  Globe,
  Lock
} from 'lucide-react';
import { toBengaliNumber } from '../utils/bengaliDate';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenBloggerModal?: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#0B1120] text-slate-300 pt-12 pb-8 border-t-4 border-red-600 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_5c563c18.png"
                alt="RED LINE Logo"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-red-600"
              />
              <div>
                <div className="flex items-center gap-1 font-english font-black text-2xl tracking-tight text-white">
                  <span className="text-red-500">RED</span>
                  <span>LINE</span>
                </div>
                <p className="text-[11px] text-slate-400">সত্যের সন্ধানে নির্ভীক নিউজ পোর্টাল</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              রেড লাইন—বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ পরিবেশনে বদ্ধপরিকর। দেশ ও বিদেশের সর্বশেষ ব্রেকিং নিউজ, রাজনীতি, অর্থনীতি ও খেলাধুলার তথ্যনির্ভর খবর সবার আগে পৌঁছে দিতে আমরা দায়বদ্ধ।
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1DA1F2] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-red-600/60 pb-1 inline-block">
              বিভাগসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              {['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'অর্থনীতি', 'খেলাধুলা', 'তথ্যপ্রযুক্তি', 'বিনোদন'].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      onSelectCategory(c);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-400 transition-colors"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Editorial & Management */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-red-600/60 pb-1 inline-block">
              সম্পাদকীয় ও ব্যবস্থাপনা
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>
                <strong className="text-slate-200 block">প্রধান সম্পাদক ও প্রকাশক:</strong>
                রেড লাইন মিডিয়া পাবলিকেশনস
              </p>
              <p>
                <strong className="text-slate-200 block">বার্তা সম্পাদক:</strong>
                অনলাইন নিউজ ডেস্ক
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>কাওরান বাজার, ঢাকা-১২১৫, বাংলাদেশ</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>news@redline.com.bd</span>
              </p>
            </div>
          </div>

          {/* Col 4: Special Notice & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-red-600/60 pb-1 inline-block">
              বিজ্ঞাপন ও বার্তা
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ২৪ ঘণ্টা বস্তুনিষ্ঠ খবর ও তথ্যের জন্য আমাদের সাথেই থাকুন। সংবাদ বা মতামত পাঠাতে আমাদের বার্তা কক্ষে যোগাযোগ করুন।
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2.5 px-3 rounded-lg border border-slate-700 transition-colors shadow-xs"
                title="গোপনীয় অ্যাডমিন লগইন (আইডি ও পাসওয়ার্ড সুরক্ষিত)"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>গোপনীয় অ্যাডমিন লগইন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© {toBengaliNumber(new Date().getFullYear())} RED LINE · সর্বস্বত্ব সংরক্ষিত।</p>
          <p>
            সত্যের সন্ধানে নির্ভীক · অনলাইন নিউজ মিডিয়া প্ল্যাটফর্ম
          </p>
        </div>
      </div>
    </footer>
  );
};
