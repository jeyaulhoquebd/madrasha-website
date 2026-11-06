/**
 * Footer Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Features official logo, contact info, social links, and editable developer credit
 */

import { OFFICIAL_LOGO_URL } from './header.js';

export function renderFooter(settings = {}) {
  const phone = settings?.phone || "০১৮১৬-XXXXXX";
  const email = settings?.email || "info@kbjadfml.edu.bd";
  const address = settings?.address || "জেল রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি পার্বত্য জেলা, বাংলাদেশ";
  const devCredit = settings?.developerCredit || "মাদ্রাসার আইটি সেল ও ডেভেলপমেন্ট টিম";
  const facebookUrl = settings?.facebookUrl || "https://facebook.com";
  const youtubeUrl = settings?.youtubeUrl || "https://youtube.com";

  return `
    <footer class="bg-[#072e10] text-stone-300 text-sm border-t-4 border-[#d4af37] relative mt-16">
      
      <!-- Subtle Islamic Pattern Overlay -->
      <div class="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none"></div>

      <!-- Main Footer Columns -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          <!-- Column 1: Institutional Identity & Logo -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-full bg-white p-1 border-2 border-amber-400 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                <img 
                  src="${OFFICIAL_LOGO_URL}" 
                  alt="খাগড়াছড়ি বায়তুশ শরফ মাদ্রাসা লোগো" 
                  class="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 class="font-bold text-white text-base leading-tight">বায়তুশ শরফ মাদ্রাসা</h3>
                <p class="text-xs text-amber-300">খাগড়াছড়ি পার্বত্য জেলা</p>
              </div>
            </div>
            
            <p class="text-xs text-stone-300 leading-relaxed">
              খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা ১৯৯৮ সাল থেকে পাহাড়ি জনপদে কুরআন-সুন্নাহ ও আধুনিক শিক্ষার অনন্য সমন্বয়কারী শিক্ষা প্রতিষ্ঠান।
            </p>

            <div class="pt-2 text-xs text-stone-300 space-y-1 bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/60">
              <p><strong class="text-amber-300">ইআইআইএন (EIIN):</strong> <span class="font-mono">১৩১৩২৫</span></p>
              <p><strong class="text-amber-300">প্রতিষ্ঠা সাল:</strong> ১৯৯৮ খ্রিষ্টাব্দ</p>
              <p><strong class="text-amber-300">অনুমোদিত স্তর:</strong> ফাজিল (ডিগ্রী)</p>
            </div>

            <!-- Social Media Links -->
            <div class="pt-2 flex items-center gap-3">
              <span class="text-xs text-amber-200 font-medium">সামাজিক যোগাযোগ:</span>
              <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" class="w-7 h-7 rounded-full bg-emerald-900 hover:bg-amber-400 hover:text-[#072e10] text-white flex items-center justify-center transition" aria-label="Facebook">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="w-7 h-7 rounded-full bg-emerald-900 hover:bg-amber-400 hover:text-[#072e10] text-white flex items-center justify-center transition" aria-label="YouTube">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 pb-2 border-b border-emerald-800/80 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              প্রয়োজনীয় লিঙ্কসমূহ
            </h4>
            <ul class="space-y-2.5 text-xs">
              <li><a href="/" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> মূলপাতা</a></li>
              <li><a href="/about.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> মাদ্রাসা পরিচিতি ও ইতিহাস</a></li>
              <li><a href="/admission.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> অনলাইন ভর্তি তথ্য</a></li>
              <li><a href="/notices.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> অফিসিয়াল নোটিশ বোর্ড</a></li>
              <li><a href="/results.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> পরীক্ষার ফলাফল অনুসন্ধান</a></li>
              <li><a href="/routines.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> ক্লাস ও পরীক্ষা রুটিন</a></li>
              <li><a href="/downloads.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> ফরম ও সিলেবাস ডাউনলোড</a></li>
            </ul>
          </div>

          <!-- Column 3: Administration & Academics -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 pb-2 border-b border-emerald-800/80 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              প্রশাসন ও একাডেমিক
            </h4>
            <ul class="space-y-2.5 text-xs">
              <li><a href="/administration.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> গভর্নিং বডি ও পরিচালনা পর্ষদ</a></li>
              <li><a href="/teachers.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> শিক্ষক মণ্ডলী</a></li>
              <li><a href="/staff.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> কর্মকর্তা ও কর্মচারী</a></li>
              <li><a href="/departments.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> শিক্ষা বিভাগসমূহ</a></li>
              <li><a href="/gallery.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> ফটো ও ভিডিও গ্যালারি</a></li>
              <li><a href="/contact.html" class="hover:text-amber-300 transition flex items-center gap-1.5"><span class="text-emerald-500">›</span> অবস্থান ও যোগাযোগ</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact & Location -->
          <div>
            <h4 class="text-white font-bold text-base mb-4 pb-2 border-b border-emerald-800/80 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              যোগাযোগ ও অফিস
            </h4>
            <div class="space-y-3 text-xs text-stone-300">
              <div class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span id="footer-address">${address}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span id="footer-phone">হেল্পলাইন: <span class="font-mono">${phone}</span></span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span id="footer-email">ইমেইল: <span class="font-mono">${email}</span></span>
              </div>
            </div>

            <!-- Admin Login Link Button -->
            <div class="mt-5 pt-4 border-t border-emerald-900/60">
              <a href="/admin/login.html" class="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-emerald-900/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 transition shadow-xs">
                <svg class="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <span>প্রশাসনিক প্রবেশদ্বার (এডমিন)</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom Copyright & Developer Credit Bar -->
      <div class="bg-[#051f0b] text-stone-400 text-xs py-4 border-t border-emerald-950 relative z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© ২০২৬ খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা। সর্বস্বত্ব সংরক্ষিত।</p>
          <p class="text-stone-400">
            ওয়েবসাইট ডেভেলপমেন্ট: <span class="text-amber-300 font-medium" id="footer-dev-credit">${devCredit}</span>
          </p>
        </div>
      </div>
    </footer>
  `;
}
