/**
 * Notice Ticker
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Renders nothing when there are no published notices.
 */

import { esc } from '../utils/escape.js';

export function renderNoticeTicker(notices = []) {
  if (!notices || notices.length === 0) return '';

  const items = notices.map(n => `
    <a href="/notice-details.html?id=${encodeURIComponent(n.id)}" class="mx-6 inline-flex items-center gap-2 text-stone-700 hover:text-brand-700">
      <span class="h-1 w-1 rounded-full bg-gold-500"></span>
      <span>${esc(n.title)}</span>
    </a>
  `).join('');

  return `
    <div class="border-b border-stone-200/80 bg-gold-100/60">
      <div class="wrap flex items-center gap-3 py-2 text-sm">
        <span class="flex-shrink-0 rounded-md bg-brand-700 px-2.5 py-0.5 text-xs font-semibold text-white">নোটিশ</span>
        <div class="relative flex-1 overflow-hidden">
          <div class="animate-ticker">${items}${items}</div>
        </div>
        <a href="/notices.html" class="hidden flex-shrink-0 text-xs font-semibold text-brand-700 hover:underline sm:inline">সব দেখুন</a>
      </div>
    </div>
  `;
}
