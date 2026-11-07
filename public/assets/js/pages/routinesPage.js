/**
 * Class & Exam Routines
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Firestore: routines { title, type: 'class'|'exam', className, session, effectiveDate, fileUrl, createdAt }
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';

let allRoutines = [];
let tab = 'class';

export async function initRoutinesPage() {
  const container = document.getElementById('routines-page-container');
  if (!container) return;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'একাডেমিক',
      title: 'ক্লাস ও পরীক্ষার রুটিন',
      lead: 'চলতি শিক্ষাবর্ষের নিয়মিত ক্লাস এবং আসন্ন পরীক্ষার সময়সূচি।'
    })}

    <div id="routine-tabs" role="tablist" class="mb-6 inline-flex rounded-lg border border-stone-200 bg-white p-1">
      <button type="button" role="tab" data-tab="class" class="rounded-md px-4 py-1.5 text-sm font-medium transition">ক্লাস রুটিন</button>
      <button type="button" role="tab" data-tab="exam" class="rounded-md px-4 py-1.5 text-sm font-medium transition">পরীক্ষার রুটিন</button>
    </div>

    <div id="routines-grid-slot" class="grid gap-5 md:grid-cols-2"></div>
  `;

  allRoutines = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'routines'), orderBy('createdAt', 'desc')));
      snap.forEach(d => allRoutines.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] routines:', e.message);
    }
  }

  document.getElementById('routine-tabs').addEventListener('click', e => {
    const btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    tab = btn.dataset.tab;
    render();
  });
  render();
}

function render() {
  document.querySelectorAll('#routine-tabs button').forEach(b => {
    const active = b.dataset.tab === tab;
    b.setAttribute('aria-selected', String(active));
    b.className = `rounded-md px-4 py-1.5 text-sm font-medium transition ${active ? 'bg-brand-700 text-white' : 'text-stone-600 hover:text-brand-700'}`;
  });

  const slot = document.getElementById('routines-grid-slot');
  const items = allRoutines.filter(r => (r.type || 'class') === tab);

  if (items.length === 0) {
    slot.innerHTML = `<div class="card md:col-span-2">${renderEmptyState({
      title: tab === 'class' ? 'ক্লাস রুটিন শীঘ্রই প্রকাশিত হবে' : 'পরীক্ষার রুটিন শীঘ্রই প্রকাশিত হবে',
      message: 'রুটিন প্রকাশিত হলে এখান থেকে দেখা ও ডাউনলোড করা যাবে।',
      icon: 'calendar'
    })}</div>`;
    return;
  }

  slot.innerHTML = items.map(r => `
    <article class="card flex flex-col p-6">
      <p class="text-xs text-stone-500">${r.effectiveDate ? `কার্যকর: ${formatBengaliDate(r.effectiveDate)}` : 'চলতি সেশন'}</p>
      <h2 class="mt-2 font-semibold text-brand-900">${esc(r.title)}</h2>
      <dl class="mt-3 space-y-1 text-sm text-stone-600">
        ${r.className ? `<div><dt class="inline text-stone-400">শ্রেণি: </dt><dd class="inline">${esc(r.className)}</dd></div>` : ''}
        ${r.session ? `<div><dt class="inline text-stone-400">সেশন: </dt><dd class="inline">${esc(r.session)}</dd></div>` : ''}
      </dl>
      ${r.fileUrl ? `<a href="${safeUrl(r.fileUrl)}" target="_blank" rel="noopener" class="btn btn-outline mt-5 self-start px-3.5 py-1.5 text-xs">ডাউনলোড</a>` : ''}
    </article>
  `).join('');
}
