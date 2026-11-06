/**
 * About Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads institutional history, mission, vision, facilities & principal's message from Firestore
 */

import { db, doc, getDoc } from '../firebase/config.js';
import { OFFICIAL_LOGO_URL, OFFICIAL_HERO_IMAGE_URL } from './home.js';

export async function initAboutPage() {
  const container = document.getElementById('about-dynamic-content');
  if (!container) return;

  let aboutData = null;

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'about'));
      if (snap.exists()) {
        aboutData = snap.data();
      }
    } catch (e) {
      console.warn('[Firestore] About settings fallback:', e.message);
    }
  }

  // Institutional verified content with dynamic overrides
  const historyText = aboutData?.history || `
    খাগড়াছড়ি পার্বত্য জেলায় দ্বীনি শিক্ষার আলো ছড়িয়ে দেওয়ার লক্ষ্যে ১৯৯৮ সালে খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা প্রতিষ্ঠিত হয়। বায়তুশ শরফের প্রতিষ্ঠাতা ও বিশিষ্ট ইসলামী চিন্তাবিদগণের ঐকান্তিক প্রচেষ্টা এবং স্থানীয় ধর্মপ্রাণ মানুষের সহযোগিতায় প্রতিষ্ঠিত এই বিদ্যাপীঠ আজ অত্র অঞ্চলের অন্যতম শীর্ষস্থানীয় শিক্ষা প্রতিষ্ঠানে পরিণত হয়েছে।
    <br><br>
    মাদ্রাসাটি বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড কর্তৃক প্রাথমিক সমাপনী, দাখিল ও আলিম স্তরে এবং ইসলামী আরবি বিশ্ববিদ্যালয় কর্তৃক ফাজিল (ডিগ্রী) স্তরে স্বীকৃতি ও অধিভুক্তি লাভ করে অত্যন্ত সুনামের সাথে পরিচালিত হয়ে আসছে।
  `;

  const missionText = aboutData?.mission || `
    কুরআন, হাদিস ও ইসলামী শরীয়তের বিশুদ্ধ জ্ঞানের পাশাপাশি জাতীয় শিক্ষাক্রমের আধুনিক বিজ্ঞান, তথ্যপ্রযুক্তি ও সাধারণ শিক্ষার সমন্বয়ে যোগ্য, সৎ, দেশপ্রেমিক ও নৈতিকতাসম্পন্ন আদর্শ নাগরিক গড়ে তোলা।
  `;

  const visionText = aboutData?.vision || `
    একটি আধুনিক, প্রযুক্তিনির্ভর ও আদর্শিক ইসলামী বিদ্যাপীঠ হিসেবে গড়ে ওঠা, যা পার্বত্য চট্টগ্রামের পিছিয়ে পড়া জনগোষ্ঠীর সন্তানদের গুণগত মানসম্মত উচ্চশিক্ষার সুযোগ সৃষ্টি করে বিশ্বমানের যোগ্য আলেম ও দক্ষ নাগরিক তৈরি করবে।
  `;

  const objectives = aboutData?.objectives || [
    'সহিহ কুরআন তেলাওয়াত, তরজমা ও হাদিসের মৌলিক জ্ঞানে পারদর্শিতা অর্জন।',
    'আরবি ভাষার সাথে সাথে বাংলা ও ইংরেজি ভাষায় কার্যকর যোগাযোগ দক্ষতা তৈরি।',
    'কম্পিউটার ও আধুনিক তথ্যপ্রযুক্তির ব্যবহারিক শিক্ষায় দক্ষ করে তোলা।',
    'দাখিল, আলিম ও ফাজিল পরীক্ষায় সর্বোচ্চ ফলাফল অর্জন নিশ্চিতকরণ।',
    'ইসলামী মূল্যবোধ, দেশপ্রেম ও সামাজিক দায়বদ্ধতা জাগ্রত করা।'
  ];

  const facilities = aboutData?.facilities || [
    { title: 'সুপরিসর লাইব্রেরি', desc: 'ইসলামী ধর্মীয় কিতাব, তাফসির, হাদিস ও সাধারণ পাঠ্যবইয়ের সমৃদ্ধ সংগ্রহশালা।', icon: 'book' },
    { title: 'কম্পিউটার ল্যাব', desc: 'শিক্ষার্থীদের ডিজিটাল ও কম্পিউটার শিক্ষায় দক্ষ করার জন্য সুসজ্জিত কম্পিউটার ল্যাব।', icon: 'computer' },
    { title: 'বিজ্ঞান গবেষণাগার', desc: 'দাখিল ও আলিম স্তরের বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য ব্যবহারিক ল্যাব।', icon: 'lab' },
    { title: 'নিরাপদ আবাসিক হোস্টেল', desc: 'দূর-দূরান্ত থেকে আগত ছাত্রদের জন্য সুশৃঙ্খল ও নিরাপদ ছাত্রাবাস সুবিধা।', icon: 'home' },
    { title: 'খেলার মাঠ ও সহশিক্ষা', desc: 'শিক্ষার্থীদের শারীরিক সুস্থতা ও মানসিক বিকাশের জন্য উন্মুক্ত মাঠ ও ক্রীড়া সামগ্রী।', icon: 'sport' },
    { title: 'মসজিদ ও অডিটোরিয়াম', desc: 'নিয়মিত জামাতে নামাজ আদায় ও ধর্মীয় আলোচনাসভা আয়োজনের জন্য সুবিশাল মসজিদ।', icon: 'mosque' }
  ];

  container.innerHTML = `
    <!-- Top Hero Section -->
    <div class="relative rounded-2xl overflow-hidden shadow-md mb-12 bg-[#072e10] text-white">
      <div class="absolute inset-0">
        <img src="${OFFICIAL_HERO_IMAGE_URL}" alt="ক্যাম্পাস" class="w-full h-full object-cover opacity-25">
        <div class="absolute inset-0 bg-gradient-to-r from-[#072e10] via-[#0B4619]/90 to-transparent"></div>
      </div>
      <div class="relative p-6 sm:p-12 max-w-3xl space-y-4">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
          স্থাপিত: ১৯৯৮ খ্রিষ্টাব্দ • ইআইআইএন: ১৩১৩২৫
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">মাদ্রাসা পরিচিতি ও ইতিহাস</h1>
        <p class="text-xs sm:text-base text-emerald-100 font-light leading-relaxed">
          খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা ইসলামী মূল্যবোধ ও আধুনিক শিক্ষার সুষম সমন্বয়ে পার্বত্য খাগড়াছড়ির একটি ঐতিহ্যবাহী দ্বীনি বিদ্যাপীঠ।
        </p>
      </div>
    </div>

    <!-- History & Background -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div class="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider">
          <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
          <span>ঐতিহাসিক পটভূমি</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-[#072e10]">মাদ্রাসার প্রতিষ্ঠা ও অগ্রগতি</h2>
        <div class="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3">
          ${historyText}
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-100 mt-6 text-center">
          <div class="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span class="text-[11px] text-stone-500 font-medium">প্রতিষ্ঠা সাল</span>
            <p class="text-base font-bold text-[#0B4619] mt-0.5">১৯৯৮</p>
          </div>
          <div class="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span class="text-[11px] text-stone-500 font-medium">ইআইআইএন</span>
            <p class="text-base font-bold text-[#0B4619] mt-0.5 font-mono">১৩১৩২৫</p>
          </div>
          <div class="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span class="text-[11px] text-stone-500 font-medium">সর্বোচ্চ ডিগ্রি</span>
            <p class="text-base font-bold text-[#0B4619] mt-0.5">ফাজিল (ডিগ্রী)</p>
          </div>
          <div class="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span class="text-[11px] text-stone-500 font-medium">অবস্থান</span>
            <p class="text-base font-bold text-[#0B4619] mt-0.5">খাগড়াছড়ি সদর</p>
          </div>
        </div>
      </div>

      <!-- Quick Facts Box -->
      <div class="bg-gradient-to-br from-[#0B4619] to-[#072e10] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
        <div>
          <div class="w-16 h-16 rounded-full bg-white p-1 mb-4 border-2 border-amber-400 overflow-hidden">
            <img src="${OFFICIAL_LOGO_URL}" alt="লোগো" class="w-full h-full object-contain">
          </div>
          <h3 class="font-bold text-lg text-amber-300">বায়তুশ শরফ আদর্শ</h3>
          <p class="text-xs text-stone-200 mt-2 leading-relaxed">
            "জ্ঞান, আমল ও নৈতিকতার সমন্বয়" — বায়তুশ শরফের এই শাশ্বত মূলনীতির আলোকে শিক্ষার্থীদের মননশীল ও খোদাভীরু হিসেবে গড়ে তোলাই আমাদের লক্ষ্য।
          </p>
        </div>
        <div class="pt-4 border-t border-emerald-800 text-xs text-stone-300 space-y-2">
          <p>📍 জেল রোড, খাগড়াছড়ি সদর</p>
          <p>✉️ info@kbjadfml.edu.bd</p>
          <p>📞 ০১৮১৬-XXXXXX</p>
        </div>
      </div>
    </div>

    <!-- Mission & Vision -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <!-- Mission -->
      <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-3 relative overflow-hidden">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B4619] flex items-center justify-center font-bold text-xl mb-2">
          🎯
        </div>
        <h3 class="text-lg font-bold text-[#072e10]">আমাদের লক্ষ্য (Mission)</h3>
        <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
          ${missionText}
        </p>
      </div>

      <!-- Vision -->
      <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-3 relative overflow-hidden">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl mb-2">
          🔭
        </div>
        <h3 class="text-lg font-bold text-[#072e10]">আমাদের দূরদৃষ্টি (Vision)</h3>
        <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
          ${visionText}
        </p>
      </div>
    </div>

    <!-- Educational Objectives -->
    <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-12 space-y-6">
      <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
        <span>উদ্দেশ্য ও কার্যক্রম</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold text-[#072e10]">প্রাতিষ্ঠানিক শিক্ষাগত লক্ষ্য ও উদ্দেশ্যসমূহ</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${objectives.map((obj, i) => `
          <div class="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <span class="w-6 h-6 rounded-full bg-[#0B4619] text-amber-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              ${i + 1}
            </span>
            <p class="text-xs sm:text-sm text-stone-700 leading-snug">${obj}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Institutional Facilities -->
    <div class="mb-12 space-y-6">
      <div class="text-center max-w-xl mx-auto space-y-2">
        <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">সুবিধাসমূহ</span>
        <h2 class="text-xl sm:text-3xl font-bold text-[#072e10]">ক্যাম্পাসের অবকাঠামো ও সুবিধাদি</h2>
        <p class="text-xs sm:text-sm text-stone-500">শিক্ষার্থীদের সার্বিক মেধা ও প্রতিভা বিকাশে আমাদের সুযোগ-সুবিধা</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${facilities.map(fac => `
          <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-xs hover:border-[#0B4619] transition group">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B4619] group-hover:bg-[#0B4619] group-hover:text-amber-300 flex items-center justify-center text-2xl transition mb-4">
              🏛️
            </div>
            <h3 class="font-bold text-base text-slate-800 mb-1.5 group-hover:text-[#0B4619]">${fac.title}</h3>
            <p class="text-xs text-stone-600 leading-relaxed">${fac.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
