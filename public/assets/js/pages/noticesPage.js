/**
 * Notice Board
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: notices { title, category, summary, content, fileUrl, isPublished, publishedAt }
 */

import { db, collection, getDocs, query, where } from '../firebase/config.js';
import { formatBengaliDate, toBengaliNumber, sortByDateDesc } from '../utils/date.js';
import { renderPagination, initPagination } from '../components/pagination.js';
import { renderEmptyState } from '../components/emptyState.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';

const CATEGORIES = [
  { value: 'all', label: 'সকল' },
  { value: 'পরীক্ষা', label: 'পরীক্ষা' },
  { value: 'ভর্তি', label: 'ভর্তি' },
  { value: 'ছুটি', label: 'ছুটি' },
  { value: 'সাধারণ', label: 'সাধারণ' }
];
const PER_PAGE = 10;

let allNotices = [];
let page = 1;
let category = 'all';
let term = '';

export async function initNoticesPage() {
  const container = document.getElementById('notices-page-container');
  if (!container) return;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'নোটিশ',
      title: 'নোটিশ বোর্ড',
      lead: 'পরীক্ষা, ভর্তি, ছুটি ও প্রশাসনিক সকল অফিসিয়াল বিজ্ঞপ্তি।'
    })}

    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div id="notice-category-filters" class="flex flex-wrap gap-2">
        ${CATEGORIES.map(c => `<button type="button" data-cat="${c.value}" class="chip ${c.value === 'all' ? 'chip-active' : ''}">${c.label}</button>`).join('')}
      </div>
      <input type="search" id="notice-search-input" class="field sm:max-w-xs" placeholder="নোটিশ খুঁজুন" aria-label="নোটিশ খুঁজুন" />
    </div>

    <div id="notices-list-slot" class="card divide-y divide-stone-100">
      <p class="py-12 text-center text-sm text-stone-400">লোড হচ্ছে...</p>
    </div>
    <p class="mt-3 text-xs text-stone-400">মোট <span id="notice-count">০</span>টি নোটিশ</p>
    <div id="notices-pagination-slot"></div>
  `;

  allNotices = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'notices'), where('isPublished', '==', true)));
      snap.forEach(d => allNotices.push({ id: d.id, ...d.data() }));
      sortByDateDesc(allNotices, 'publishedAt');
    } catch (e) {
      console.warn('[Firestore] notices:', e.message);
    }
  }

  document.getElementById('notice-search-input')?.addEventListener('input', e => {
    term = e.target.value.trim().toLowerCase();
    page = 1;
    render();
  });

  const filters = document.getElementById('notice-category-filters');
  filters?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    filters.querySelectorAll('button').forEach(b => b.classList.toggle('chip-active', b === btn));
    category = btn.dataset.cat;
    page = 1;
    render();
  });

  render();
}

function render() {
  const list = document.getElementById('notices-list-slot');
  const pager = document.getElementById('notices-pagination-slot');
  if (!list) return;

  const items = allNotices.filter(n => {
    const okCat = category === 'all' || String(n.category || '').includes(category);
    const okTerm = !term || [n.title, n.summary, n.content].some(v => String(v || '').toLowerCase().includes(term));
    return okCat && okTerm;
  });
  document.getElementById('notice-count').textContent = toBengaliNumber(items.length);

  if (items.length === 0) {
    list.innerHTML = renderEmptyState({
      title: allNotices.length ? 'কোনো নোটিশ পাওয়া যায়নি' : 'এখনও কোনো নোটিশ প্রকাশিত হয়নি',
      message: allNotices.length ? 'অন্য ক্যাটাগরি বা শব্দ দিয়ে খুঁজে দেখুন।' : 'নতুন নোটিশ প্রকাশিত হলে এখানে দেখা যাবে।',
      icon: 'bell'
    });
    pager.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(items.length / PER_PAGE);
  page = Math.min(page, totalPages);

  list.innerHTML = items.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(n => `
    <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <a href="/notice-details.html?id=${encodeURIComponent(n.id)}" class="group min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span class="tag">${esc(n.category || 'সাধারণ')}</span>
          <time>${formatBengaliDate(n.publishedAt)}</time>
        </div>
        <h2 class="mt-1.5 font-medium leading-relaxed text-stone-800 group-hover:text-brand-700">${esc(n.title)}</h2>
        ${n.summary ? `<p class="mt-1 line-clamp-2 text-sm text-stone-500">${esc(n.summary)}</p>` : ''}
      </a>
      ${n.fileUrl ? `<a href="${safeUrl(n.fileUrl)}" target="_blank" rel="noopener" class="btn btn-outline flex-shrink-0 px-3.5 py-1.5 text-xs">ফাইল</a>` : ''}
    </div>
  `).join('');

  pager.innerHTML = renderPagination({ currentPage: page, totalPages, containerId: 'notices-pagination-controls' });
  initPagination('notices-pagination-controls', p => {
    page = p;
    render();
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
