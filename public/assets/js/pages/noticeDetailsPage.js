/**
 * Notice Details
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { db, doc, getDoc, collection, getDocs, query, where } from '../firebase/config.js';
import { formatBengaliDate, sortByDateDesc } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';
import { esc, safeUrl } from '../utils/escape.js';
import { SITE } from '../site.js';

export async function initNoticeDetailsPage() {
  const container = document.getElementById('notice-detail-container');
  if (!container) return;

  const noticeId = new URLSearchParams(window.location.search).get('id');
  const notFound = (title, message) => {
    container.innerHTML = `<div class="card">${renderEmptyState({ title, message, icon: 'document', actionText: 'নোটিশ বোর্ডে যান', actionUrl: '/notices.html' })}</div>`;
  };

  if (!noticeId) return notFound('কোনো নোটিশ নির্বাচন করা হয়নি', 'নোটিশ বোর্ড থেকে একটি নোটিশ নির্বাচন করুন।');

  let notice = null;
  const related = [];
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'notices', noticeId));
      if (snap.exists() && snap.data().isPublished) notice = { id: snap.id, ...snap.data() };
      const rel = await getDocs(query(collection(db, 'notices'), where('isPublished', '==', true)));
      rel.forEach(d => { if (d.id !== noticeId) related.push({ id: d.id, ...d.data() }); });
      sortByDateDesc(related, 'publishedAt');
    } catch (e) {
      console.warn('[Firestore] notice details:', e.message);
    }
  }

  if (!notice) return notFound('নোটিশটি পাওয়া যায়নি', 'নোটিশটি সরিয়ে ফেলা হয়েছে অথবা লিংকটি সঠিক নয়।');

  document.title = `${notice.title} — ${SITE.shortName}`;
  const crumb = document.querySelector('[aria-current="page"]');
  if (crumb) crumb.textContent = notice.title;

  const paragraphs = String(notice.content || '').split(/\n+/).filter(Boolean);

  container.innerHTML = `
    <div class="grid gap-10 lg:grid-cols-3">
      <article class="lg:col-span-2">
        <a href="/notices.html" class="text-sm text-stone-500 hover:text-brand-700">← সকল নোটিশ</a>
        <div class="mt-5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span class="tag">${esc(notice.category || 'সাধারণ')}</span>
          <time>${formatBengaliDate(notice.publishedAt, true)}</time>
          ${notice.memoNo ? `<span>· স্মারক: ${esc(notice.memoNo)}</span>` : ''}
        </div>
        <h1 class="mt-3 text-2xl font-bold leading-snug text-brand-900 sm:text-3xl">${esc(notice.title)}</h1>

        <div class="mt-8 space-y-4 text-[15px] leading-8 text-stone-700">
          ${paragraphs.length ? paragraphs.map(p => `<p>${esc(p)}</p>`).join('') : `<p class="text-stone-500">বিস্তারিত সংযুক্ত ফাইলে দেখুন।</p>`}
        </div>

        ${notice.fileUrl ? `
          <div class="card mt-8 flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
            <div>
              <p class="font-medium text-stone-800">সংযুক্ত ফাইল</p>
              <p class="text-xs text-stone-500">নোটিশের স্বাক্ষরিত কপি</p>
            </div>
            <a href="${safeUrl(notice.fileUrl)}" target="_blank" rel="noopener" class="btn btn-primary">ডাউনলোড</a>
          </div>
        ` : ''}

        <p class="mt-10 border-t border-stone-200 pt-5 text-sm text-stone-500">আদেশক্রমে, অধ্যক্ষ<br />${SITE.name}</p>
      </article>

      ${related.length ? `
        <aside>
          <h2 class="mb-3 text-sm font-semibold text-stone-500">আরও নোটিশ</h2>
          <div class="card divide-y divide-stone-100">
            ${related.slice(0, 4).map(r => `
              <a href="/notice-details.html?id=${encodeURIComponent(r.id)}" class="block px-4 py-3.5 hover:bg-stone-50">
                <p class="text-sm font-medium leading-relaxed text-stone-800">${esc(r.title)}</p>
                <p class="mt-1 text-xs text-stone-400">${formatBengaliDate(r.publishedAt)}</p>
              </a>
            `).join('')}
          </div>
        </aside>
      ` : ''}
    </div>
  `;
}
