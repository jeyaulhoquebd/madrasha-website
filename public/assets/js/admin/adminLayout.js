/**
 * Admin Dashboard Layout Helper
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderAdminHeader(activeNav = 'dashboard') {
  const navItems = [
    { key: 'dashboard', label: 'ড্যাশবোর্ড', url: '/admin/index.html' },
    { key: 'notices', label: 'নোটিশ ব্যবস্থাপনা', url: '/admin/notices.html' },
    { key: 'teachers', label: 'শিক্ষকবৃন্দ', url: '/admin/teachers.html' },
    { key: 'staff', label: 'কর্মচারীবৃন্দ', url: '/admin/staff.html' },
    { key: 'departments', label: 'বিভাগসমূহ', url: '/admin/departments.html' },
    { key: 'admissions', label: 'ভর্তি আবেদন', url: '/admin/admissions.html' },
    { key: 'results', label: 'ফলাফল', url: '/admin/results.html' },
    { key: 'routines', label: 'রুটিন', url: '/admin/routines.html' },
    { key: 'downloads', label: 'ডাউনলোড ফাইল', url: '/admin/downloads.html' },
    { key: 'gallery', label: 'গ্যালারি', url: '/admin/gallery.html' },
    { key: 'settings', label: 'সেটিংস', url: '/admin/settings.html' }
  ];

  return `
    <header class="bg-[#072e10] text-white border-b-2 border-[#d4af37] sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <span class="w-8 h-8 rounded-full bg-emerald-800 border border-amber-400 flex items-center justify-center font-bold text-amber-300 text-xs">
              এডমিন
            </span>
            <div class="leading-tight">
              <h2 class="text-sm sm:text-base font-bold text-white">প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র</h2>
              <p class="text-[10px] text-amber-300">বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল মাদ্রাসা</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <a href="/" target="_blank" class="text-xs text-emerald-200 hover:text-white flex items-center gap-1 bg-emerald-900/60 px-3 py-1.5 rounded border border-emerald-700/60 transition">
              <span>ওয়েবসাইট দেখুন</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            <button id="admin-logout-btn" class="text-xs bg-rose-700 hover:bg-rose-800 text-white font-semibold px-3 py-1.5 rounded transition">
              লগআউট
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Secondary Subnav -->
      <div class="bg-[#0B4619] border-t border-emerald-800/80 overflow-x-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 rtl:space-x-reverse py-1.5 text-xs font-medium whitespace-nowrap">
          ${navItems.map(item => `
            <a href="${item.url}" class="px-3 py-1.5 rounded transition ${activeNav === item.key ? 'bg-white text-[#072e10] font-bold shadow-xs' : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'}">
              ${item.label}
            </a>
          `).join('')}
        </div>
      </div>
    </header>
  `;
}
