/**
 * About Page
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Default text can be overridden from Firestore: settings/about
 * { history, mission, vision, objectives: [], facilities: [{title, desc}] }
 */

import { db, doc, getDoc } from '../firebase/config.js';
import { renderPageHeader, renderSectionHeading } from '../components/pageHeader.js';
import { esc } from '../utils/escape.js';
import { SITE } from '../site.js';

const DEFAULT_HISTORY = [
  `খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা ${SITE.establishedFull} তারিখে খাগড়াছড়ি সদরের আরামবাগে প্রতিষ্ঠিত হয়। দীর্ঘ তিন দশকেরও বেশি সময় ধরে প্রতিষ্ঠানটি পার্বত্য খাগড়াছড়ির ছাত্র-ছাত্রীদের কুরআন, হাদিস ও ইসলামী নৈতিক শিক্ষার পাশাপাশি আধুনিক সাধারণ বিষয়ে পাঠদান করে আসছে।`,
  'এটি একটি নিবন্ধিত, চলমান বেসরকারি আলিয়া মাদ্রাসা। ছেলে ও মেয়ে উভয়ের জন্য সহশিক্ষা ব্যবস্থায় এখানে ফাজিল (পাস) স্তর পর্যন্ত পাঠদান করা হয়। দাখিল ও আলিম স্তর বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের এবং ফাজিল স্তর ইসলামী আরবি বিশ্ববিদ্যালয়ের শিক্ষাক্রম অনুসরণ করে।'
];

const DEFAULT_MISSION = 'কুরআন, হাদিস ও ইসলামী শরীয়তের বিশুদ্ধ জ্ঞানের পাশাপাশি জাতীয় শিক্ষাক্রমের আধুনিক বিজ্ঞান, তথ্যপ্রযুক্তি ও সাধারণ শিক্ষার সমন্বয়ে যোগ্য, সৎ, দেশপ্রেমিক ও নৈতিকতাসম্পন্ন নাগরিক গড়ে তোলা।';
const DEFAULT_VISION = 'একটি আদর্শ ইসলামী বিদ্যাপীঠ হিসেবে পার্বত্য অঞ্চলের শিক্ষার্থীদের জন্য মানসম্মত উচ্চশিক্ষার সুযোগ সৃষ্টি করা এবং যোগ্য আলেম ও দক্ষ নাগরিক তৈরি করা।';
const DEFAULT_OBJECTIVES = [
  'সহিহ কুরআন তেলাওয়াত, তরজমা ও হাদিসের মৌলিক জ্ঞানে দক্ষতা অর্জন।',
  'আরবি, বাংলা ও ইংরেজি ভাষায় কার্যকর যোগাযোগ দক্ষতা তৈরি।',
  'আধুনিক তথ্যপ্রযুক্তির ব্যবহারিক জ্ঞান প্রদান।',
  'দাখিল, আলিম ও ফাজিল পরীক্ষায় সন্তোষজনক ফলাফল নিশ্চিত করা।',
  'ইসলামী মূল্যবোধ, দেশপ্রেম ও সামাজিক দায়বদ্ধতা জাগ্রত করা।'
];

export async function initAboutPage() {
  const container = document.getElementById('about-dynamic-content');
  if (!container) return;

  let data = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'about'));
      if (snap.exists()) data = snap.data();
    } catch (e) {
      console.warn('[Firestore] settings/about:', e.message);
    }
  }

  const history = data?.history
    ? String(data.history).split(/\n\s*\n/).map(p => esc(p.trim()))
    : DEFAULT_HISTORY;
  const mission = data?.mission ? esc(data.mission) : DEFAULT_MISSION;
  const vision = data?.vision ? esc(data.vision) : DEFAULT_VISION;
  const objectives = Array.isArray(data?.objectives) && data.objectives.length ? data.objectives.map(esc) : DEFAULT_OBJECTIVES;
  const facilities = Array.isArray(data?.facilities) ? data.facilities : [];

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'পরিচিতি',
      title: 'মাদ্রাসা পরিচিতি ও ইতিহাস',
      lead: 'ইসলামী মূল্যবোধ ও আধুনিক শিক্ষার সমন্বয়ে পার্বত্য খাগড়াছড়ির একটি দ্বীনি বিদ্যাপীঠ।'
    })}

    <div class="grid gap-10 lg:grid-cols-3">
      <section class="lg:col-span-2">
        ${renderSectionHeading('প্রতিষ্ঠা ও অগ্রযাত্রা')}
        <div class="space-y-4 text-[15px] leading-8 text-stone-600">
          ${history.map(p => `<p>${p}</p>`).join('')}
        </div>
      </section>

      <aside class="card h-fit p-6">
        <dl class="divide-y divide-stone-100 text-sm">
          ${[
            ['ইআইআইএন', SITE.eiin],
            ['প্রতিষ্ঠাকাল', SITE.establishedFull],
            ['ধরন', SITE.type],
            ['ব্যবস্থাপনা', SITE.management],
            ['শিক্ষা স্তর', SITE.level],
            ['শিক্ষার্থী', SITE.gender],
            ['অবস্থা', SITE.status],
            ['ঠিকানা', SITE.address]
          ].map(([k, v]) => `
            <div class="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <dt class="text-stone-500">${k}</dt>
              <dd class="text-right font-medium text-stone-800">${v}</dd>
            </div>
          `).join('')}
        </dl>
      </aside>
    </div>

    <section class="mt-14 rounded-2xl bg-brand-50/70 p-7 sm:p-9">
      <span class="eyebrow">বায়তুশ শরফ</span>
      <h2 class="mt-3 text-xl font-semibold text-brand-900">বায়তুশ শরফ পরিবারের একটি প্রতিষ্ঠান</h2>
      <p class="mt-3 max-w-3xl text-[15px] leading-8 text-stone-700">
        মাদ্রাসাটি বায়তুশ শরফ কমপ্লেক্সের প্রতিষ্ঠান-নেটওয়ার্কের অংশ। চট্টগ্রামের ধনিয়ালাপাড়ায় অবস্থিত বায়তুশ শরফ কমপ্লেক্সের
        প্রতিষ্ঠাতা শাহসুফি আবদুল জব্বার (রহ.)। সংগঠনটি দেশের বিভিন্ন জেলায় মাদ্রাসা, দাওয়াহ, স্বাস্থ্য ও সমাজসেবামূলক কার্যক্রম পরিচালনা করে।
      </p>
      <a href="https://baitushsharaf.org/madrasah?language=bn" target="_blank" rel="noopener" class="link mt-4 inline-block text-sm">baitushsharaf.org →</a>
    </section>

    <div class="mt-14 grid gap-5 md:grid-cols-2">
      <section class="card p-7">
        <span class="eyebrow">লক্ষ্য</span>
        <p class="mt-4 text-[15px] leading-8 text-stone-700">${mission}</p>
      </section>
      <section class="card p-7">
        <span class="eyebrow">দূরদৃষ্টি</span>
        <p class="mt-4 text-[15px] leading-8 text-stone-700">${vision}</p>
      </section>
    </div>

    <section class="mt-14">
      ${renderSectionHeading('শিক্ষাগত উদ্দেশ্য')}
      <ol class="grid gap-3 md:grid-cols-2">
        ${objectives.map((obj, i) => `
          <li class="flex gap-4 rounded-xl border border-stone-200/80 bg-white p-4 text-sm leading-relaxed text-stone-700">
            <span class="font-semibold text-gold-600">${String(i + 1).padStart(2, '0').replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d])}</span>
            <span>${obj}</span>
          </li>
        `).join('')}
      </ol>
    </section>

    ${facilities.length ? `
      <section class="mt-14">
        ${renderSectionHeading('ক্যাম্পাস সুবিধা')}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          ${facilities.map(f => `
            <div class="card p-5">
              <h3 class="font-semibold text-brand-900">${esc(f.title)}</h3>
              ${f.desc ? `<p class="mt-2 text-sm leading-relaxed text-stone-600">${esc(f.desc)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}
  `;
}
