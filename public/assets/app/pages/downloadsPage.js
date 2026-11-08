/**
 * Download Center
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: downloads { title, description, category, fileUrl, fileSize, createdAt }
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { formatBengaliDate, toBengaliNumber } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';

const CATEGORIES = {
  admission: 'ভর্তি ফরম',
  syllabus: 'সিলেবাস',
  academic: 'একাডেমিক',
  exam: 'পরীক্ষা',
  other: 'অন্যান্য'
};

let allFiles = [];
let category = 'all';
let term = '';

export async function initDownloadsPage() {
  const container = document.getElementById('downloads-page-container');
  if (!container) return;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'ডাউনলোড',
      title: 'ডাউনলোড সেন্টার',
      lead: 'ভর্তি ফরম, সিলেবাস, পরীক্ষা সংক্রান্ত নথি ও অন্যান্য প্রয়োজনীয় ফাইল।'
    })}

    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div id="download-category-filters" class="flex flex-wrap gap-2">
        <button type="button" data-cat="all" class="chip chip-active">সকল</button>
        ${Object.entries(CATEGORIES).map(([k, v]) => `<button type="button" data-cat="${k}" class="chip">${v}</button>`).join('')}
      </div>
      <input type="search" id="download-search-input" class="field sm:max-w-xs" placeholder="ফাইল খুঁজুন" aria-label="ফাইল খুঁজুন" />
    </div>

    <div id="downloads-grid-slot" class="card divide-y divide-stone-100"></div>
    <p class="mt-3 text-xs text-stone-400">মোট <span id="download-count">০</span>টি ফাইল</p>
  `;

  allFiles = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'downloads'), orderBy('createdAt', 'desc')));
      snap.forEach(d => allFiles.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] downloads:', e.message);
    }
  }

  document.getElementById('download-search-input').addEventListener('input', e => {
    term = e.target.value.trim().toLowerCase();
    render();
  });
  const filters = document.getElementById('download-category-filters');
  filters.addEventListener('click', e => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    filters.querySelectorAll('button').forEach(b => b.classList.toggle('chip-active', b === btn));
    category = btn.dataset.cat;
    render();
  });
  render();
}

function render() {
  const slot = document.getElementById('downloads-grid-slot');
  const items = allFiles.filter(f =>
    (category === 'all' || String(f.category || '') === category) &&
    (!term || [f.title, f.description].some(v => String(v || '').toLowerCase().includes(term)))
  );
  document.getElementById('download-count').textContent = toBengaliNumber(items.length);

  if (items.length === 0) {
    slot.innerHTML = renderEmptyState({
      title: allFiles.length ? 'কোনো ফাইল পাওয়া যায়নি' : 'এখনও কোনো ফাইল যুক্ত হয়নি',
      message: allFiles.length ? 'অন্য ক্যাটাগরি বা শব্দ দিয়ে খুঁজে দেখুন।' : 'ফরম, সিলেবাস বা নির্দেশিকা আপলোড করা হলে এখান থেকে ডাউনলোড করা যাবে।',
      icon: 'folder'
    });
    return;
  }

  slot.innerHTML = items.map(f => `
    <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span class="tag">${esc(CATEGORIES[f.category] || f.category || 'ফাইল')}</span>
          ${f.fileSize ? `<span>${esc(f.fileSize)}</span>` : ''}
          ${f.createdAt ? `<span>· ${formatBengaliDate(f.createdAt)}</span>` : ''}
        </div>
        <h2 class="mt-1.5 font-medium text-stone-800">${esc(f.title)}</h2>
        ${f.description ? `<p class="mt-1 text-sm text-stone-500">${esc(f.description)}</p>` : ''}
      </div>
      ${f.fileUrl ? `<a href="${safeUrl(f.fileUrl)}" target="_blank" rel="noopener" class="btn btn-outline flex-shrink-0 px-3.5 py-1.5 text-xs">ডাউনলোড</a>` : ''}
    </div>
  `).join('');
}
