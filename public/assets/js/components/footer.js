/**
 * Footer Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderFooter() {
  return `
    <footer class="bg-[#072e10] text-stone-300 text-sm border-t-4 border-[#d4af37] relative mt-16">
      <!-- Main Footer Columns -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          <!-- Column 1: Institutional Identity -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4619] to-black border-2 border-amber-400 flex items-center justify-center p-1 shadow-md">
                <svg class="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L9 9H2L7 13L5 20L12 16L19 20L17 13L22 9H15L12 2Z" fill="currentColor" opacity="0.9"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-base leading-tight">বায়তুশ শরফ মাদ্রাসা</h3>
                <p class="text-xs text-amber-300">খাগড়াছড়ি পার্বত্য জেলা</p>
              </div>
            </div>
            
            <p class="text-xs text-stone-300 leading-relaxed">
              খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা ইসলামী শিক্ষা ও আধুনিক শিক্ষার সুষম সমন্বয়ে একটি সুপরিচিত ও নির্ভরযোগ্য বিদ্যাপীঠ।
            </p>

            <div class="pt-2 text-xs text-stone-400 space-y-1">
              <p><strong class="text-amber-200">ইআইআইএন (EIIN):</strong> ১৩১৩২৫</p>
              <p><strong class="text-amber-200">প্রতিষ্ঠা সাল:</strong> ১৯৯৮ খ্রিষ্টাব্দ</p>
              <p><strong class="text-amber-200">স্তর:</strong> ফাজিল (ডিগ্রী)</p>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 pb-2 border-b border-emerald-800/80 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              দ্রুত লিঙ্কসমূহ
            </h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> মূলপাতা</a></li>
              <li><a href="/about.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> মাদ্রাসা পরিচিতি ও ইতিহাস</a></li>
              <li><a href="/admission.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> ভর্তি তথ্য ও নির্দেশিকা</a></li>
              <li><a href="/notices.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> নোটিশ বোর্ড</a></li>
              <li><a href="/results.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> পরীক্ষার ফলাফল</a></li>
              <li><a href="/routines.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> ক্লাস ও পরীক্ষা রুটিন</a></li>
              <li><a href="/downloads.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> প্রয়োজনীয় ডাউনলোড ও ফর্ম</a></li>
            </ul>
          </div>

          <!-- Column 3: Administration & Academics -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 pb-2 border-b border-emerald-800/80 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              প্রশাসন ও অ্যাকাডেমিক
            </h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/administration.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> পরিচালনা পর্ষদ ও কমিটি</a></li>
              <li><a href="/teachers.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> সম্মানিত শিক্ষকবৃন্দ</a></li>
              <li><a href="/staff.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> কর্মকর্তা ও কর্মচারীবৃন্দ</a></li>
              <li><a href="/departments.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> শিক্ষা বিভাগসমূহ</a></li>
              <li><a href="/gallery.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> ক্যাম্পাস ছবি গ্যালারি</a></li>
              <li><a href="/contact.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> যোগাযোগ ও সরাসরি ঠিকানা</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact & Portal -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 pb-2 border-b border-emerald-800/80 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              যোগাযোগ ও অফিস
            </h4>
            <div class="space-y-3 text-xs text-stone-300">
              <div class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>জেল রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি পার্বত্য জেলা, বাংলাদেশ</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>হেল্পলাইন: ০১৮১৬-XXXXXX</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>ইমেইল: info@kbjadfml.edu.bd</span>
              </div>
            </div>

            <!-- Admin portal quick button -->
            <div class="mt-5 pt-4 border-t border-emerald-900/60">
              <a href="/admin/login.html" class="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-emerald-900/60 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 transition">
                <svg class="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <span>প্রশাসক লগইন পোর্টাল</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bg-[#051f0b] text-stone-400 text-xs py-4 border-t border-emerald-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© ২০২৬ খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা। সর্বস্বত্ব সংরক্ষিত।</p>
          <p class="text-stone-500">ডিজাইন ও প্রযুক্তি: মাদ্রাসার আইটি বিভাগ ও ডেভেলপমেন্ট টিম</p>
        </div>
      </div>
    </footer>
  `;
}
