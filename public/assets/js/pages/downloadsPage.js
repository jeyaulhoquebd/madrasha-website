/**
 * Download Center Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Category Filters & Real Firestore Integration for Admission Forms, Syllabus & Documents
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';

let allFiles = [];
let filteredFiles = [];
let selectedCategory = 'all';
let searchQuery = '';

export async function initDownloadsPage() {
  const container = document.getElementById('downloads-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">ফরম ও নির্দেশিকা</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">ডাউনলোড সেন্টার</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        ভর্তি ফরম, পাঠ্যক্রম, পরীক্ষার সিলেবাস ও প্রয়োজনীয় প্রাতিষ্ঠানিক ডকুমেন্টস
      </p>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs mb-8 space-y-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <input 
            type="text" 
            id="download-search-input"
            placeholder="ফাইলের নাম বা বিবরণ লিখে খুঁজুন..." 
            class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B4619] focus:bg-white transition"
          />
          <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="text-xs text-stone-500 font-medium">
          মোট ফাইল: <span id="download-count" class="font-bold text-[#0B4619]">০</span> টি
        </div>
      </div>

      <!-- Categories Pills -->
      <div class="flex flex-wrap gap-2 pt-2 border-t border-stone-100 text-xs font-semibold" id="download-category-filters">
        <button data-cat="all" class="px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs">
          সকল ফাইল
        </button>
        <button data-cat="admission" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          ভর্তি সংক্রান্ত ফরম (Admission Forms)
        </button>
        <button data-cat="syllabus" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          সিলেবাস ও পাঠ্যপরিকল্পনা (Syllabus)
        </button>
        <button data-cat="academic" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          একাডেমিক ডকুমেন্টস (Academic)
        </button>
        <button data-cat="exam" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          পরীক্ষা সংক্রান্ত নথি (Exam Docs)
        </button>
        <button data-cat="other" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          অন্যান্য আদেশ ও ফরম
        </button>
      </div>
    </div>

    <!-- Downloads Table / Grid Slot -->
    <div id="downloads-grid-slot" class="space-y-4">
      <div class="py-12 text-center text-stone-400">ফাইল লোড হচ্ছে...</div>
    </div>
  `;

  // Fetch from Firestore
  allFiles = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'downloads'), orderBy('createdAt', 'desc')));
      snap.forEach(d => allFiles.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Downloads query notice:', e.message);
    }
  }

  // Setup Event Listeners
  const searchInput = document.getElementById('download-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyDownloadFilters();
  });

  const filterBtns = document.querySelectorAll('#download-category-filters button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.className = 'px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]');
      btn.className = 'px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs';
      selectedCategory = btn.getAttribute('data-cat');
      applyDownloadFilters();
    });
  });

  applyDownloadFilters();
}

function applyDownloadFilters() {
  filteredFiles = allFiles.filter(f => {
    const matchesCat = selectedCategory === 'all' || 
      (f.category && f.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch = !searchQuery || 
      (f.title && f.title.toLowerCase().includes(searchQuery)) ||
      (f.description && f.description.toLowerCase().includes(searchQuery));

    return matchesCat && matchesSearch;
  });

  const countEl = document.getElementById('download-count');
  if (countEl) countEl.textContent = filteredFiles.length;

  renderDownloads();
}

function renderDownloads() {
  const gridSlot = document.getElementById('downloads-grid-slot');
  if (!gridSlot) return;

  if (filteredFiles.length === 0) {
    gridSlot.innerHTML = renderEmptyState({
      title: 'বর্তমানে কোনো ডাউনলোড ফাইল নেই',
      message: 'প্রশাসনিকভাবে ভর্তি ফরম, সিলেবাস বা প্রাতিষ্ঠানিক নির্দেশিকা আপলোড করার পর সরাসরি এখান থেকে ডাউনলোড করা যাবে।',
      icon: 'folder'
    });
    return;
  }

  const categoryLabels = {
    admission: 'ভর্তি ফরম',
    syllabus: 'সিলেবাস',
    academic: 'একাডেমিক নথি',
    exam: 'পরীক্ষা সংক্রান্ত',
    other: 'সাধারণ'
  };

  gridSlot.innerHTML = filteredFiles.map(file => `
    <div class="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#0B4619] transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B4619] flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#0B4619] text-amber-300">
              ${categoryLabels[file.category] || file.category || 'ডকুমেন্ট'}
            </span>
            <span class="text-xs text-stone-400">
              ${file.fileSize || 'PDF'}
            </span>
            ${file.createdAt ? `
              <span class="text-xs text-stone-400">• ${formatBengaliDate(file.createdAt)}</span>
            ` : ''}
          </div>
          <h3 class="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            ${file.title}
          </h3>
          ${file.description ? `
            <p class="text-xs text-stone-500">${file.description}</p>
          ` : ''}
        </div>
      </div>

      <div class="self-end sm:self-center">
        <a href="${file.fileUrl || '#'}" target="_blank" download class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-bold rounded-xl shadow-xs transition">
          <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>ডাউনলোড করুন</span>
        </a>
      </div>
    </div>
  `).join('');
}
