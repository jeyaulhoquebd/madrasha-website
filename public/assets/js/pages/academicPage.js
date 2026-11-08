/**
 * Academic Page
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: settings/academic { overview }, calendar { title, period, description, date }
 */

import { db, doc, getDoc, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { renderPageHeader, renderSectionHeading } from '../components/pageHeader.js';
import { renderEmptyState } from '../components/emptyState.js';
import { esc } from '../utils/escape.js';

const LEVELS = [
  {
    name: 'ইবতেদায়ী',
    range: 'প্রাথমিক স্তর',
    body: 'কুরআন-তাজবিদ, আরবি, ইসলামিয়াত, বাংলা, ইংরেজি, গণিত, সমাজ ও বিজ্ঞান।',
    note: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড'
  },
  {
    name: 'দাখিল',
    range: 'মাধ্যমিক · এসএসসি সমমান',
    body: 'কুরআন-তাজবিদ, আরবি, ইসলামিয়াত, বাংলা, ইংরেজি, গণিত, বিজ্ঞান ও সমাজবিজ্ঞান।',
    note: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড'
  },
  {
    name: 'আলিম',
    range: 'উচ্চ মাধ্যমিক · এইচএসসি সমমান',
    body: 'কুরআন ও সুন্নাহ, হাদিস, ফিকহ, আরবি, ইসলামের ইতিহাস, বাংলা, ইংরেজি ও তথ্যপ্রযুক্তি।',
    note: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড'
  },
  {
    name: 'ফাজিল (পাস)',
    range: 'স্নাতক (ডিগ্রি) সমমান',
    body: 'তাফসির, হাদিস, ফিকহ, আকাইদ, আরবি সাহিত্য, ইসলামের ইতিহাস, বাংলা ও ইংরেজি।',
    note: 'ইসলামী আরবি বিশ্ববিদ্যালয়'
  }
];

export async function initAcademicPage() {
  const container = document.getElementById('academic-dynamic-content');
  if (!container) return;

  let overview = 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের শিক্ষাক্রম এবং ইসলামী আরবি বিশ্ববিদ্যালয়ের নির্ধারিত সিলেবাস অনুসরণ করে পাঠদান করা হয়। দ্বীনি জ্ঞানের সাথে আধুনিক বিষয়ের সমন্বয়ই এখানকার শিক্ষার মূল বৈশিষ্ট্য।';
  const events = [];

  if (db) {
    try {
      const [snap, calSnap] = await Promise.all([
        getDoc(doc(db, 'settings', 'academic')),
        getDocs(query(collection(db, 'calendar'), orderBy('date', 'asc')))
      ]);
      if (snap.exists() && snap.data().overview) overview = esc(snap.data().overview);
      calSnap.forEach(d => events.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] academic:', e.message);
    }
  }

  container.innerHTML = `
    ${renderPageHeader({ eyebrow: 'একাডেমিক', title: 'শিক্ষা কার্যক্রম', lead: overview })}

    <section>
      ${renderSectionHeading('শিক্ষা স্তর', '<a href="/departments.html" class="link text-sm">বিভাগসমূহ →</a>')}
      <div class="grid gap-5 md:grid-cols-2">
        ${LEVELS.map((l, i) => `
          <article class="card p-6">
            <div class="flex items-baseline justify-between gap-3">
              <h3 class="text-lg font-semibold text-brand-900">${l.name}</h3>
              <span class="text-sm font-semibold text-gold-600">০${'১২৩৪'[i]}</span>
            </div>
            <p class="mt-1 text-xs text-stone-500">${l.range}</p>
            <p class="mt-4 text-sm leading-relaxed text-stone-600">${l.body}</p>
            <p class="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">${l.note}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="mt-14">
      ${renderSectionHeading('একাডেমিক ক্যালেন্ডার', '<a href="/downloads.html" class="link text-sm">ডাউনলোড →</a>')}
      ${events.length ? `
        <div class="card overflow-x-auto">
          <table class="w-full min-w-[540px] text-left text-sm">
            <thead class="border-b border-stone-100 text-xs text-stone-500">
              <tr><th class="px-5 py-3 font-medium">কার্যক্রম</th><th class="px-5 py-3 font-medium">সময়কাল</th><th class="px-5 py-3 font-medium">বিবরণ</th></tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              ${events.map(e => `
                <tr>
                  <td class="px-5 py-3.5 font-medium text-stone-800">${esc(e.title)}</td>
                  <td class="px-5 py-3.5 text-stone-600">${esc(e.period || '')}</td>
                  <td class="px-5 py-3.5 text-stone-600">${esc(e.description || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `<div class="card">${renderEmptyState({
        title: 'ক্যালেন্ডার শীঘ্রই প্রকাশিত হবে',
        message: 'চলতি শিক্ষাবর্ষের একাডেমিক ক্যালেন্ডার প্রকাশিত হলে এখানে দেখা যাবে।',
        icon: 'calendar'
      })}</div>`}
    </section>
  `;
}
