/**
 * Bengali Calendar and Time formatting utilities
 */

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

const bengaliDays = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

const bengaliMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export interface LiveBengaliDateTime {
  dayName: string;
  dateStr: string;
  timeStr: string;
  banglaEraDate: string;
  fullHeaderStr: string;
}

export function getBengaliDateTime(date: Date = new Date()): LiveBengaliDateTime {
  const dayName = bengaliDays[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const month = bengaliMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'সন্ধ্যা/রাত' : hours >= 5 ? 'সকাল' : hours >= 12 ? 'দুপুর' : 'রাত';
  
  const displayHours = hours % 12 || 12;
  const timeStr = `${ampm} ${toBengaliNumber(displayHours)}:${toBengaliNumber(minutes < 10 ? '0' + minutes : minutes)}:${toBengaliNumber(seconds < 10 ? '0' + seconds : seconds)}`;

  // Approximate Bangla calendar (১৪৩১/১৪৩২ বঙ্গাব্দ)
  const banglaYear = toBengaliNumber(date.getFullYear() - 593);
  const banglaEraDate = `${day} কার্তিক ${banglaYear} বঙ্গাব্দ`;

  const dateStr = `${dayName}, ${day} ${month} ${year}`;
  const fullHeaderStr = `ঢাকা · ${dateStr} · ${banglaEraDate} · আপডেট ${toBengaliNumber(displayHours)}:${toBengaliNumber(minutes < 10 ? '0' + minutes : minutes)}`;

  return {
    dayName,
    dateStr,
    timeStr,
    banglaEraDate,
    fullHeaderStr,
  };
}

export function formatNewsTimeAgo(publishedAt: string): string {
  try {
    const published = new Date(publishedAt).getTime();
    const now = new Date().getTime();
    const diffSec = Math.floor((now - published) / 1000);

    if (diffSec < 60) {
      return 'এইমাত্র';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${toBengaliNumber(diffMin)} মিনিট আগে`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return `${toBengaliNumber(diffHours)} ঘণ্টা আগে`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays <= 7) {
      return `${toBengaliNumber(diffDays)} দিন আগে`;
    }
    const date = new Date(publishedAt);
    return `${toBengaliNumber(date.getDate())} ${bengaliMonths[date.getMonth()]} ${toBengaliNumber(date.getFullYear())}`;
  } catch {
    return publishedAt;
  }
}
