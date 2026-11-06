/**
 * Staff Directory Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Search, Pagination & Real Firestore Integration for Administrative & Support Staff
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { OFFICIAL_LOGO_URL } from './home.js';
import { renderPagination, initPagination } from '../components/pagination.js';
import { renderEmptyState } from '../components/emptyState.js';

let allStaff = [];
let filteredStaff = [];
let currentPage = 1;
const itemsPerPage = 8;
let searchQuery = '';

export async function initStaffPage() {
  const container = document.getElementById('staff-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">প্রশাসনিক ও সহায়ক টিম</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">কর্মকর্তা ও কর্মচারীবৃন্দ</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        মাদ্রাসার প্রশাসনিক কার্যক্রম, অফিস ব্যবস্থাপনা ও ক্যাম্পাস রক্ষণাবেক্ষণে নিয়োজিত কর্মকর্তা ও কর্মচারীবৃন্দ
      </p>
    </div>

    <!-- Search Toolbar -->
    <div class="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <input 
          type="text" 
          id="staff-search-input"
          placeholder="কর্মকর্তা বা কর্মচারীর নাম বা পদবি লিখে খুঁজুন..." 
          class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B4619] focus:bg-white transition"
        />
        <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div class="text-xs text-stone-500 font-medium">
        মোট কর্মকর্তা-কর্মচারী: <span id="staff-count" class="font-bold text-[#0B4619]">০</span> জন
      </div>
    </div>

    <!-- Staff Grid -->
    <div id="staff-grid-slot" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="col-span-full py-12 text-center text-stone-400">কর্মচারী তালিকা লোড হচ্ছে...</div>
    </div>

    <!-- Pagination Slot -->
    <div id="staff-pagination-slot" class="mt-8"></div>
  `;

  // Fetch from Firestore
  allStaff = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'staff'), orderBy('displayOrder', 'asc')));
      snap.forEach(d => allStaff.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Staff query notice:', e.message);
    }
  }

  const searchInput = document.getElementById('staff-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    currentPage = 1;
    applyFilters();
  });

  applyFilters();
}

function applyFilters() {
  filteredStaff = allStaff.filter(s => {
    return !searchQuery || 
      (s.name && s.name.toLowerCase().includes(searchQuery)) ||
      (s.designation && s.designation.toLowerCase().includes(searchQuery)) ||
      (s.section && s.section.toLowerCase().includes(searchQuery));
  });

  const countEl = document.getElementById('staff-count');
  if (countEl) countEl.textContent = filteredStaff.length;

  renderStaffGrid();
}

function renderStaffGrid() {
  const gridSlot = document.getElementById('staff-grid-slot');
  const paginationSlot = document.getElementById('staff-pagination-slot');
  if (!gridSlot) return;

  if (filteredStaff.length === 0) {
    gridSlot.innerHTML = `
      <div class="col-span-full">
        ${renderEmptyState({
          title: 'কর্মকর্তা ও কর্মচারীবৃন্দের অনুমোদিত তালিকা প্রক্রিয়াধীন',
          message: 'মাদ্রাসার অফিস সহকারী, হিসাবরক্ষক ও সহায়ক কর্মচারীবৃন্দের তথ্য প্রশাসনিকভাবে ডাটাবেজে অন্তর্ভুক্তির প্রক্রিয়া চলছে। দ্রুতই পূর্ণ তালিকা প্রকাশ করা হবে।',
          icon: 'users'
        })}
      </div>
    `;
    if (paginationSlot) paginationSlot.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  gridSlot.innerHTML = pageItems.map(s => `
    <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#0B4619] transition duration-300 flex flex-col justify-between group p-6 text-center space-y-3">
      <div>
        <div class="w-20 h-20 mx-auto rounded-full bg-stone-100 ring-2 ring-emerald-300 overflow-hidden shadow-xs mb-3 group-hover:scale-105 transition">
          <img src="${s.photoUrl || OFFICIAL_LOGO_URL}" alt="${s.name}" class="w-full h-full object-cover">
        </div>
        <h3 class="font-bold text-base text-slate-800 group-hover:text-[#0B4619] transition">${s.name}</h3>
        <p class="text-xs font-semibold text-[#0B4619] mt-0.5">${s.designation || 'অফিস সহকারী'}</p>
        <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
          ${s.section || 'সাধারণ প্রশাসন'}
        </span>
      </div>

      <div class="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
        <span>কর্মকর্তা</span>
        <span class="text-emerald-800 font-semibold font-mono">আইডি: #${s.id.slice(0, 5)}</span>
      </div>
    </div>
  `).join('');

  if (paginationSlot) {
    paginationSlot.innerHTML = renderPagination({
      currentPage,
      totalPages,
      containerId: 'staff-pagination-controls'
    });

    initPagination('staff-pagination-controls', (newPage) => {
      currentPage = newPage;
      renderStaffGrid();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    });
  }
}
