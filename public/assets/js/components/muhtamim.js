/**
 * Muhtamim (head of the madrasa) profile card
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Default photo ships with the site; name, designation, photo and message can
 * be set from Admin → Settings → মুহতামিম (Firestore: settings/muhtamim).
 */

import { db, doc, getDoc } from '../firebase/config.js';
import { esc, safeUrl } from '../utils/escape.js';
import { SITE } from '../site.js';

export async function getMuhtamim() {
  let data = {};
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'muhtamim'));
      if (snap.exists()) data = snap.data();
    } catch (e) {
      console.warn('[Firestore] settings/muhtamim:', e.message);
    }
  }
  return {
    name: data.name || '',
    designation: data.designation || 'মুহতামিম',
    photoUrl: data.photoUrl || SITE.muhtamimPhoto,
    message: data.message || ''
  };
}

export function renderMuhtamimCard(m, { compact = false } = {}) {
  return `
    <figure class="card grid items-center gap-8 overflow-hidden p-6 sm:p-8 md:grid-cols-[13rem_1fr]">
      <img src="${safeUrl(m.photoUrl, SITE.muhtamimPhoto)}" alt="${esc(m.name || m.designation)}"
        width="480" height="480" loading="lazy"
        class="mx-auto aspect-square w-44 rounded-2xl border border-stone-200 object-cover md:w-full" />
      <div>
        <span class="eyebrow">${esc(m.designation)}</span>
        ${m.name ? `<h2 class="mt-3 text-2xl font-bold text-brand-900">${esc(m.name)}</h2>` : ''}
        <p class="mt-1 text-sm text-stone-500">${m.name ? esc(m.designation) + ', ' : ''}${SITE.name}</p>
        ${m.message
          ? `<blockquote class="mt-5 border-l-2 border-gold-300 pl-4 text-[15px] leading-8 text-stone-700">${esc(m.message).replace(/\n/g, '<br>')}</blockquote>`
          : `<p class="mt-5 text-[15px] leading-8 text-stone-600">মাদ্রাসার সার্বিক তত্ত্বাবধান, দ্বীনি পরিবেশ রক্ষা ও শিক্ষা কার্যক্রম পরিচালনার দায়িত্বে নিয়োজিত।</p>`}
        ${compact ? `<a href="/administration.html" class="link mt-5 inline-block text-sm">প্রশাসন ও পরিচালনা →</a>` : ''}
      </div>
    </figure>
  `;
}
