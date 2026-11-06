/**
 * Notice Board Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Category Filter, Search, Table & Card View, Pagination & Real Firestore Integration
 */

import { db, collection, getDocs, query, orderBy, where } from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { renderPagination, initPagination } from '../components/pagination.js';
import { renderEmptyState } from '../components/emptyState.js';

let allNotices = [];
let filteredNotices = [];
let currentPage = 1;
const itemsPerPage = 8;
let selectedCategory = 'all';
let searchQuery = '';

export async function initNoticesPage() {
  const container = document.getElementById('notices-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">অফিসিয়াল বিজ্ঞপ্তি</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">প্রাতিষ্ঠানিক নোটিশ বোর্ড</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        মাদ্রাসার সকল পরীক্ষা, ভর্তি, ছুটি, সরকারি নির্দেশনা ও প্রাতিষ্ঠানিক আদেশ
      </p>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs mb-8 space-y-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <input 
            type="text" 
            id="notice-search-input"
            placeholder="নোটিশের শিরোনাম বা বিষয়বস্তু লিখে খুঁজুন..." 
            class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B4619] focus:bg-white transition"
          />
          <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="text-xs text-stone-500 font-medium">
          মোট নোটিশ: <span id="notice-count" class="font-bold text-[#0B4619]">০</span> টি
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap gap-2 pt-2 border-t border-stone-100 text-xs font-semibold" id="notice-category-filters">
        <button data-cat="all" class="px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs">
          সকল নোটিশ
        </button>
        <button data-cat="পরীক্ষা" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          পরীক্ষা সংক্রান্ত
        </button>
        <button data-cat="ভর্তি" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          ভর্তি সংক্রান্ত
        </button>
        <button data-cat="ছুটি" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          ছুটির নোটিশ
        </button>
        <button data-cat="সাধারণ" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          সাধারণ প্রশাসনিক
        </button>
      </div>
    </div>

    <!-- Notices List / Cards Slot -->
    <div id="notices-list-slot" class="space-y-4">
      <div class="py-12 text-center text-stone-400">নোটিশ লোড হচ্ছে...</div>
    </div>

    <!-- Pagination Slot -->
    <div id="notices-pagination-slot" class="mt-8"></div>
  `;

  // Fetch notices from Firestore
  allNotices = [];
  if (db) {
    try {
      const q = query(
        collection(db, 'notices'),
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc')
      );
      const snap = await getDocs(q);
      snap.forEach(d => allNotices.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Notices query notice:', e.message);
    }
  }

  // Setup Listeners
  const searchInput = document.getElementById('notice-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    currentPage = 1;
    applyNoticeFilters();
  });

  const filterBtns = document.querySelectorAll('#notice-category-filters button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.className = 'px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]');
      btn.className = 'px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs';
      selectedCategory = btn.getAttribute('data-cat');
      currentPage = 1;
      applyNoticeFilters();
    });
  });

  applyNoticeFilters();
}

function applyNoticeFilters() {
  filteredNotices = allNotices.filter(n => {
    const matchesCat = selectedCategory === 'all' || 
      (n.category && n.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch = !searchQuery || 
      (n.title && n.title.toLowerCase().includes(searchQuery)) ||
      (n.content && n.content.toLowerCase().includes(searchQuery));

    return matchesCat && matchesSearch;
  });

  const countEl = document.getElementById('notice-count');
  if (countEl) countEl.textContent = filteredNotices.length;

  renderNoticesList();
}

function renderNoticesList() {
  const listSlot = document.getElementById('notices-list-slot');
  const paginationSlot = document.getElementById('notices-pagination-slot');
  if (!listSlot) return;

  if (filteredNotices.length === 0) {
    listSlot.innerHTML = `
      <div>
        ${renderEmptyState({
          title: 'বর্তমানে কোনো নোটিশ পাওয়া যায়নি',
          message: 'মাদ্রাসার প্রশাসনিক নোটিশ যুক্ত করা হলে বা নতুন কোনো সার্কুলার প্রকাশিত হলে সরাসরি এই তালিকায় তা প্রদর্শিত হবে।',
          icon: 'bell'
        })}
      </div>
    `;
    if (paginationSlot) paginationSlot.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  listSlot.innerHTML = pageItems.map(notice => `
    <div class="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#0B4619] transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      
      <!-- Date & Badge Left Block -->
      <div class="flex items-start sm:items-center gap-4 flex-1">
        <div class="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-stone-50 border border-stone-200 text-center flex-shrink-0 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition">
          <span class="text-xs font-bold text-[#0B4619]">${notice.publishedAt ? formatBengaliDate(notice.publishedAt).split(' ')[0] : '০১'}</span>
          <span class="text-[10px] text-stone-500">${notice.publishedAt ? formatBengaliDate(notice.publishedAt).split(' ')[1] : 'তারিখ'}</span>
        </div>

        <div class="space-y-1.5 flex-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#0B4619] text-amber-300">
              ${notice.category || 'সাধারণ'}
            </span>
            <span class="text-xs text-stone-500 sm:hidden">
              ${formatBengaliDate(notice.publishedAt)}
            </span>
          </div>

          <h3 class="text-sm sm:text-base font-bold text-slate-800 group-hover:text-[#0B4619] transition leading-snug">
            <a href="/notice-details.html?id=${notice.id}">
              ${notice.title}
            </a>
          </h3>

          ${notice.summary ? `
            <p class="text-xs text-stone-500 line-clamp-1">${notice.summary}</p>
          ` : ''}
        </div>
      </div>

      <!-- Action Buttons Right Block -->
      <div class="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
        ${notice.fileUrl ? `
          <a href="${notice.fileUrl}" target="_blank" download class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 hover:border-emerald-300 text-stone-600 hover:text-[#0B4619] text-xs font-semibold bg-stone-50 hover:bg-emerald-50 transition" title="সংযুক্ত ফাইল ডাউনলোড">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>পিডিএফ</span>
          </a>
        ` : ''}

        <a href="/notice-details.html?id=${notice.id}" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-bold transition shadow-xs">
          <span>বিস্তারিত দেখুন</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </a>
      </div>

    </div>
  `).join('');

  if (paginationSlot) {
    paginationSlot.innerHTML = renderPagination({
      currentPage,
      totalPages,
      containerId: 'notices-pagination-controls'
    });

    initPagination('notices-pagination-controls', (newPage) => {
      currentPage = newPage;
      renderNoticesList();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  }
}
