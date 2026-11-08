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

/** Default (published) message — can be changed from Admin → Settings → মুহতামিম */
export const MUHTAMIM_DEFAULT = {
  name: 'মাওলানা আবু ওছমান হাফি:',
  designation: 'মুহতামিম',
  message: [
    'মহান আল্লাহ তাআলার অশেষ রহমতে খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা দ্বীনি ও আধুনিক শিক্ষার সমন্বয়ে একটি আদর্শ, নৈতিকতাসম্পন্ন ও যোগ্য প্রজন্ম গড়ে তোলার লক্ষ্যে কাজ করে যাচ্ছে।',
    'আমাদের লক্ষ্য হলো, প্রতিটি শিক্ষার্থীকে পবিত্র কুরআন ও সুন্নাহর আলোকে ইসলামী জ্ঞানে সমৃদ্ধ করার পাশাপাশি আধুনিক জ্ঞান-বিজ্ঞান, প্রযুক্তি ও নৈতিক শিক্ষায় দক্ষ করে গড়ে তোলা। আমরা চাই, আমাদের শিক্ষার্থীরা উত্তম চরিত্র, দেশপ্রেম, মানবিক মূল্যবোধ ও ইসলামী আদর্শে অনুপ্রাণিত হয়ে ভবিষ্যতে দেশ, সমাজ ও সমগ্র উম্মাহর কল্যাণে গুরুত্বপূর্ণ ভূমিকা পালন করুক।',
    'এই লক্ষ্য বাস্তবায়নে আমরা মানসম্মত পাঠদান, অভিজ্ঞ ও দক্ষ শিক্ষক, সুন্দর শিক্ষার পরিবেশ এবং শিক্ষার্থীদের নৈতিক ও চারিত্রিক উন্নয়নের প্রতি বিশেষ গুরুত্ব দিয়ে থাকি। পাশাপাশি শিক্ষার্থীদের মেধা, মনন ও সৃজনশীলতা বিকাশে সর্বাত্মক প্রচেষ্টা অব্যাহত রয়েছে।',
    'আমি সম্মানিত অভিভাবক, শিক্ষক, শিক্ষার্থী ও শুভাকাঙ্ক্ষীদের কাছে আমাদের প্রতিষ্ঠানের সার্বিক উন্নয়নে আন্তরিক সহযোগিতা ও দোয়া কামনা করছি। মহান আল্লাহ তাআলা আমাদের এই মহৎ প্রচেষ্টা কবুল করুন এবং প্রতিষ্ঠানটিকে দ্বীনি ও আধুনিক শিক্ষার একটি আদর্শ প্রতিষ্ঠানে পরিণত করুন। আমিন।'
  ].join('\n\n')
};

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
    name: data.name || MUHTAMIM_DEFAULT.name,
    designation: data.designation || MUHTAMIM_DEFAULT.designation,
    photoUrl: data.photoUrl || SITE.muhtamimPhoto,
    message: data.message || MUHTAMIM_DEFAULT.message
  };
}

/**
 * @param {object} m
 * @param {{compact?: boolean}} opts compact = homepage teaser (first paragraph + link)
 */
export function renderMuhtamimCard(m, { compact = false } = {}) {
  const paragraphs = String(m.message || '').split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);
  const shown = compact ? paragraphs.slice(0, 2) : paragraphs;

  return `
    <figure id="muhtamim" class="card scroll-mt-6 overflow-hidden">
      <div class="grid gap-8 p-6 sm:p-8 md:grid-cols-[14rem_1fr]">
        <div class="text-center md:text-left">
          <img src="${safeUrl(m.photoUrl, SITE.muhtamimPhoto)}" alt="${esc(m.name)}"
            width="480" height="480" loading="lazy"
            class="mx-auto aspect-square w-44 rounded-2xl border border-stone-200 object-cover md:w-full" />
          <p class="mt-4 font-bold text-brand-900">${esc(m.name)}</p>
          <p class="text-sm text-stone-500">${esc(m.designation)}</p>
        </div>
        <div>
          <span class="eyebrow">মুহতামিম সাহেবের বাণী</span>
          <blockquote class="relative mt-5 space-y-4 text-[15px] leading-8 text-stone-700">
            <span class="arabic absolute -left-1 -top-6 text-6xl leading-none text-gold-300" aria-hidden="true">“</span>
            ${shown.map(p => `<p>${esc(p)}</p>`).join('')}
          </blockquote>
          ${compact && paragraphs.length > shown.length
            ? `<a href="/administration.html#muhtamim" class="link mt-5 inline-block text-sm">সম্পূর্ণ বাণী পড়ুন →</a>`
            : `<figcaption class="mt-6 border-t border-stone-100 pt-4 text-sm">
                <span class="font-semibold text-brand-900">— ${esc(m.name)}</span><br>
                <span class="text-stone-600">${esc(m.designation)}</span><br>
                <span class="text-stone-500">${SITE.name}</span>
              </figcaption>`}
        </div>
      </div>
    </figure>
  `;
}
