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
  const dayNum = date.getDate();
  const day = toBengaliNumber(dayNum < 10 ? '0' + dayNum : dayNum);
  const month = bengaliMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Accurate Bengali time of day
  let ampm = 'রাত';
  if (hours >= 4 && hours < 6) {
    ampm = 'ভোর';
  } else if (hours >= 6 && hours < 12) {
    ampm = 'সকাল';
  } else if (hours >= 12 && hours < 15) {
    ampm = 'দুপুর';
  } else if (hours >= 15 && hours < 18) {
    ampm = 'বিকাল';
  } else if (hours >= 18 && hours < 20) {
    ampm = 'সন্ধ্যা';
  } else {
    ampm = 'রাত';
  }
  
  const displayHours = hours % 12 || 12;
  const hourStr = toBengaliNumber(displayHours < 10 ? '0' + displayHours : displayHours);
  const minStr = toBengaliNumber(minutes < 10 ? '0' + minutes : minutes);
  const secStr = toBengaliNumber(seconds < 10 ? '0' + seconds : seconds);
  const timeStr = `${ampm} ${hourStr}:${minStr}:${secStr}`;

  // Bengali Solar Calendar estimation
  // In November (month index 10), it is Kartik (mid-Oct to mid-Nov)
  const banglaMonths = [
    'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র', 'বৈশাখ', 'জ্যৈষ্ঠ', 
    'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ'
  ];
  // Calculate approximate Bangla day & month
  const m = date.getMonth(); // 0-11
  const d = date.getDate();
  let bMonth = '';
  let bDay = 1;
  let bYear = date.getFullYear() - 593;
  if (m === 0) { // Jan
    if (d <= 14) { bMonth = 'পৌষ'; bDay = d + 16; }
    else { bMonth = 'মাঘ'; bDay = d - 14; }
  } else if (m === 1) { // Feb
    if (d <= 13) { bMonth = 'মাঘ'; bDay = d + 17; }
    else { bMonth = 'ফাল্গুন'; bDay = d - 13; }
  } else if (m === 2) { // Mar
    if (d <= 14) { bMonth = 'ফাল্গুন'; bDay = d + 16; }
    else { bMonth = 'চৈত্র'; bDay = d - 14; }
  } else if (m === 3) { // Apr
    if (d <= 13) { bMonth = 'চৈত্র'; bDay = d + 17; }
    else { bMonth = 'বৈশাখ'; bDay = d - 13; bYear = date.getFullYear() - 593; }
  } else if (m === 4) { // May
    if (d <= 14) { bMonth = 'বৈশাখ'; bDay = d + 17; }
    else { bMonth = 'জ্যৈষ্ঠ'; bDay = d - 14; }
  } else if (m === 5) { // Jun
    if (d <= 14) { bMonth = 'জ্যৈষ্ঠ'; bDay = d + 17; }
    else { bMonth = 'আষাঢ়'; bDay = d - 14; }
  } else if (m === 6) { // Jul
    if (d <= 15) { bMonth = 'আষাঢ়'; bDay = d + 16; }
    else { bMonth = 'শ্রাবণ'; bDay = d - 15; }
  } else if (m === 7) { // Aug
    if (d <= 15) { bMonth = 'শ্রাবণ'; bDay = d + 16; }
    else { bMonth = 'ভাদ্র'; bDay = d - 15; }
  } else if (m === 8) { // Sep
    if (d <= 15) { bMonth = 'ভাদ্র'; bDay = d + 16; }
    else { bMonth = 'আশ্বিন'; bDay = d - 15; }
  } else if (m === 9) { // Oct
    if (d <= 15) { bMonth = 'আশ্বিন'; bDay = d + 15; }
    else { bMonth = 'কার্তিক'; bDay = d - 15; }
  } else if (m === 10) { // Nov
    if (d <= 14) { bMonth = 'কার্তিক'; bDay = d + 16; }
    else { bMonth = 'অগ্রহায়ণ'; bDay = d - 14; }
  } else { // Dec
    if (d <= 14) { bMonth = 'অগ্রহায়ণ'; bDay = d + 16; }
    else { bMonth = 'পৌষ'; bDay = d - 14; }
  }
  const banglaEraDate = `${toBengaliNumber(bDay)} ${bMonth} ${toBengaliNumber(bYear)} বঙ্গাব্দ`;

  const dateStr = `${dayName}, ${day} ${month} ${year}`;
  const fullHeaderStr = `ঢাকা · ${dateStr} · ${banglaEraDate} · ${timeStr}`;

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
