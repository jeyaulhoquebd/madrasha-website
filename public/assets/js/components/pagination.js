/**
 * Pagination
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { toBengaliNumber } from '../utils/date.js';

const base = 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition';

export function renderPagination({ currentPage = 1, totalPages = 1, containerId = 'pagination-controls' } = {}) {
  if (totalPages <= 1) return '';

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const navBtn = (page, label, disabled) => `
    <button type="button" data-page="${page}" ${disabled ? 'disabled' : ''}
      class="${base} border-stone-200 bg-white text-stone-600 ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:border-brand-200 hover:text-brand-700'}">${label}</button>`;

  return `
    <div id="${containerId}" class="flex flex-wrap items-center justify-center gap-1.5 py-6">
      ${navBtn(currentPage - 1, 'পূর্ববর্তী', currentPage <= 1)}
      ${pages.map(p => `
        <button type="button" data-page="${p}" ${p === currentPage ? 'aria-current="page"' : ''}
          class="${base} ${p === currentPage ? 'border-brand-700 bg-brand-700 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-brand-200 hover:text-brand-700'}">${toBengaliNumber(p)}</button>
      `).join('')}
      ${navBtn(currentPage + 1, 'পরবর্তী', currentPage >= totalPages)}
    </div>
  `;
}

export function initPagination(containerId, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container || typeof onPageChange !== 'function') return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]');
    if (!btn || btn.disabled) return;
    const targetPage = parseInt(btn.getAttribute('data-page'), 10);
    if (!isNaN(targetPage)) onPageChange(targetPage);
  });
}
