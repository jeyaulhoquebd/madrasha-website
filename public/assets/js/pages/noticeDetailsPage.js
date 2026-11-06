/**
 * Notice Details Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads single notice by ID from Firestore with attachment downloads
 */

import { db, doc, getDoc, collection, getDocs, query, limit, where } from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { renderEmptyState } from '../components/emptyState.js';

export async function initNoticeDetailsPage() {
  const container = document.getElementById('notice-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const noticeId = urlParams.get('id');

  if (!noticeId) {
    container.innerHTML = renderEmptyState({
      title: 'নোটিশ আইডি পাওয়া যায়নি',
      message: 'নির্দিষ্ট নোটিশটি দেখতে নোটিশ বোর্ড থেকে যেকোনো নোটিশ নির্বাচন করুন।',
      icon: 'document',
      actionText: 'সকল নোটিশ দেখুন',
      actionUrl: '/notices.html'
    });
    return;
  }

  let notice = null;
  let relatedNotices = [];

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'notices', noticeId));
      if (snap.exists()) {
        notice = { id: snap.id, ...snap.data() };
      }

      const relSnap = await getDocs(query(collection(db, 'notices'), where('isPublished', '==', true), limit(4)));
      relSnap.forEach(d => {
        if (d.id !== noticeId) relatedNotices.push({ id: d.id, ...d.data() });
      });
    } catch (e) {
      console.warn('[Firestore] Notice details fetch notice:', e.message);
    }
  }

  if (!notice) {
    container.innerHTML = renderEmptyState({
      title: 'নোটিশটি খুঁজে পাওয়া যায়নি',
      message: 'নোটিশটি মুছে ফেলা হতে পারে অথবা সংযোগ বিচ্ছিন্ন রয়েছে। অনুগ্রহ করে নোটিশ বোর্ডের তালিকা দেখুন।',
      icon: 'document',
      actionText: 'সকল নোটিশ বোর্ডে ফিরে যান',
      actionUrl: '/notices.html'
    });
    return;
  }

  // Update Page Title
  document.title = `${notice.title} - খাগড়াছড়ি বায়তুশ শরফ মাদ্রাসা`;

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Back Link -->
      <a href="/notices.html" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4619] hover:underline">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span>সকল নোটিশে ফিরে যান</span>
      </a>

      <!-- Notice Main Card -->
      <article class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
        
        <!-- Header Info -->
        <div class="border-b border-stone-100 pb-5 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#0B4619] text-amber-300">
              ${notice.category || 'সাধারণ বিজ্ঞপ্তি'}
            </span>
            <span class="text-xs text-stone-500">
              প্রকাশের তারিখ: <strong class="text-slate-700">${formatBengaliDate(notice.publishedAt, true)}</strong>
            </span>
          </div>

          <h1 class="text-xl sm:text-3xl font-extrabold text-[#072e10] leading-snug">
            ${notice.title}
          </h1>

          <div class="text-xs text-stone-500">
            স্মারক নম্বর: <span class="font-mono text-slate-700 font-semibold">${notice.memoNo || 'বিএসজেএএফএম/২০২৬/নোটিশ'}</span>
          </div>
        </div>

        <!-- Body Content -->
        <div class="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p class="whitespace-pre-line">${notice.content || 'এই নোটিশটির সম্পূর্ণ বিবরণ মাদ্রাসা প্রশাসনিক আদেশক্রমে জারি করা হয়েছে।'}</p>
        </div>

        <!-- Downloadable Attachment (PDF / Document) -->
        ${notice.fileUrl ? `
          <div class="pt-6 border-t border-stone-100">
            <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#0B4619] text-amber-300 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-bold text-slate-800">অফিসিয়াল সংযুক্তি ফাইল (PDF/Doc)</h4>
                  <p class="text-[11px] text-stone-500">অফিসিয়াল স্বাক্ষরিত নোটিশের ডিজিটাল কপি</p>
                </div>
              </div>
              <a href="${notice.fileUrl}" target="_blank" download class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-bold rounded-lg shadow-xs transition flex-shrink-0">
                <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>ফাইলটি ডাউনলোড করুন</span>
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Authority Signature Signoff -->
        <div class="pt-8 border-t border-stone-100 flex justify-end">
          <div class="text-center space-y-1">
            <span class="text-xs font-bold text-slate-800 block">আদেশক্রমে,</span>
            <span class="text-xs font-semibold text-[#0B4619] block">অধ্যক্ষ</span>
            <span class="text-[11px] text-stone-500 block">খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল মাদ্রাসা</span>
          </div>
        </div>

      </article>

      <!-- Related Notices -->
      ${relatedNotices.length > 0 ? `
        <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 class="text-sm sm:text-base font-bold text-[#072e10]">আরও সাম্প্রতিক নোটিশ</h3>
          <div class="divide-y divide-stone-100 text-xs sm:text-sm">
            ${relatedNotices.map(r => `
              <div class="py-3 flex items-center justify-between gap-3">
                <a href="/notice-details.html?id=${r.id}" class="font-bold text-slate-800 hover:text-[#0B4619] line-clamp-1">
                  ${r.title}
                </a>
                <span class="text-[11px] text-stone-500 flex-shrink-0">${formatBengaliDate(r.publishedAt)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}
