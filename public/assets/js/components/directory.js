/**
 * Searchable, filterable, paginated people directory (teachers / staff)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { renderPagination, initPagination } from './pagination.js';
import { renderEmptyState } from './emptyState.js';
import { esc, safeUrl, } from '../utils/escape.js';
import { toBengaliNumber } from '../utils/date.js';
import { SITE } from '../site.js';
import { cdnImage } from '../utils/cloudinary.js';

/**
 * @param {object} opts
 * @param {HTMLElement} opts.root            element to render into (below the page header)
 * @param {Array} opts.items                 records from Firestore
 * @param {string} opts.searchPlaceholder
 * @param {string[]} opts.searchFields       fields matched by the search box
 * @param {Array<{value:string,label:string}>} [opts.filters]  chip filters
 * @param {string} [opts.filterField]        field the chips match against
 * @param {(item:object)=>string} opts.meta  extra lines under the designation (already escaped)
 * @param {object} opts.empty                renderEmptyState options
 * @param {string} opts.countLabel           e.g. 'জন'
 */
export function mountDirectory(opts) {
  const { root, items, searchPlaceholder, searchFields, filters = [], filterField, meta, empty, countLabel = 'জন' } = opts;
  const perPage = 12;
  const id = Math.random().toString(36).slice(2, 7);
  let page = 1;
  let filter = 'all';
  let term = '';

  root.innerHTML = `
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-sm">
        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="m20 20-3.5-3.5"/></svg>
        <input type="search" id="dir-search-${id}" class="field pl-9" placeholder="${searchPlaceholder}" aria-label="খুঁজুন" />
      </div>
      <p class="text-sm text-stone-500">মোট <span id="dir-count-${id}" class="font-semibold text-brand-800">০</span> ${countLabel}</p>
    </div>
    ${filters.length ? `
      <div id="dir-filters-${id}" class="-mt-3 mb-8 flex flex-wrap gap-2">
        ${[{ value: 'all', label: 'সকল' }, ...filters].map(f => `
          <button type="button" data-value="${f.value}" class="chip ${f.value === 'all' ? 'chip-active' : ''}">${f.label}</button>
        `).join('')}
      </div>
    ` : ''}
    <div id="dir-grid-${id}" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"></div>
    <div id="dir-pages-${id}" class="mt-6"></div>
  `;

  const grid = document.getElementById(`dir-grid-${id}`);
  const pager = document.getElementById(`dir-pages-${id}`);
  const count = document.getElementById(`dir-count-${id}`);

  const render = () => {
    const list = items.filter(it => {
      const okFilter = filter === 'all' || String(it[filterField] || '').toLowerCase().includes(filter.toLowerCase());
      const okTerm = !term || searchFields.some(f => String(it[f] || '').toLowerCase().includes(term));
      return okFilter && okTerm;
    });
    count.textContent = toBengaliNumber(list.length);

    if (list.length === 0) {
      grid.innerHTML = `<div class="card col-span-full">${
        items.length === 0
          ? renderEmptyState(empty)
          : renderEmptyState({ title: 'কোনো ফলাফল পাওয়া যায়নি', message: 'অন্য কোনো নাম বা শব্দ লিখে আবার খুঁজুন।', icon: empty.icon })
      }</div>`;
      pager.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(list.length / perPage);
    page = Math.min(page, totalPages);
    grid.innerHTML = list.slice((page - 1) * perPage, page * perPage).map(it => `
      <article class="card p-5 text-center">
        <img src="${safeUrl(cdnImage(it.photoUrl, { width: 320 }), SITE.logoUrl)}" alt="${esc(it.name)}" class="mx-auto h-20 w-20 rounded-full border border-stone-200 object-cover" loading="lazy" />
        <h3 class="mt-4 font-semibold leading-snug text-stone-800">${esc(it.name)}</h3>
        <p class="mt-1 text-sm text-brand-700">${esc(it.designation || '')}</p>
        ${meta(it)}
      </article>
    `).join('');

    pager.innerHTML = renderPagination({ currentPage: page, totalPages, containerId: `dir-pc-${id}` });
    initPagination(`dir-pc-${id}`, p => {
      page = p;
      render();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  document.getElementById(`dir-search-${id}`).addEventListener('input', e => {
    term = e.target.value.trim().toLowerCase();
    page = 1;
    render();
  });

  const chips = document.getElementById(`dir-filters-${id}`);
  chips?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    chips.querySelectorAll('button').forEach(b => b.classList.toggle('chip-active', b === btn));
    filter = btn.dataset.value;
    page = 1;
    render();
  });

  render();
}
