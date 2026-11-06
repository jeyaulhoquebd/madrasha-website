/**
 * Header Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Uses official assets and supports dynamic Firestore settings
 */

export const OFFICIAL_LOGO_URL = "https://res.cloudinary.com/edsn06rr/image/upload/v1793898297/images.jpg";

export function renderHeader(settings = {}) {
  const phone = settings?.phone || "০১৮১৬-XXXXXX";
  const email = settings?.email || "info@kbjadfml.edu.bd";
  const facebookUrl = settings?.facebookUrl || "https://facebook.com";
  const youtubeUrl = settings?.youtubeUrl || "https://youtube.com";

  return `
    <!-- Top Information Bar -->
    <div class="bg-[#072e10] text-emerald-100 text-xs py-2 border-b border-emerald-900/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
        
        <!-- Welcome Message & Bismillah -->
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="font-medium text-amber-300">بِسْمِ اللَّهِ الرَّحْمَٰনِ الرَّحِيمِ</span>
          <span class="hidden lg:inline text-emerald-600">|</span>
          <span class="hidden lg:inline text-stone-200">খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসায় স্বাগতম</span>
          <span class="hidden md:inline text-emerald-600">|</span>
          <span class="hidden sm:inline">ইআইআইএন: <strong class="text-white font-mono">১৩১৩২৫</strong></span>
        </div>

        <!-- Contact Placeholders & Social Links -->
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <!-- Phone (Managed via Firestore) -->
          <a href="tel:${phone}" id="header-phone" class="inline-flex items-center text-stone-200 hover:text-amber-300 transition">
            <svg class="w-3.5 h-3.5 mr-1 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span class="font-mono">${phone}</span>
          </a>

          <span class="text-emerald-700 hidden sm:inline">|</span>

          <!-- Email (Managed via Firestore) -->
          <a href="mailto:${email}" id="header-email" class="hidden sm:inline-flex items-center text-stone-200 hover:text-amber-300 transition">
            <svg class="w-3.5 h-3.5 mr-1 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="font-mono">${email}</span>
          </a>

          <span class="text-emerald-700">|</span>

          <!-- Social Media Icons -->
          <div class="flex items-center space-x-2.5 rtl:space-x-reverse">
            <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" class="text-stone-300 hover:text-amber-300 transition" aria-label="Facebook">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="text-stone-300 hover:text-amber-300 transition" aria-label="YouTube">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

          <span class="text-emerald-700">|</span>

          <!-- Admin Portal Access Link -->
          <a href="/admin/login.html" class="inline-flex items-center text-amber-300 hover:text-white font-medium transition text-xs">
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            এডমিন
          </a>
        </div>

      </div>
    </div>

    <!-- Main Header -->
    <header class="bg-white border-b border-stone-200 shadow-xs relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Official Logo and Identity -->
        <a href="/" class="flex items-center gap-3.5 sm:gap-4.5 group text-center md:text-left">
          <!-- Official Madrasa Logo Image -->
          <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md ring-2 ring-[#d4af37] flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              src="${OFFICIAL_LOGO_URL}" 
              alt="খাগড়াছড়ি বায়তুশ শরফ মাদ্রাসা লোগো" 
              class="w-full h-full object-contain rounded-full transform group-hover:scale-105 transition duration-300"
              loading="eager"
            />
          </div>

          <div class="flex flex-col">
            <span class="text-[11px] sm:text-xs font-semibold text-[#0B4619] tracking-wider uppercase">
              বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত ফাজিল (ডিগ্রী) প্রতিষ্ঠান
            </span>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#072e10] leading-tight group-hover:text-[#0B4619] transition">
              খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
            </h1>
            <p class="text-xs sm:text-sm text-stone-500 font-normal mt-0.5 flex items-center justify-center md:justify-start gap-1">
              <svg class="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>জেল রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি পার্বত্য জেলা</span>
            </p>
          </div>
        </a>

        <!-- Fast Official Badges -->
        <div class="hidden lg:flex items-center gap-4">
          <div class="text-right border-r border-stone-200 pr-4">
            <span class="block text-[11px] text-stone-500 font-medium">প্রতিষ্ঠা সাল</span>
            <span class="text-sm font-bold text-[#0B4619]">১৯৯৮ খ্রিষ্টাব্দ</span>
          </div>
          <div class="text-center">
            <span class="inline-block px-3 py-1.5 text-xs font-bold bg-emerald-50 text-[#0B4619] border border-emerald-300 rounded-md shadow-2xs">
              ফাজিল (ডিগ্রী) স্তর
            </span>
          </div>
        </div>

      </div>
    </header>
  `;
}
