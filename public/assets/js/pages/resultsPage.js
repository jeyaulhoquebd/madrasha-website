/**
 * Results
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Firestore: results { title, examType, year, remarks, fileUrl, isPublished, publishedAt }
 * Only aggregate, institution-approved result documents are published (no private student data).
 */

import { db, collection, getDocs, query, where } from '../firebase/config.js';
import { formatBengaliDate, toBengaliNumber, sortByDateDesc } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';

const EXAMS = ['দাখিল', 'আলিম', 'ফাজিল', 'বার্ষিক', 'অর্ধবার্ষিক'];

let allResults = [];
let year = 'all';
let exam = 'all';

export async function initResultsPage() {
  const container = document.getElementById('results-page-container');
  if (!container) return;

  allResults = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'results'), where('isPublished', '==', true)));
      snap.forEach(d => allResults.push({ id: d.id, ...d.data() }));
      sortByDateDesc(allResults, 'publishedAt');
    } catch (e) {
      console.warn('[Firestore] results:', e.message);
    }
  }

  const years = [...new Set(allResults.map(r => String(r.year || '')).filter(Boolean))].sort().reverse();

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'একাডেমিক',
      title: 'পরীক্ষার ফলাফল',
      lead: 'বোর্ড ও অভ্যন্তরীণ পরীক্ষার প্রাতিষ্ঠানিকভাবে অনুমোদিত ফলাফল। বোর্ড পরীক্ষার ব্যক্তিগত ফলাফল শিক্ষা বোর্ডের ওয়েবসাইটে দেখুন।'
    })}

    <div class="mb-6 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
      <label class="block">
        <span class="field-label">শিক্ষাবর্ষ</span>
        <select id="result-year-select" class="field">
          <option value="all">সকল</option>
          ${years.map(y => `<option value="${esc(y)}">${toBengaliNumber(esc(y))}</option>`).join('')}
        </select>
      </label>
      <label class="block">
        <span class="field-label">পরীক্ষা</span>
        <select id="result-exam-select" class="field">
          <option value="all">সকল</option>
          ${EXAMS.map(x => `<option value="${x}">${x}</option>`).join('')}
        </select>
      </label>
    </div>

    <div id="results-list-slot" class="card divide-y divide-stone-100"></div>
  `;

  document.getElementById('result-year-select').addEventListener('change', e => { year = e.target.value; render(); });
  document.getElementById('result-exam-select').addEventListener('change', e => { exam = e.target.value; render(); });
  render();
}

function render() {
  const slot = document.getElementById('results-list-slot');
  const items = allResults.filter(r =>
    (year === 'all' || String(r.year) === year) &&
    (exam === 'all' || String(r.examType || '').includes(exam))
  );

  if (items.length === 0) {
    slot.innerHTML = renderEmptyState({
      title: 'কোনো ফলাফল প্রকাশিত হয়নি',
      message: 'ফলাফল প্রাতিষ্ঠানিকভাবে অনুমোদনের পর এখানে প্রকাশ করা হবে।',
      icon: 'document'
    });
    return;
  }

  slot.innerHTML = items.map(r => `
    <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span class="tag">${esc(r.examType || 'পরীক্ষা')}</span>
          ${r.year ? `<span>${toBengaliNumber(esc(r.year))}</span>` : ''}
          <span>· ${formatBengaliDate(r.publishedAt)}</span>
        </div>
        <h2 class="mt-1.5 font-medium text-stone-800">${esc(r.title || `${r.examType || ''} ফলাফল`)}</h2>
        ${r.remarks ? `<p class="mt-1 text-sm text-stone-500">${esc(r.remarks)}</p>` : ''}
      </div>
      ${r.fileUrl ? `<a href="${safeUrl(r.fileUrl)}" target="_blank" rel="noopener" class="btn btn-outline flex-shrink-0 px-3.5 py-1.5 text-xs">ডাউনলোড</a>` : ''}
    </div>
  `).join('');
}
