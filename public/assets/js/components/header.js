/**
 * Header Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderHeader() {
  return `
    <!-- Top Bar -->
    <div class="bg-[#072e10] text-emerald-100/90 text-xs py-2 border-b border-emerald-900/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="font-medium text-amber-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <span class="hidden md:inline text-emerald-500/80">|</span>
          <span class="hidden md:inline">ইআইআইএন (EIIN): <strong class="text-white font-mono">১৩১৩২৫</strong></span>
        </div>
        <div class="flex items-center space-x-4 rtl:space-x-reverse text-xs">
          <a href="/admission.html" class="inline-flex items-center text-amber-300 hover:text-amber-200 font-medium transition">
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            অনলাইন ভর্তি আবেদন
          </a>
          <span class="text-emerald-700">|</span>
          <a href="/admin/login.html" class="inline-flex items-center text-emerald-200 hover:text-white transition">
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            প্রশাসনিক পোর্টাল
          </a>
        </div>
      </div>
    </div>

    <!-- Main Branding Header -->
    <header class="bg-white border-b border-stone-200 shadow-xs relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Logo and Identity -->
        <a href="/" class="flex items-center gap-3.5 sm:gap-4 group text-center md:text-left">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0B4619] to-[#072e10] p-1 shadow-md ring-2 ring-[#d4af37]/40 flex-shrink-0 flex items-center justify-center">
            <div class="w-full h-full rounded-full border border-amber-300/40 flex flex-col items-center justify-center text-amber-300 text-center p-1">
              <svg class="w-8 h-8 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9 9H2L7 13L5 20L12 16L19 20L17 13L22 9H15L12 2Z" fill="currentColor" opacity="0.9" />
              </svg>
              <span class="text-[9px] font-bold tracking-tight text-white mt-0.5">স্থাপিত ১৯৯৮</span>
            </div>
          </div>

          <div class="flex flex-col">
            <span class="text-xs font-semibold text-[#0B4619] tracking-wider uppercase">বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত ফাজিল (ডিগ্রী) প্রতিষ্ঠান</span>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#072e10] leading-tight group-hover:text-[#0B4619] transition">
              খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
            </h1>
            <p class="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
              জেল রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি পার্বত্য জেলা
            </p>
          </div>
        </a>

        <!-- Fast Contact / Govt Badges -->
        <div class="hidden lg:flex items-center gap-6">
          <div class="flex items-center gap-3 bg-stone-50 border border-stone-200/80 rounded-lg p-2.5 px-3.5">
            <div class="w-9 h-9 rounded-full bg-emerald-100 text-[#0B4619] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div>
              <p class="text-[11px] text-stone-500 font-medium">জরুরি তথ্য ও সহায়তা</p>
              <p class="text-sm font-bold text-slate-800 font-mono">০১৮১৬-XXXXXX</p>
            </div>
          </div>
          <div class="text-center border-l border-stone-200 pl-4">
            <span class="inline-block px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-[#0B4619] border border-emerald-200 rounded">
              ফাজিল স্তর
            </span>
          </div>
        </div>
      </div>
    </header>
  `;
}
