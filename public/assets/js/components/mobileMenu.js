/**
 * Mobile Navigation Menu & Drawer
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderMobileMenu(activePage = 'home') {
  return `
    <div id="mobile-menu-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 hidden transition-opacity"></div>
    <div id="mobile-menu-drawer" class="fixed inset-y-0 right-0 max-w-xs w-full bg-white z-50 shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-in-out">
      
      <!-- Drawer Header -->
      <div class="p-4 bg-[#0B4619] text-white flex items-center justify-between border-b border-emerald-800">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-sm text-amber-300">মাদ্রাসার প্রধান মেনু</span>
        </div>
        <button id="mobile-menu-close-btn" class="p-1 rounded text-white/80 hover:text-white hover:bg-emerald-800 focus:outline-hidden" aria-label="মেনু বন্ধ করুন">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Links List -->
      <div class="overflow-y-auto flex-1 p-4 space-y-1 text-slate-800 text-sm font-medium">
        <a href="/" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'home' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          মূলপাতা
        </a>

        <a href="/about.html" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'about' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          পরিচিতি
        </a>

        <!-- Administration Accordion -->
        <div class="border-t border-stone-100 pt-1">
          <button class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-stone-100 text-left" id="mobile-admin-toggle">
            <span>প্রশাসন</span>
            <svg class="w-4 h-4 text-stone-400 transform transition-transform" id="mobile-admin-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="pl-4 pr-1 py-1 space-y-1 hidden" id="mobile-admin-submenu">
            <a href="/administration.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">পরিচালনা পর্ষদ ও বার্তা</a>
            <a href="/teachers.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">সম্মানিত শিক্ষকবৃন্দ</a>
            <a href="/staff.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">কর্মকর্তা ও কর্মচারীবৃন্দ</a>
          </div>
        </div>

        <!-- Academic Accordion -->
        <div class="border-t border-stone-100 pt-1">
          <button class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-stone-100 text-left" id="mobile-academic-toggle">
            <span>একাডেমিক</span>
            <svg class="w-4 h-4 text-stone-400 transform transition-transform" id="mobile-academic-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="pl-4 pr-1 py-1 space-y-1 hidden" id="mobile-academic-submenu">
            <a href="/academic.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">একাডেমিক তথ্য</a>
            <a href="/departments.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">বিভাগসমূহ</a>
            <a href="/routines.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">ক্লাস ও পরীক্ষা রুটিন</a>
            <a href="/results.html" class="block px-3 py-2 rounded text-xs text-stone-600 hover:text-[#0B4619] hover:bg-emerald-50">পরীক্ষার ফলাফল</a>
          </div>
        </div>

        <a href="/admission.html" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'admission' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          ভর্তি তথ্য
        </a>

        <a href="/notices.html" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'notices' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          নোটিশ বোর্ড
        </a>

        <a href="/downloads.html" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'downloads' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          ডাউনলোড
        </a>

        <a href="/gallery.html" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'gallery' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          গ্যালারি
        </a>

        <a href="/contact.html" class="flex items-center px-3 py-2.5 rounded-lg ${activePage === 'contact' ? 'bg-emerald-50 text-[#0B4619] font-bold' : 'hover:bg-stone-100'}">
          যোগাযোগ
        </a>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 bg-stone-50 border-t border-stone-200">
        <a href="/admin/login.html" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B4619] text-white text-xs font-bold rounded-lg shadow hover:bg-[#072e10] transition">
          <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          প্রশাসনিক লগইন
        </a>
      </div>
    </div>
  `;
}

/**
 * Attaches interactive toggle handlers for the mobile drawer
 */
export function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const drawer = document.getElementById('mobile-menu-drawer');

  function openDrawer() {
    backdrop?.classList.remove('hidden');
    drawer?.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    backdrop?.classList.add('hidden');
    drawer?.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  // Submenu accordions
  const adminToggle = document.getElementById('mobile-admin-toggle');
  const adminSub = document.getElementById('mobile-admin-submenu');
  const adminArrow = document.getElementById('mobile-admin-arrow');
  adminToggle?.addEventListener('click', () => {
    adminSub?.classList.toggle('hidden');
    adminArrow?.classList.toggle('rotate-180');
  });

  const academicToggle = document.getElementById('mobile-academic-toggle');
  const academicSub = document.getElementById('mobile-academic-submenu');
  const academicArrow = document.getElementById('mobile-academic-arrow');
  academicToggle?.addEventListener('click', () => {
    academicSub?.classList.toggle('hidden');
    academicArrow?.classList.toggle('rotate-180');
  });
}
