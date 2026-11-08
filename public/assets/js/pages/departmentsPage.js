/**
 * Departments Page
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: departments { name, category, description, subjects[], admissionInfo, displayOrder }
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc } from '../utils/escape.js';

// Shown until departments are published in Firestore (general Fazil-madrasa curriculum; no unverified branches)
const DEFAULT_DEPARTMENTS = [
  {
    name: 'আরবি ও ইসলামী শিক্ষা',
    category: 'সকল স্তর',
    description: 'কুরআন, হাদিস, ফিকহ ও আরবি ভাষা — মাদ্রাসা শিক্ষার মূল ভিত্তি, যা প্রতিটি শিক্ষার্থীর জন্য আবশ্যিক।',
    subjects: ['কুরআন মাজিদ ও তাজবিদ', 'হাদিস শরিফ', 'আকাইদ ও ফিকহ', 'আরবি ভাষা ও সাহিত্য']
  },
  {
    name: 'সাধারণ ও আধুনিক বিষয়',
    category: 'ইবতেদায়ী থেকে ফাজিল',
    description: 'দ্বীনি বিষয়ের পাশাপাশি জাতীয় শিক্ষাক্রমের বাংলা, ইংরেজি, গণিত, বিজ্ঞান, সমাজবিজ্ঞান ও তথ্যপ্রযুক্তি।',
    subjects: ['বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'তথ্যপ্রযুক্তি', 'ইসলামের ইতিহাস']
  },
  {
    name: 'ফাজিল (স্নাতক)',
    category: 'ইসলামী আরবি বিশ্ববিদ্যালয়',
    description: 'আলিম বা সমমান উত্তীর্ণ শিক্ষার্থীদের জন্য স্নাতক (পাস) সমমানের কোর্স।',
    subjects: ['তাফসির', 'হাদিস', 'ফিকহ', 'আকাইদ', 'আরবি সাহিত্য', 'ইসলামের ইতিহাস', 'বাংলা', 'ইংরেজি']
  }
];

export async function initDepartmentsPage() {
  const container = document.getElementById('departments-grid-container');
  if (!container) return;

  let departments = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'departments'), orderBy('displayOrder', 'asc')));
      snap.forEach(d => departments.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] departments:', e.message);
    }
  }
  if (departments.length === 0) departments = DEFAULT_DEPARTMENTS;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'একাডেমিক',
      title: 'বিভাগ ও শাখা',
      lead: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড ও ইসলামী আরবি বিশ্ববিদ্যালয়ের শিক্ষাক্রম অনুযায়ী পরিচালিত।'
    })}

    <div class="grid gap-5 md:grid-cols-2">
      ${departments.map(d => `
        <article class="card flex flex-col p-6">
          <span class="text-xs font-medium text-gold-600">${esc(d.category || '')}</span>
          <h2 class="mt-2 text-lg font-semibold text-brand-900">${esc(d.name)}</h2>
          <p class="mt-3 text-sm leading-relaxed text-stone-600">${esc(d.description || '')}</p>
          ${Array.isArray(d.subjects) && d.subjects.length ? `
            <ul class="mt-4 flex flex-wrap gap-2">
              ${d.subjects.map(s => `<li class="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-700">${esc(s)}</li>`).join('')}
            </ul>
          ` : ''}
          ${d.admissionInfo ? `<p class="mt-4 border-t border-stone-100 pt-3 text-xs leading-relaxed text-stone-500">${esc(d.admissionInfo)}</p>` : ''}
        </article>
      `).join('')}
    </div>

    <div class="mt-10 text-center">
      <a href="/admission.html" class="btn btn-primary">ভর্তি তথ্য দেখুন</a>
    </div>
  `;
}
