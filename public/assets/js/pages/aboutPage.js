/**
 * About Page
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Default text can be overridden from Firestore: settings/about
 * { history, mission, vision, objectives: [], facilities: [{title, desc}] }
 */

import { db, doc, getDoc } from '../firebase/config.js';
import { renderPageHeader, renderSectionHeading } from '../components/pageHeader.js';
import { esc } from '../utils/escape.js';
import { SITE } from '../site.js';

const DEFAULT_HISTORY = [
  'খাগড়াছড়ি পার্বত্য জেলায় দ্বীনি শিক্ষার আলো ছড়িয়ে দেওয়ার লক্ষ্যে ১৯৯৮ সালে খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা প্রতিষ্ঠিত হয়। বায়তুশ শরফের আদর্শে অনুপ্রাণিত হয়ে এবং স্থানীয় ধর্মপ্রাণ মানুষের সহযোগিতায় প্রতিষ্ঠানটি ধীরে ধীরে এ অঞ্চলের একটি পরিচিত দ্বীনি বিদ্যাপীঠে পরিণত হয়েছে।',
  'দাখিল ও আলিম স্তর বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের অধীনে এবং ফাজিল (ডিগ্রী) স্তর ইসলামী আরবি বিশ্ববিদ্যালয়ের অধিভুক্ত হয়ে পরিচালিত হচ্ছে।'
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
            ['প্রতিষ্ঠা সাল', SITE.established],
            ['ইআইআইএন', SITE.eiin],
            ['সর্বোচ্চ স্তর', SITE.level],
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
