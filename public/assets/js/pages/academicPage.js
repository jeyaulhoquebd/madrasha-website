/**
 * Academic Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads Academic Overview, Education System, Academic Calendar & Guidelines
 */

import { db, doc, getDoc, collection, getDocs, query, orderBy } from '../firebase/config.js';

export async function initAcademicPage() {
  const container = document.getElementById('academic-dynamic-content');
  if (!container) return;

  let academicData = null;
  let calendarEvents = [];

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'academic'));
      if (snap.exists()) {
        academicData = snap.data();
      }

      const calSnap = await getDocs(query(collection(db, 'calendar'), orderBy('date', 'asc')));
      calSnap.forEach(d => calendarEvents.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Academic data fallback:', e.message);
    }
  }

  const overview = academicData?.overview || `
    খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের যুগোপযোগী শিক্ষাক্রম এবং ইসলামী আরবি বিশ্ববিদ্যালয়ের নির্ধারিত সিলেবাসের আলোকে পাঠদান পরিচালনা করে। এখানে ধর্মীয় অনুশাসনের সাথে আধুনিক জ্ঞান-বিজ্ঞানের নিবিড় সংযোগ ঘটানো হয়েছে।
  `;

  container.innerHTML = `
    <!-- Hero Banner -->
    <div class="mb-12 text-center max-w-3xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">পাঠ্যক্রম ও শিক্ষাদান পদ্ধতি</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">একাডেমিক কার্যক্রম ও শিক্ষা ব্যবস্থা</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        কুরআন, হাদিস, আরবি ভাষা, ইসলামিক স্টাডিজ ও সমকালীন আধুনিক শিক্ষার সমন্বিত শিক্ষাক্রম
      </p>
    </div>

    <!-- Academic Overview -->
    <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-10 space-y-4">
      <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
        <span>একাডেমিক রূপরেখা</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold text-[#072e10]">শিক্ষা ব্যবস্থার সারসংক্ষেপ</h2>
      <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
        ${overview}
      </p>
    </div>

    <!-- Education System (Tier by Tier) -->
    <div class="mb-12 space-y-6">
      <div class="flex items-center justify-between border-b border-stone-200 pb-3">
        <h3 class="text-lg font-bold text-[#072e10] flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#0B4619]"></span>
          <span>শিক্ষা স্তর ও বিভাগীয় তথ্য (Education System)</span>
        </h3>
        <a href="/departments.html" class="text-xs font-semibold text-[#0B4619] hover:underline">বিভাগসমূহ দেখুন →</a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 1. Ibtedayee -->
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-[#0B4619] border border-emerald-200">
              প্রাথমিক স্তর
            </span>
            <span class="text-xs text-stone-500 font-mono">১ম - ৫ম শ্রেণী</span>
          </div>
          <h4 class="text-base font-bold text-slate-800">ইবতেদায়ী স্তর (Ebtedayee Level)</h4>
          <p class="text-xs text-stone-600 leading-relaxed">
            কুরআন মাজিদ নাজেরা ও হিফজুল কুরআন পরিচিতি, আকাইদ ও ফিকহ, বাংলা, ইংরেজি, গণিত, পরিবেশ পরিচিতি ও প্রাথমিক সাধারণ জ্ঞান।
          </p>
          <div class="pt-2 text-xs font-medium text-emerald-800">
            সমাপনী: প্রাথমিক ইবতেদায়ী শিক্ষা সমাপনী পরীক্ষা (মাদ্রাসা শিক্ষা বোর্ড)
          </div>
        </div>

        <!-- 2. Dakhil -->
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-[#0B4619] border border-emerald-200">
              মাধ্যমিক স্তর (এসএসসি সমমান)
            </span>
            <span class="text-xs text-stone-500 font-mono">৬ষ্ঠ - ১০ম শ্রেণী</span>
          </div>
          <h4 class="text-base font-bold text-slate-800">দাখিল স্তর (Dakhil Level)</h4>
          <p class="text-xs text-stone-600 leading-relaxed">
            কুরআন মাজিদ ও তাজবিদ, হাদিস শরিফ, আরবি ১ম ও ২য় পত্র, ফিকহ ও উসুলুল ফিকহ, বাংলা, ইংরেজি, গণিত, বিজ্ঞান (পদার্থ, রসায়ন, জীববিজ্ঞান ও আইসিটি)।
          </p>
          <div class="pt-2 text-xs font-medium text-emerald-800">
            বিভাগ: সাধারণ ও বিজ্ঞান বিভাগ
          </div>
        </div>

        <!-- 3. Alim -->
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-[#0B4619] border border-emerald-200">
              উচ্চ মাধ্যমিক স্তর (এইচএসসি সমমান)
            </span>
            <span class="text-xs text-stone-500 font-mono">একাদশ - দ্বাদশ শ্রেণী</span>
          </div>
          <h4 class="text-base font-bold text-slate-800">আলিম স্তর (Alim Level)</h4>
          <p class="text-xs text-stone-600 leading-relaxed">
            কুরআন তাফসির, হাদিস উসুল, বালাগাত ও মানতিক, আরবি সাহিত্য, উচ্চতর গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও তথ্য ও যোগাযোগ প্রযুক্তি।
          </p>
          <div class="pt-2 text-xs font-medium text-emerald-800">
            বোর্ড: বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড, ঢাকা
          </div>
        </div>

        <!-- 4. Fazil Degree -->
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3 border-t-4 border-t-[#d4af37]">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
              স্নাতক স্তর (ডিগ্রী পাস)
            </span>
            <span class="text-xs text-stone-500 font-mono">৩ বছর মেয়াদী পাস কোর্স</span>
          </div>
          <h4 class="text-base font-bold text-slate-800">ফাজিল (ডিগ্রী) স্তর (Fazil Degree Level)</h4>
          <p class="text-xs text-stone-600 leading-relaxed">
            আল-কুরআন অ্যান্ড ইসলামিক স্টাডিজ, দাওয়াহ অ্যান্ড ইসলামিক স্টাডিজ, আরবি ভাষা ও সাহিত্য, রাষ্ট্রবিজ্ঞান, অর্থনীতি ও ইসলামি ইতিহাস।
          </p>
          <div class="pt-2 text-xs font-bold text-[#0B4619]">
            অধিভুক্ত: ইসলামী আরবি বিশ্ববিদ্যালয়, ঢাকা
          </div>
        </div>
      </div>
    </div>

    <!-- Academic Calendar -->
    <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-10 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 class="text-lg font-bold text-[#072e10] flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span>বার্ষিক একাডেমিক ক্যালেন্ডার ২০২৬</span>
          </h3>
          <p class="text-xs text-stone-500 mt-0.5">মাদ্রাসা শিক্ষা বোর্ড ও প্রাতিষ্ঠানিক ছুটির তালিকা ও পরীক্ষার সময়সূচি</p>
        </div>
        <a href="/downloads.html" class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-semibold rounded-lg shadow-2xs transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>ক্যালেন্ডার PDF ডাউনলোড</span>
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left">
          <thead class="bg-stone-50 text-stone-700 uppercase font-semibold border-b border-stone-200">
            <tr>
              <th class="py-3 px-4">কার্যক্রম / পর্ব</th>
              <th class="py-3 px-4">সময়কাল</th>
              <th class="py-3 px-4">বিবরণ / স্তর</th>
              <th class="py-3 px-4 text-center">স্থিতি</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 text-stone-600">
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-4 font-bold text-slate-800">শিক্ষাবর্ষ শুরু ও ভর্তি</td>
              <td class="py-3.5 px-4">জানুয়ারি</td>
              <td class="py-3.5 px-4">ইবতেদায়ী, দাখিল ও আলিম শ্রেণীতে নতুন ভর্তি ও পাঠদান আরম্ভ</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 bg-emerald-100 text-[#0B4619] rounded text-[11px] font-bold">সম্পন্ন</span></td>
            </tr>
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-4 font-bold text-slate-800">পবিত্র মাহে রমজান ও ঈদুল ফিতর ছুটি</td>
              <td class="py-3.5 px-4">মার্চ - এপ্রিল</td>
              <td class="py-3.5 px-4">সরকারি ও বোর্ড নির্দেশিত প্রাতিষ্ঠানিক অবকাশ</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[11px] font-bold">নির্ধারিত</span></td>
            </tr>
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-4 font-bold text-slate-800">অর্ধবার্ষিক / ১ম সাময়িক পরীক্ষা</td>
              <td class="py-3.5 px-4">জুন</td>
              <td class="py-3.5 px-4">১ম শ্রেণী থেকে দাখিল ৯ম ও আলিম ১ম বর্ষের মূল্যায়ন পরীক্ষা</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px] font-bold">আসন্ন</span></td>
            </tr>
            <tr class="hover:bg-emerald-50/40 transition">
              <td class="py-3.5 px-4 font-bold text-slate-800">বার্ষিক পরীক্ষা ও ফলাফল প্রকাশ</td>
              <td class="py-3.5 px-4">নভেম্বর - ডিসেম্বর</td>
              <td class="py-3.5 px-4">চূড়ান্ত মূল্যায়ন ও পরবর্তী ক্লাসে উত্তীর্ণের ফলাফল বিবরণী</td>
              <td class="py-3.5 px-4 text-center"><span class="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-bold">নির্ধারিত</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
