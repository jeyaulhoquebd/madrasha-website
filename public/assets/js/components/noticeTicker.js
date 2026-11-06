/**
 * Notice Ticker Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Smoothly scrolling ticker with hover-pause
 */

import { formatBengaliDate } from '../utils/date.js';

export function renderNoticeTicker(notices = []) {
  const hasNotices = notices && notices.length > 0;

  return `
    <div class="bg-amber-50/95 border-b border-amber-200/90 py-2.5 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        
        <!-- Urgent Badge / Label -->
        <div class="flex-shrink-0 z-10 flex items-center gap-1.5 bg-[#0B4619] text-amber-300 text-xs font-bold px-3 py-1.5 rounded shadow-xs border border-amber-400/40">
          <svg class="w-3.5 h-3.5 text-amber-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
          <span>জরুরি বিজ্ঞপ্তি:</span>
        </div>

        <!-- Scrolling Ticker Track -->
        <div class="flex-1 overflow-hidden ml-3 relative whitespace-nowrap mask-fade">
          ${hasNotices ? `
            <div class="inline-block animate-ticker text-xs sm:text-sm text-slate-800">
              ${notices.map((n, i) => `
                <a href="/notice-details.html?id=${n.id}" class="hover:text-[#0B4619] font-medium hover:underline inline-flex items-center gap-2 mx-6 transition">
                  <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                  <span class="font-semibold text-[#072e10]">[${n.category || 'সাধারণ'}]</span>
                  <span>${n.title}</span>
                  ${n.publishedAt ? `<span class="text-[11px] text-stone-500">(${formatBengaliDate(n.publishedAt)})</span>` : ''}
                </a>
              `).join('')}
            </div>
          ` : `
            <div class="text-xs sm:text-sm text-stone-600 font-normal italic flex items-center gap-2">
              <span>বর্তমানে কোনো নতুন জরুরি বিজ্ঞপ্তি প্রকাশিত হয়নি। পূর্বের নোটিশ দেখতে</span>
              <a href="/notices.html" class="text-[#0B4619] font-bold hover:underline">নোটিশ বোর্ডে যান →</a>
            </div>
          `}
        </div>

        <!-- All Notices Link -->
        <div class="flex-shrink-0 ml-3 pl-3 border-l border-amber-300/80 hidden sm:block z-10">
          <a href="/notices.html" class="text-xs font-bold text-[#0B4619] hover:text-[#072e10] flex items-center gap-1 transition">
            <span>সকল নোটিশ</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>

      </div>
    </div>
  `;
}
