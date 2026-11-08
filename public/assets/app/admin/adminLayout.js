/**
 * Admin layout + authentication guard
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Every admin page calls initAdminPage(key). The page body stays hidden until
 * Firebase Auth confirms a signed-in administrator (ADMIN_UIDS in
 * firebase/config.js, or admins/{uid}) or an active moderator
 * (moderators/{uid}). Moderators only see the sections they were given.
 * Everyone else is sent to /admin/login.html.
 * (Real data protection is enforced by firestore.rules; this guard is UX.)
 */

import { auth, getStaffRole, onAuthStateChanged, signOut } from '../firebase/config.js';
import { SITE } from '../site.js';

const NAV = [
  ['dashboard', 'ড্যাশবোর্ড', '/admin/'],
  ['notices', 'নোটিশ', '/admin/notices.html'],
  ['admissions', 'ভর্তি আবেদন', '/admin/admissions.html'],
  ['messages', 'বার্তা', '/admin/messages.html'],
  ['students', 'শিক্ষার্থী ও ফলাফল', '/admin/students.html'],
  ['guardians', 'অভিভাবক', '/admin/guardians.html'],
  ['teachers', 'শিক্ষক', '/admin/teachers.html'],
  ['staff', 'কর্মচারী', '/admin/staff.html'],
  ['administration', 'পরিচালনা পর্ষদ', '/admin/administration.html'],
  ['departments', 'বিভাগ', '/admin/departments.html'],
  ['results', 'ফলাফল', '/admin/results.html'],
  ['routines', 'রুটিন', '/admin/routines.html'],
  ['calendar', 'ক্যালেন্ডার', '/admin/calendar.html'],
  ['downloads', 'ডাউনলোড', '/admin/downloads.html'],
  ['gallery', 'গ্যালারি', '/admin/gallery.html'],
  ['settings', 'সেটিংস ও বাণী', '/admin/settings.html'],
  ['moderators', 'মডারেটর', '/admin/moderators.html']
];

/** Sections a moderator can be given (everything except dashboard & moderator management) */
export const PERMISSION_SECTIONS = NAV.filter(([k]) => !['dashboard', 'moderators'].includes(k)).map(([key, label]) => ({ key, label }));

/** Pages that belong to another section's permission */
const PAGE_PERMISSION = { application: 'admissions', 'student-results': 'students' };

let currentRole = null;
/** Role of the signed-in staff member (available after initAdminPage resolves) */
export const getCurrentRole = () => currentRole;
export const can = (section) => currentRole?.role === 'admin' || (currentRole?.permissions || []).includes(section);

export function renderAdminHeader(activeNav = 'dashboard', email = '') {
  const isMod = currentRole?.role === 'moderator';
  const visibleNav = NAV.filter(([key]) => key === 'dashboard' || (key === 'moderators' ? !isMod : can(key)));
  return `
    <header class="border-b border-stone-200 bg-white">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/admin/" class="flex items-center gap-3">
          <img src="${SITE.logoUrl}" alt="" class="h-9 w-9 rounded-full border border-stone-200 object-contain" />
          <span class="leading-tight">
            <span class="block text-sm font-semibold text-brand-900">প্রশাসনিক প্যানেল</span>
            <span class="block text-[11px] text-stone-500">${SITE.shortName}</span>
          </span>
        </a>
        <div class="flex items-center gap-2 text-sm">
          ${isMod ? '<span class="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-600">মডারেটর</span>' : ''}
          ${email ? `<span class="hidden text-xs text-stone-500 md:inline">${email.replace(/[<>&"']/g, '')}</span>` : ''}
          <a href="/" target="_blank" rel="noopener" class="btn btn-outline px-3 py-1.5 text-xs">ওয়েবসাইট</a>
          <button id="admin-logout-btn" type="button" class="btn px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50">লগআউট</button>
        </div>
      </div>
      <nav class="border-t border-stone-100" aria-label="এডমিন মেনু">
        <div class="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          ${visibleNav.map(([key, label, url]) => `
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
 * @returns {Promise<import('firebase/auth').User>} resolves with the signed-in admin / moderator
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

      const role = await getStaffRole(user);
      if (!role || role.role === 'disabled') {
        await signOut(auth);
        return goLogin(role?.role === 'disabled' ? 'disabled' : 'forbidden');
      }
      currentRole = role;

      // Moderators may only open their own sections
      const section = PAGE_PERMISSION[activeNav] || activeNav;
      if (role.role === 'moderator' && section !== 'dashboard' && !can(section)) {
        window.location.replace('/admin/?denied=1');
        return;
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
