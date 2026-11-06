/**
 * Routines Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads Class Routines and Examination Routines from Firestore with PDF downloads
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';

let allRoutines = [];
let activeTab = 'class'; // 'class' | 'exam'

export async function initRoutinesPage() {
  const container = document.getElementById('routines-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">সময়সূচি ও রুটিন</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">ক্লাস ও পরীক্ষা রুটিন</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        চলতি শিক্ষাবর্ষের সকল শ্রেণীর নিয়মিত ক্লাস এবং আসন্ন পরীক্ষার সংশোধিত সময়সূচি
      </p>
    </div>

    <!-- Tab Selector -->
    <div class="flex justify-center mb-8">
      <div class="bg-stone-200/80 p-1.5 rounded-2xl flex space-x-1 rtl:space-x-reverse max-w-md w-full">
        <button id="tab-class-btn" class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-[#072e10] shadow-xs">
          📅 ক্লাস রুটিন (Class Routines)
        </button>
        <button id="tab-exam-btn" class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-stone-600 hover:text-[#0B4619]">
          📝 পরীক্ষার রুটিন (Exam Routines)
        </button>
      </div>
    </div>

    <!-- Routine Grid Slot -->
    <div id="routines-grid-slot" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="col-span-full py-12 text-center text-stone-400">রুটিন লোড হচ্ছে...</div>
    </div>
  `;

  // Fetch from Firestore
  allRoutines = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'routines'), orderBy('createdAt', 'desc')));
      snap.forEach(d => allRoutines.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Routines query notice:', e.message);
    }
  }

  // Setup Tab Listeners
  const classBtn = document.getElementById('tab-class-btn');
  const examBtn = document.getElementById('tab-exam-btn');

  classBtn?.addEventListener('click', () => {
    activeTab = 'class';
    classBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-[#072e10] shadow-xs';
    examBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-stone-600 hover:text-[#0B4619]';
    renderRoutines();
  });

  examBtn?.addEventListener('click', () => {
    activeTab = 'exam';
    examBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-[#072e10] shadow-xs';
    classBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-stone-600 hover:text-[#0B4619]';
    renderRoutines();
  });

  renderRoutines();
}

function renderRoutines() {
  const gridSlot = document.getElementById('routines-grid-slot');
  if (!gridSlot) return;

  const filtered = allRoutines.filter(r => (r.type || 'class') === activeTab);

  if (filtered.length === 0) {
    gridSlot.innerHTML = `
      <div class="col-span-full">
        ${renderEmptyState({
          title: activeTab === 'class' ? 'ক্লাস রুটিন হালনাগাদ করা হচ্ছে' : 'পরীক্ষার রুটিন অপেক্ষমান',
          message: activeTab === 'class' 
            ? 'চলতি শিক্ষাবর্ষের সংশোধিত ক্লাস রুটিন প্রশাসনিক অনুমোদনের পর এখানে আপলোড করা হবে।' 
            : 'আসন্ন পরীক্ষার রুটিন প্রকাশের পর এখান থেকে সরাসরি ডাউনলোড করা যাবে।',
          icon: 'calendar'
        })}
      </div>
    `;
    return;
  }

  gridSlot.innerHTML = filtered.map(item => `
    <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md hover:border-[#0B4619] transition duration-300 flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'exam' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-[#0B4619] border border-emerald-200'}">
            ${activeTab === 'exam' ? 'পরীক্ষার সময়সূচি' : 'নিয়মিত ক্লাস রুটিন'}
          </span>
          <span class="text-[11px] text-stone-400 font-mono">
            ${item.effectiveDate ? `কার্যকর: ${formatBengaliDate(item.effectiveDate)}` : 'চলতি সেশন'}
          </span>
        </div>

        <h3 class="font-bold text-base text-slate-800 leading-snug">
          ${item.title}
        </h3>

        <div class="text-xs text-stone-600 space-y-1">
          ${item.className ? `<p><strong>শ্রেণী / বিভাগ:</strong> ${item.className}</p>` : ''}
          ${item.session ? `<p><strong>সেশন:</strong> ${item.session}</p>` : ''}
        </div>
      </div>

      <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
        ${item.fileUrl ? `
          <a href="${item.fileUrl}" target="_blank" download class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-bold rounded-xl shadow-xs transition">
            <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>রুটিন PDF ডাউনলোড</span>
          </a>
        ` : `
          <span class="text-xs text-stone-400">রুটিন সংরক্ষিত</span>
        `}
      </div>
    </div>
  `).join('');
}
