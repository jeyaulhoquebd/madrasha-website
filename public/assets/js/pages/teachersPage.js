/**
 * Teachers Directory
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Firestore: teachers { name, designation, department, subject, qualifications, email, photoUrl, displayOrder }
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { mountDirectory } from '../components/directory.js';
import { esc } from '../utils/escape.js';

export async function initTeachersPage() {
  const container = document.getElementById('teachers-page-container');
  if (!container) return;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'শিক্ষক মণ্ডলী',
      title: 'সম্মানিত শিক্ষকবৃন্দ',
      lead: 'কুরআন, হাদিস, আরবি সাহিত্য ও সাধারণ বিষয়ে পাঠদানকারী শিক্ষকমণ্ডলী।'
    })}
    <div id="teachers-directory"><p class="py-12 text-center text-sm text-stone-400">লোড হচ্ছে...</p></div>
  `;

  const teachers = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'teachers'), orderBy('displayOrder', 'asc')));
      snap.forEach(d => teachers.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] teachers:', e.message);
    }
  }

  mountDirectory({
    root: document.getElementById('teachers-directory'),
    items: teachers,
    searchPlaceholder: 'নাম, পদবি বা বিষয় লিখে খুঁজুন',
    searchFields: ['name', 'designation', 'subject', 'department'],
    filterField: 'department',
    filters: [
      { value: 'কুরআন', label: 'কুরআন ও হাদিস' },
      { value: 'আরবি', label: 'আরবি' },
      { value: 'বিজ্ঞান', label: 'বিজ্ঞান' },
      { value: 'সাধারণ', label: 'সাধারণ' }
    ],
    meta: t => `
      ${t.department ? `<span class="tag mt-3">${esc(t.department)}</span>` : ''}
      ${t.subject || t.qualifications ? `
        <dl class="mt-4 space-y-1 border-t border-stone-100 pt-3 text-left text-xs text-stone-600">
          ${t.subject ? `<div><dt class="inline text-stone-400">বিষয়: </dt><dd class="inline">${esc(t.subject)}</dd></div>` : ''}
          ${t.qualifications ? `<div><dt class="inline text-stone-400">যোগ্যতা: </dt><dd class="inline">${esc(t.qualifications)}</dd></div>` : ''}
        </dl>
      ` : ''}
    `,
    empty: {
      title: 'শিক্ষক তালিকা শীঘ্রই প্রকাশিত হবে',
      message: 'শিক্ষকদের হালনাগাদ তথ্য প্রশাসনিক অনুমোদনের পর এখানে প্রকাশ করা হবে।',
      icon: 'users'
    }
  });
}
