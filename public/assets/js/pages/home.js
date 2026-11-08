/**
 * Homepage Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Loads verified, published content from Cloud Firestore.
 */

import { db, collection, doc, getDocs, getDoc, query, where, orderBy, limit } from '../firebase/config.js';
import { formatBengaliDate, sortByDateDesc } from '../utils/date.js';
import { esc, safeUrl } from '../utils/escape.js';
import { getGeneralSettings } from '../components/layout.js';
import { renderNoticeTicker } from '../components/noticeTicker.js';
import { SITE } from '../site.js';
import { cdnImage } from '../utils/cloudinary.js';
import { getMuhtamim, renderMuhtamimCard } from '../components/muhtamim.js';

export const OFFICIAL_HERO_IMAGE_URL = SITE.heroUrl;
export const OFFICIAL_LOGO_URL = SITE.logoUrl;

/** Kept for backwards compatibility with other page controllers. */
export function loadInstitutionalSettings() {
  return getGeneralSettings();
}

function noticeEmpty(message) {
  return `<p class="px-5 py-10 text-center text-sm leading-relaxed text-stone-500">${message}</p>`;
}

export async function loadRecentNotices() {
  const container = document.getElementById('home-notices-container');
  const tickerSlot = document.getElementById('notice-ticker-slot');

  if (!db) {
    if (container) container.innerHTML = noticeEmpty('এখনও কোনো নোটিশ প্রকাশিত হয়নি।');
    return [];
  }

  try {
    // Single-field filter only (no composite index needed); sorted on the client
    const snapshot = await getDocs(query(collection(db, 'notices'), where('isPublished', '==', true)));
    const notices = sortByDateDesc(snapshot.docs.map(d => ({ id: d.id, ...d.data() })), 'publishedAt').slice(0, 5);

    if (container) {
      container.innerHTML = notices.length === 0
        ? noticeEmpty('বর্তমানে কোনো সক্রিয় নোটিশ নেই।')
        : notices.map(n => `
          <a href="/notice-details.html?id=${encodeURIComponent(n.id)}" class="group block px-5 py-4 transition hover:bg-stone-50">
            <div class="flex items-center gap-2 text-xs text-stone-500">
              <span class="tag">${esc(n.category || 'সাধারণ')}</span>
              <span>${formatBengaliDate(n.publishedAt)}</span>
            </div>
            <p class="mt-1.5 text-sm font-medium leading-relaxed text-stone-800 group-hover:text-brand-700">${esc(n.title)}</p>
          </a>
        `).join('');
    }

    if (tickerSlot) tickerSlot.innerHTML = renderNoticeTicker(notices);
    return notices;
  } catch (error) {
    console.warn('[Firestore] notices:', error.message);
    if (container) container.innerHTML = noticeEmpty('নোটিশ লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    return [];
  }
}

export async function loadPrincipalMessage() {
  const section = document.getElementById('principal-section');
  const container = document.getElementById('principal-message-container');
  if (!db || !container) return;

  try {
    const snap = await getDoc(doc(db, 'settings', 'principal'));
    if (!snap.exists() || !snap.data().message) return;
    const data = snap.data();

    container.innerHTML = `
      <figure class="card grid items-center gap-8 p-8 sm:p-10 md:grid-cols-[auto_1fr]">
        <img src="${safeUrl(cdnImage(data.photoUrl, { width: 320 }), SITE.logoUrl)}" alt="${esc(data.name || 'অধ্যক্ষ')}"
          class="mx-auto h-28 w-28 rounded-full border border-stone-200 object-cover" loading="lazy" />
        <div>
          <span class="eyebrow">অধ্যক্ষের বাণী</span>
          <blockquote class="mt-4 text-[15px] leading-8 text-stone-700">“${esc(data.message)}”</blockquote>
          <figcaption class="mt-5 text-sm">
            <span class="font-semibold text-brand-900">${esc(data.name || 'অধ্যক্ষ')}</span>
            <span class="text-stone-500"> · ${esc(data.designation || 'অধ্যক্ষ')}</span>
          </figcaption>
        </div>
      </figure>
    `;
    section?.classList.remove('hidden');
  } catch (error) {
    console.warn('[Firestore] principal message:', error.message);
  }
}

export async function loadTeacherHighlights() {
  const section = document.getElementById('teachers-section');
  const container = document.getElementById('home-teachers-container');
  if (!db || !container) return;

  try {
    const snapshot = await getDocs(query(collection(db, 'teachers'), orderBy('displayOrder', 'asc'), limit(4)));
    const teachers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    if (teachers.length === 0) return;

    container.innerHTML = teachers.map(t => `
      <div class="card p-6 text-center">
        <img src="${safeUrl(cdnImage(t.photoUrl, { width: 320 }), SITE.logoUrl)}" alt="${esc(t.name)}" class="mx-auto h-20 w-20 rounded-full border border-stone-200 object-cover" loading="lazy" />
        <h3 class="mt-4 font-semibold text-stone-800">${esc(t.name)}</h3>
        <p class="mt-1 text-sm text-brand-700">${esc(t.designation || 'শিক্ষক')}</p>
        ${t.department ? `<p class="mt-1 text-xs text-stone-500">${esc(t.department)}</p>` : ''}
      </div>
    `).join('');
    section?.classList.remove('hidden');
  } catch (error) {
    console.warn('[Firestore] teachers:', error.message);
  }
}

export async function loadMuhtamim() {
  const slot = document.getElementById('muhtamim-container');
  if (!slot) return;
  slot.innerHTML = renderMuhtamimCard(await getMuhtamim(), { compact: true });
}

export async function initHomePage() {
  await Promise.all([loadRecentNotices(), loadMuhtamim(), loadPrincipalMessage(), loadTeacherHighlights()]);
}
