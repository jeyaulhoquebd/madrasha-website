/**
 * Results Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Search, Year & Exam Filters, Verified Public Results, PDF Downloads
 * Strict privacy: Never exposes private student records.
 */

import { db, collection, getDocs, query, orderBy, where } from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';

let allResults = [];
let filteredResults = [];
let selectedYear = 'all';
let selectedExam = 'all';

export async function initResultsPage() {
  const container = document.getElementById('results-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">অফিসিয়াল মূল্যায়ন</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">পরীক্ষার ফলাফল ও মেধা তালিকা</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        মাদ্রাসা শিক্ষা বোর্ড ও অভ্যন্তরীণ সেমিস্টার পরীক্ষার অনুমোদিত সার্বিক ফলাফল ও বিজ্ঞপ্তি
      </p>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs mb-8 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">শিক্ষাবর্ষ</label>
          <select id="result-year-select" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-stone-50 focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden">
            <option value="all">সকল শিক্ষাবর্ষ</option>
            <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
            <option value="2024">২০২৪ শিক্ষাবর্ষ</option>
            <option value="2023">২০২৩ শিক্ষাবর্ষ</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">পরীক্ষার ধরন</label>
          <select id="result-exam-select" class="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-stone-50 focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden">
            <option value="all">সকল পরীক্ষা</option>
            <option value="দাখিল">দাখিল পরীক্ষা (বোর্ড)</option>
            <option value="আলিম">আলিম পরীক্ষা (বোর্ড)</option>
            <option value="ফাজিল">ফাজিল (ডিগ্রী) পরীক্ষা</option>
            <option value="বার্ষিক">বার্ষিক মূল্যায়ন পরীক্ষা</option>
            <option value="অর্ধবার্ষিক">অর্ধবার্ষিক / সাময়িক পরীক্ষা</option>
          </select>
        </div>

        <div class="flex items-end">
          <div class="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200/80 w-full flex items-center gap-2">
            <svg class="w-4 h-4 text-[#0B4619] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>শুধুমাত্র প্রাতিষ্ঠানিক অনুমোদিত ফলাফল প্রকাশিত।</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Results List Slot -->
    <div id="results-list-slot" class="space-y-4">
      <div class="py-12 text-center text-stone-400">ফলাফল লোড হচ্ছে...</div>
    </div>
  `;

  // Fetch results from Firestore
  allResults = [];
  if (db) {
    try {
      const q = query(collection(db, 'results'), where('isPublished', '==', true), orderBy('publishedAt', 'desc'));
      const snap = await getDocs(q);
      snap.forEach(d => allResults.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Results query notice:', e.message);
    }
  }

  // Setup event listeners
  const yearSelect = document.getElementById('result-year-select');
  const examSelect = document.getElementById('result-exam-select');

  yearSelect?.addEventListener('change', (e) => {
    selectedYear = e.target.value;
    applyResultFilters();
  });

  examSelect?.addEventListener('change', (e) => {
    selectedExam = e.target.value;
    applyResultFilters();
  });

  applyResultFilters();
}

function applyResultFilters() {
  filteredResults = allResults.filter(r => {
    const matchesYear = selectedYear === 'all' || (r.year && String(r.year) === selectedYear);
    const matchesExam = selectedExam === 'all' || (r.examType && r.examType.includes(selectedExam));
    return matchesYear && matchesExam;
  });

  renderResultsList();
}

function renderResultsList() {
  const listSlot = document.getElementById('results-list-slot');
  if (!listSlot) return;

  if (filteredResults.length === 0) {
    listSlot.innerHTML = renderEmptyState({
      title: 'বর্তমানে কোনো পরীক্ষার ফলাফল প্রকাশিত হয়নি',
      message: 'মাদ্রাসার বোর্ড পরীক্ষা বা অভ্যন্তরীণ বার্ষিক পরীক্ষার ফলাফল প্রশাসনিকভাবে অনুমোদনের পর এখানে প্রকাশ করা হবে। ফলাফল প্রকাশের পর তা সরাসরি ডাউনলোড করা যাবে।',
      icon: 'document'
    });
    return;
  }

  listSlot.innerHTML = filteredResults.map(result => `
    <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md hover:border-[#0B4619] transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0B4619] text-amber-300">
            ${result.examType || 'বার্ষিক পরীক্ষা'}
          </span>
          <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-stone-100 text-stone-700 font-mono">
            বর্ষ: ${result.year || '২০২৫'}
          </span>
          <span class="text-xs text-stone-500">
            প্রকাশ: ${formatBengaliDate(result.publishedAt)}
          </span>
        </div>

        <h3 class="text-base sm:text-lg font-bold text-slate-800">
          ${result.title || `${result.examType} - সার্বিক ফলাফল ও উত্তীর্ণ তালিকা`}
        </h3>

        ${result.remarks ? `
          <p class="text-xs text-stone-600">${result.remarks}</p>
        ` : ''}
      </div>

      <div class="flex items-center gap-3 self-end sm:self-center">
        ${result.fileUrl ? `
          <a href="${result.fileUrl}" target="_blank" download class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-bold rounded-xl shadow-xs transition flex-shrink-0">
            <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>ফলাফল PDF ডাউনলোড</span>
          </a>
        ` : `
          <span class="text-xs text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
            নথি সংরক্ষিত
          </span>
        `}
      </div>
    </div>
  `).join('');
}
