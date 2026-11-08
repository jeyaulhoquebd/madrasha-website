/**
 * Staff Directory
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: staff { name, designation, section, photoUrl, displayOrder }
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { mountDirectory } from '../components/directory.js';
import { esc } from '../utils/escape.js';

export async function initStaffPage() {
  const container = document.getElementById('staff-page-container');
  if (!container) return;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'প্রশাসন',
      title: 'কর্মকর্তা ও কর্মচারীবৃন্দ',
      lead: 'অফিস ব্যবস্থাপনা ও ক্যাম্পাসের দৈনন্দিন কার্যক্রমে নিয়োজিত সহকর্মীবৃন্দ।'
    })}
    <div id="staff-directory"><p class="py-12 text-center text-sm text-stone-400">লোড হচ্ছে...</p></div>
  `;

  const staff = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'staff'), orderBy('displayOrder', 'asc')));
      snap.forEach(d => staff.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] staff:', e.message);
    }
  }

  mountDirectory({
    root: document.getElementById('staff-directory'),
    items: staff,
    searchPlaceholder: 'নাম বা পদবি লিখে খুঁজুন',
    searchFields: ['name', 'designation', 'section'],
    meta: s => (s.section ? `<span class="tag mt-3">${esc(s.section)}</span>` : ''),
    empty: {
      title: 'তালিকা শীঘ্রই প্রকাশিত হবে',
      message: 'কর্মকর্তা ও কর্মচারীদের হালনাগাদ তথ্য প্রশাসনিক অনুমোদনের পর এখানে প্রকাশ করা হবে।',
      icon: 'users'
    }
  });
}
