/**
 * Notice Ticker Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderNoticeTicker(notices = []) {
  const hasNotices = notices && notices.length > 0;

  return `
    <div class="bg-amber-50/90 border-b border-amber-200/80 py-2">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <!-- Label Badge -->
        <div class="flex-shrink-0 flex items-center gap-1.5 bg-[#0B4619] text-amber-300 text-xs font-bold px-3 py-1 rounded-sm shadow-xs">
          <svg class="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
          <span>জরুরি নোটিশ:</span>
        </div>

        <!-- Ticker Content -->
        <div class="flex-1 overflow-hidden ml-3 text-xs sm:text-sm text-slate-800">
          ${hasNotices ? `
            <div class="inline-flex space-x-8 rtl:space-x-reverse animate-none sm:truncate">
              ${notices.map(n => `
                <a href="/notice-details.html?id=${n.id}" class="hover:text-[#0B4619] font-medium hover:underline inline-flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>${n.title}</span>
                </a>
              `).join('')}
            </div>
          ` : `
            <span class="text-stone-600 font-normal italic">
              বর্তমানে কোনো নতুন নোটিশ প্রকাশিত হয়নি। সকল নোটিশের জন্য <a href="/notices.html" class="text-[#0B4619] font-semibold underline">নোটিশ বোর্ড</a> দেখুন।
            </span>
          `}
        </div>

        <!-- All Notices Link -->
        <div class="flex-shrink-0 ml-2 pl-2 border-l border-amber-200 hidden sm:block">
          <a href="/notices.html" class="text-xs font-semibold text-[#0B4619] hover:text-[#072e10] flex items-center gap-1">
            <span>সকল নোটিশ</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}
