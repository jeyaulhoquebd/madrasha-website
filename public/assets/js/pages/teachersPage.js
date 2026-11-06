/**
 * Teachers Directory Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Search, Department Filters, Pagination & Real Firestore Integration
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { OFFICIAL_LOGO_URL } from './home.js';
import { renderPagination, initPagination } from '../components/pagination.js';
import { renderEmptyState } from '../components/emptyState.js';

let allTeachers = [];
let filteredTeachers = [];
let currentPage = 1;
const itemsPerPage = 8;
let selectedDepartment = 'all';
let searchQuery = '';

export async function initTeachersPage() {
  const container = document.getElementById('teachers-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">সম্মানিত অনুষদ</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">শিক্ষক মণ্ডলী ডিরেক্টরি</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        কুরআন, হাদিস, আরবি সাহিত্য ও সাধারণ বিজ্ঞানের অভিজ্ঞ ও নিষ্ঠাবান শিক্ষক মণ্ডলী
      </p>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs mb-8 space-y-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <input 
            type="text" 
            id="teacher-search-input"
            placeholder="শিক্ষকের নাম, পদবি বা বিষয় লিখে খুঁজুন..." 
            class="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B4619] focus:bg-white transition"
          />
          <svg class="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div class="text-xs text-stone-500 font-medium">
          মোট শিক্ষক: <span id="teacher-count" class="font-bold text-[#0B4619]">০</span> জন
        </div>
      </div>

      <!-- Department Filter Pills -->
      <div class="flex flex-wrap gap-2 pt-2 border-t border-stone-100 text-xs font-semibold" id="teacher-department-filters">
        <button data-dept="all" class="px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs">
          সকল বিভাগ
        </button>
        <button data-dept="কুরআন ও হাদিস" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          কুরআন ও হাদিস বিভাগ
        </button>
        <button data-dept="আরবি ভাষা" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          আরবি ভাষা ও সাহিত্য
        </button>
        <button data-dept="বিজ্ঞান" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          বিজ্ঞান ও গণিত শাখা
        </button>
        <button data-dept="সাধারণ" class="px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]">
          মানবিক ও সাধারণ শাখা
        </button>
      </div>
    </div>

    <!-- Teachers Grid -->
    <div id="teachers-grid-slot" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="col-span-full py-12 text-center text-stone-400">শিক্ষক তালিকা লোড হচ্ছে...</div>
    </div>

    <!-- Pagination Slot -->
    <div id="teachers-pagination-slot" class="mt-8"></div>
  `;

  // Fetch teachers from Firestore
  allTeachers = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'teachers'), orderBy('displayOrder', 'asc')));
      snap.forEach(d => allTeachers.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Teachers query notice:', e.message);
    }
  }

  // Setup Event Listeners
  const searchInput = document.getElementById('teacher-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    currentPage = 1;
    applyFilters();
  });

  const filterBtns = document.querySelectorAll('#teacher-department-filters button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.className = 'px-3.5 py-1.5 rounded-lg transition bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#0B4619]');
      btn.className = 'px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs';
      selectedDepartment = btn.getAttribute('data-dept');
      currentPage = 1;
      applyFilters();
    });
  });

  applyFilters();
}

function applyFilters() {
  filteredTeachers = allTeachers.filter(teacher => {
    const matchesDept = selectedDepartment === 'all' || 
      (teacher.department && teacher.department.toLowerCase().includes(selectedDepartment.toLowerCase()));
    
    const matchesSearch = !searchQuery || 
      (teacher.name && teacher.name.toLowerCase().includes(searchQuery)) ||
      (teacher.designation && teacher.designation.toLowerCase().includes(searchQuery)) ||
      (teacher.subject && teacher.subject.toLowerCase().includes(searchQuery));

    return matchesDept && matchesSearch;
  });

  const countEl = document.getElementById('teacher-count');
  if (countEl) countEl.textContent = filteredTeachers.length;

  renderTeachersGrid();
}

function renderTeachersGrid() {
  const gridSlot = document.getElementById('teachers-grid-slot');
  const paginationSlot = document.getElementById('teachers-pagination-slot');
  if (!gridSlot) return;

  if (filteredTeachers.length === 0) {
    gridSlot.innerHTML = `
      <div class="col-span-full">
        ${renderEmptyState({
          title: 'শিক্ষক মণ্ডলীর অনুমোদিত তালিকা প্রক্রিয়াধীন',
          message: 'মাদ্রাসার সম্মানিত শিক্ষকদের হালনাগাদ প্রোফাইল ও তথ্যাবলি প্রশাসনিক অনুমোদনের পর ডাটাবেজে অন্তর্ভুক্ত করা হচ্ছে। খুব শীঘ্রই সম্পূর্ণ তালিকা প্রকাশ করা হবে।',
          icon: 'users'
        })}
      </div>
    `;
    if (paginationSlot) paginationSlot.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

  gridSlot.innerHTML = pageItems.map(teacher => `
    <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#0B4619] transition duration-300 flex flex-col justify-between group">
      <div>
        <!-- Photo Container -->
        <div class="p-6 pb-2 text-center bg-gradient-to-b from-stone-50 to-white">
          <div class="w-24 h-24 mx-auto rounded-full bg-white ring-4 ring-[#d4af37]/40 shadow-md overflow-hidden group-hover:scale-105 transition duration-300">
            <img 
              src="${teacher.photoUrl || OFFICIAL_LOGO_URL}" 
              alt="${teacher.name}" 
              class="w-full h-full object-cover"
            />
          </div>
          <span class="inline-block mt-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#0B4619] border border-emerald-200">
            ${teacher.department || 'অনুমোদিত অনুষদ'}
          </span>
        </div>

        <!-- Info Area -->
        <div class="p-5 pt-1 text-center space-y-2">
          <h3 class="font-bold text-base text-slate-800 group-hover:text-[#0B4619] transition leading-tight">
            ${teacher.name}
          </h3>
          <p class="text-xs font-semibold text-[#0B4619]">
            ${teacher.designation || 'সহকারী শিক্ষক'}
          </p>

          <div class="pt-2 text-[11px] text-stone-600 space-y-1 border-t border-stone-100 text-left">
            ${teacher.qualifications ? `
              <p><strong class="text-slate-700">শিক্ষাগত যোগ্যতা:</strong> ${teacher.qualifications}</p>
            ` : ''}
            ${teacher.subject ? `
              <p><strong class="text-slate-700">পাঠদানের বিষয়:</strong> ${teacher.subject}</p>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Public Contact Details (If provided) -->
      <div class="px-5 py-3 bg-stone-50/70 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
        ${teacher.email ? `
          <a href="mailto:${teacher.email}" class="hover:text-[#0B4619] flex items-center gap-1 truncate" title="${teacher.email}">
            <svg class="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="truncate font-mono">${teacher.email}</span>
          </a>
        ` : `
          <span class="text-stone-400">অফিসিয়াল অনুষদ</span>
        `}
        <span class="text-[10px] text-emerald-800 font-semibold font-mono">আইডি: #${teacher.id.slice(0, 5)}</span>
      </div>
    </div>
  `).join('');

  // Pagination
  if (paginationSlot) {
    paginationSlot.innerHTML = renderPagination({
      currentPage,
      totalPages,
      containerId: 'teachers-pagination-controls'
    });

    initPagination('teachers-pagination-controls', (newPage) => {
      currentPage = newPage;
      renderTeachersGrid();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    });
  }
}
