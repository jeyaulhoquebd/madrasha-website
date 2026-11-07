/**
 * Administration Page
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Firestore: administration (category: governing | committee | leadership | staff | office, displayOrder)
 *            settings/principal
 */

import { db, collection, getDocs, query, orderBy, getDoc, doc } from '../firebase/config.js';
import { renderEmptyState } from '../components/emptyState.js';
import { renderPageHeader, renderSectionHeading } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';
import { SITE } from '../site.js';

function personCard(m) {
  return `
    <div class="card p-5 text-center">
      <img src="${safeUrl(m.photoUrl, SITE.logoUrl)}" alt="${esc(m.name)}" class="mx-auto h-20 w-20 rounded-full border border-stone-200 object-cover" loading="lazy" />
      <h3 class="mt-4 font-semibold text-stone-800">${esc(m.name)}</h3>
      <p class="mt-1 text-sm text-brand-700">${esc(m.designation || '')}</p>
      ${m.description ? `<p class="mt-2 text-xs leading-relaxed text-stone-500">${esc(m.description)}</p>` : ''}
    </div>
  `;
}

export async function initAdministrationPage() {
  const container = document.getElementById('administration-content');
  if (!container) return;

  const members = [];
  let principal = null;

  if (db) {
    try {
      const [snap, pSnap] = await Promise.all([
        getDocs(query(collection(db, 'administration'), orderBy('displayOrder', 'asc'))),
        getDoc(doc(db, 'settings', 'principal'))
      ]);
      snap.forEach(d => members.push({ id: d.id, ...d.data() }));
      if (pSnap.exists()) principal = pSnap.data();
    } catch (e) {
      console.warn('[Firestore] administration:', e.message);
    }
  }

  const leaders = members.filter(m => m.category === 'leadership');
  const governing = members.filter(m => m.category === 'governing' || m.category === 'committee');
  const office = members.filter(m => m.category === 'staff' || m.category === 'office');

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'প্রশাসন',
      title: 'প্রশাসন ও পরিচালনা পর্ষদ',
      lead: 'সুষ্ঠু প্রাতিষ্ঠানিক ব্যবস্থাপনা ও শিক্ষার মান বজায় রাখতে দিকনির্দেশনাকারী নেতৃত্ব।'
    })}

    ${principal?.name ? `
      <section class="card mb-14 grid items-center gap-8 p-8 md:grid-cols-[auto_1fr]">
        <img src="${safeUrl(principal.photoUrl, SITE.logoUrl)}" alt="${esc(principal.name)}" class="mx-auto h-28 w-28 rounded-full border border-stone-200 object-cover" />
        <div>
          <span class="eyebrow">অধ্যক্ষ</span>
          <h2 class="mt-2 text-xl font-semibold text-brand-900">${esc(principal.name)}</h2>
          <p class="text-sm text-stone-500">${esc(principal.designation || 'অধ্যক্ষ')}</p>
          ${principal.message ? `<blockquote class="mt-4 text-[15px] leading-8 text-stone-700">“${esc(principal.message)}”</blockquote>` : ''}
        </div>
      </section>
    ` : ''}

    ${leaders.length ? `
      <section class="mb-14">
        ${renderSectionHeading('প্রাতিষ্ঠানিক নেতৃত্ব')}
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${leaders.map(personCard).join('')}</div>
      </section>
    ` : ''}

    <section class="mb-14">
      ${renderSectionHeading('গভর্নিং বডি')}
      ${governing.length
        ? `<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${governing.map(personCard).join('')}</div>`
        : `<div class="card">${renderEmptyState({
            title: 'তালিকা শীঘ্রই প্রকাশিত হবে',
            message: 'পরিচালনা পর্ষদের হালনাগাদ সদস্য তালিকা প্রশাসনিক অনুমোদনের পর এখানে প্রকাশ করা হবে।',
            icon: 'users'
          })}</div>`}
    </section>

    ${office.length ? `
      <section>
        ${renderSectionHeading('প্রশাসনিক কর্মকর্তা', '<a href="/staff.html" class="link text-sm">সকল কর্মচারী →</a>')}
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${office.map(personCard).join('')}</div>
      </section>
    ` : ''}
  `;
}
