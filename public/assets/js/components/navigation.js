/**
 * Desktop & Tablet Navigation Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderNavigation(activePage = 'home') {
  const isActive = (key) => activePage === key ? 'bg-[#072e10] text-[#d4af37] font-semibold' : 'text-white hover:bg-[#072e10]/80 hover:text-amber-200';

  return `
    <nav class="bg-[#0B4619] shadow-md sticky top-0 z-40 border-b-2 border-[#d4af37]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-13">
          
          <!-- Desktop Nav Links -->
          <div class="hidden lg:flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium">
            <a href="/" class="px-3.5 py-2 rounded-md transition ${isActive('home')}">
              মূলপাতা
            </a>

            <a href="/about.html" class="px-3.5 py-2 rounded-md transition ${isActive('about')}">
              পরিচিতি
            </a>

            <!-- Administration Dropdown -->
            <div class="relative group">
              <button class="px-3.5 py-2 rounded-md inline-flex items-center transition ${['administration', 'teachers', 'staff'].includes(activePage) ? 'bg-[#072e10] text-[#d4af37]' : 'text-white hover:bg-[#072e10]/80'}">
                <span>প্রশাসন</span>
                <svg class="w-4 h-4 ml-1 opacity-80 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div class="absolute left-0 mt-0 w-52 bg-white text-slate-800 rounded-b-md shadow-xl border border-stone-200 hidden group-hover:block transition-all z-50">
                <a href="/administration.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619] border-b border-stone-100">পরিচালনা পর্ষদ ও বার্তা</a>
                <a href="/teachers.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619] border-b border-stone-100">সম্মানিত শিক্ষকবৃন্দ</a>
                <a href="/staff.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619]">কর্মকর্তা ও কর্মচারীবৃন্দ</a>
              </div>
            </div>

            <!-- Academic Dropdown -->
            <div class="relative group">
              <button class="px-3.5 py-2 rounded-md inline-flex items-center transition ${['academic', 'departments', 'routines', 'results'].includes(activePage) ? 'bg-[#072e10] text-[#d4af37]' : 'text-white hover:bg-[#072e10]/80'}">
                <span>একাডেমিক</span>
                <svg class="w-4 h-4 ml-1 opacity-80 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div class="absolute left-0 mt-0 w-52 bg-white text-slate-800 rounded-b-md shadow-xl border border-stone-200 hidden group-hover:block transition-all z-50">
                <a href="/academic.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619] border-b border-stone-100">একাডেমিক তথ্য</a>
                <a href="/departments.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619] border-b border-stone-100">বিভাগসমূহ</a>
                <a href="/routines.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619] border-b border-stone-100">ক্লাস ও পরীক্ষা রুটিন</a>
                <a href="/results.html" class="block px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0B4619]">পরীক্ষার ফলাফল</a>
              </div>
            </div>

            <a href="/admission.html" class="px-3.5 py-2 rounded-md transition ${isActive('admission')}">
              ভর্তি তথ্য
            </a>

            <a href="/notices.html" class="px-3.5 py-2 rounded-md transition ${isActive('notices')}">
              নোটিশ বোর্ড
            </a>

            <a href="/downloads.html" class="px-3.5 py-2 rounded-md transition ${isActive('downloads')}">
              ডাউনলোড
            </a>

            <a href="/gallery.html" class="px-3.5 py-2 rounded-md transition ${isActive('gallery')}">
              গ্যালারি
            </a>

            <a href="/contact.html" class="px-3.5 py-2 rounded-md transition ${isActive('contact')}">
              যোগাযোগ
            </a>
          </div>

          <!-- Quick Right Action Button -->
          <div class="hidden lg:flex items-center">
            <a href="/admission.html" class="bg-[#d4af37] hover:bg-[#c59b27] text-[#072e10] text-xs font-bold px-4 py-2 rounded shadow transition-all transform active:scale-95">
              ভর্তি চলছে
            </a>
          </div>

          <!-- Mobile Menu Toggle Button -->
          <div class="flex lg:hidden items-center justify-between w-full py-2">
            <span class="text-white font-semibold text-sm">মেনু নির্বাচন করুন</span>
            <button id="mobile-menu-btn" aria-label="মেনু খুলুন" class="p-2 rounded-md text-white hover:bg-[#072e10] focus:outline-hidden">
              <svg id="menu-icon-bars" class="w-6 h-6 block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              <svg id="menu-icon-close" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  `;
}
