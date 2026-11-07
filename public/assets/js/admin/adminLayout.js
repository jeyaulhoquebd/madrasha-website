/**
 * Admin layout + authentication guard
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 *
 * Every admin page calls initAdminPage(key). The page body stays hidden until
 * Firebase Auth confirms a signed-in user who also has a document in
 * admins/{uid}. Everyone else is sent to /admin/login.html.
 * (Real data protection is enforced by firestore.rules; this guard is UX.)
 */

import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from '../firebase/config.js';
import { SITE } from '../site.js';

const NAV = [
  ['dashboard', 'ড্যাশবোর্ড', '/admin/index.html'],
  ['notices', 'নোটিশ', '/admin/notices.html'],
  ['teachers', 'শিক্ষক', '/admin/teachers.html'],
  ['staff', 'কর্মচারী', '/admin/staff.html'],
  ['departments', 'বিভাগ', '/admin/departments.html'],
  ['admissions', 'ভর্তি আবেদন', '/admin/admissions.html'],
  ['results', 'ফলাফল', '/admin/results.html'],
  ['routines', 'রুটিন', '/admin/routines.html'],
  ['downloads', 'ডাউনলোড', '/admin/downloads.html'],
  ['gallery', 'গ্যালারি', '/admin/gallery.html'],
  ['settings', 'সেটিংস', '/admin/settings.html']
];

export function renderAdminHeader(activeNav = 'dashboard', email = '') {
  return `
    <header class="border-b border-stone-200 bg-white">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/admin/index.html" class="flex items-center gap-3">
          <img src="${SITE.logoUrl}" alt="" class="h-9 w-9 rounded-full border border-stone-200 object-contain" />
          <span class="leading-tight">
            <span class="block text-sm font-semibold text-brand-900">প্রশাসনিক প্যানেল</span>
            <span class="block text-[11px] text-stone-500">${SITE.shortName}</span>
          </span>
        </a>
        <div class="flex items-center gap-2 text-sm">
          ${email ? `<span class="hidden text-xs text-stone-500 md:inline">${email.replace(/[<>&"']/g, '')}</span>` : ''}
          <a href="/" target="_blank" rel="noopener" class="btn btn-outline px-3 py-1.5 text-xs">ওয়েবসাইট</a>
          <button id="admin-logout-btn" type="button" class="btn px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50">লগআউট</button>
        </div>
      </div>
      <nav class="border-t border-stone-100" aria-label="এডমিন মেনু">
        <div class="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          ${NAV.map(([key, label, url]) => `
            <a href="${url}" class="relative whitespace-nowrap px-3 py-3 text-sm transition ${
              key === activeNav
                ? 'font-semibold text-brand-800 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-gold-500'
                : 'text-stone-500 hover:text-brand-700'
            }">${label}</a>
          `).join('')}
        </div>
      </nav>
    </header>
  `;
}

/**
 * Renders the admin chrome and enforces authentication.
 * @returns {Promise<import('firebase/auth').User>} resolves with the signed-in admin
 */
export function initAdminPage(activeNav = 'dashboard') {
  document.body.classList.add('invisible');

  return new Promise((resolve) => {
    const goLogin = (reason = '') => {
      window.location.replace('/admin/login.html' + (reason ? `?reason=${reason}` : ''));
    };

    if (!auth) return goLogin('standby');

    onAuthStateChanged(auth, async (user) => {
      if (!user) return goLogin();

      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (!adminDoc.exists()) {
          await signOut(auth);
          return goLogin('forbidden');
        }
      } catch (e) {
        await signOut(auth);
        return goLogin('forbidden');
      }

      const slot = document.getElementById('admin-header-slot');
      if (slot) slot.innerHTML = renderAdminHeader(activeNav, user.email || '');
      document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
        await signOut(auth);
        window.location.replace('/admin/login.html');
      });

      document.body.classList.remove('invisible');
      resolve(user);
    });
  });
}
