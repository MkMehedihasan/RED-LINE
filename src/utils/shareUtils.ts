/**
 * Utilities for generating rock-solid, shareable URLs for Facebook, WhatsApp, and social media
 */

export function getNewsShareUrl(articleId: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?news=${encodeURIComponent(articleId)}`;
}

export function getFacebookShareUrl(articleId: string): string {
  const url = getNewsShareUrl(articleId);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function getWhatsAppShareUrl(articleId: string, title?: string): string {
  const url = getNewsShareUrl(articleId);
  const text = title ? `${title}\n\nপড়ুন বিস্তারিত:\n${url}` : url;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getFacebookPromoSnippet(title: string, articleId: string): string {
  const shareUrl = getNewsShareUrl(articleId);
  return `📌 ${title}\n\n👉 পুরো বিস্তারিত খবরটি পড়তে নিচের লিংকে ক্লিক করুন:\n🔗 ${shareUrl}\n\n#REDLINE #News #Bangladesh`;
}

/**
 * Universal clipboard copy with fallback for iframe/permission-restricted contexts
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Try modern navigator.clipboard
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea fallback
    }
  }

  // 2. Fallback using temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Copy fallback failed:', err);
    return false;
  }
}
