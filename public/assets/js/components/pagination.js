/**
 * Pagination Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

import { toBengaliNumber } from '../utils/date.js';

export function renderPagination({
  currentPage = 1,
  totalPages = 1,
  containerId = 'pagination-controls'
} = {}) {
  if (totalPages <= 1) return '';

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return `
    <div id="${containerId}" class="flex items-center justify-center space-x-1.5 rtl:space-x-reverse py-6 text-xs sm:text-sm">
      <!-- Previous Button -->
      <button 
        data-page="${currentPage - 1}" 
        ${currentPage <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="hover:bg-emerald-50 hover:text-[#0B4619]"'}
        class="px-3 py-1.5 rounded border border-stone-200 bg-white text-stone-700 font-medium transition flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        <span>পূর্ববর্তী</span>
      </button>

      <!-- Page Numbers -->
      ${pages.map(p => {
        const isActive = p === currentPage;
        return `
          <button 
            data-page="${p}" 
            class="px-3 py-1.5 rounded font-medium border transition ${isActive ? 'bg-[#0B4619] text-white border-[#0B4619] shadow-xs' : 'bg-white text-stone-700 border-stone-200 hover:bg-emerald-50 hover:text-[#0B4619]'}"
          >
            ${toBengaliNumber(p)}
          </button>
        `;
      }).join('')}

      <!-- Next Button -->
      <button 
        data-page="${currentPage + 1}" 
        ${currentPage >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="hover:bg-emerald-50 hover:text-[#0B4619]"'}
        class="px-3 py-1.5 rounded border border-stone-200 bg-white text-stone-700 font-medium transition flex items-center gap-1">
        <span>পরবর্তী</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
  `;
}

/**
 * Attaches pagination click listener
 */
export function initPagination(containerId, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container || typeof onPageChange !== 'function') return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]');
    if (!btn || btn.disabled) return;
    const targetPage = parseInt(btn.getAttribute('data-page'), 10);
    if (!isNaN(targetPage)) {
      onPageChange(targetPage);
    }
  });
}
