/**
 * Mobile Navigation Drawer
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { NAV_ITEMS, isNavActive, SITE } from '../site.js';

export function renderMobileMenu(activePage = 'home') {
  const links = NAV_ITEMS.map(item => {
    if (!item.children) {
      const active = isNavActive(item, activePage);
      return `<a href="${item.url}" class="block rounded-lg px-3 py-2.5 text-[15px] ${active ? 'bg-brand-50 font-semibold text-brand-800' : 'text-stone-700 hover:bg-stone-50'}">${item.label}</a>`;
    }
    return `
      <div class="pt-3">
        <p class="px-3 pb-1 text-xs font-semibold text-stone-400">${item.label}</p>
        ${item.children.map(child => `
          <a href="${child.url}" ${child.external ? 'target="_blank" rel="noopener"' : ''} class="block rounded-lg px-3 py-2.5 text-[15px] ${child.key === activePage ? 'bg-brand-50 font-semibold text-brand-800' : 'text-stone-700 hover:bg-stone-50'}">${child.label}</a>
        `).join('')}
      </div>
    `;
  }).join('');

  return `
    <div id="mobile-menu-backdrop" class="fixed inset-0 z-50 hidden bg-stone-900/40"></div>
    <aside id="mobile-menu-drawer" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs translate-x-full flex-col bg-white shadow-xl transition-transform duration-300" aria-label="মোবাইল মেনু" aria-hidden="true">
      <div class="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <div class="flex items-center gap-2.5">
          <img src="${SITE.logoUrl}" alt="" class="h-8 w-8 rounded-full border border-stone-200 object-contain" />
          <span class="text-sm font-bold text-brand-900">মেনু</span>
        </div>
        <button id="mobile-menu-close-btn" type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100" aria-label="মেনু বন্ধ করুন">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <nav class="flex-1 overflow-y-auto p-3">${links}</nav>
      <div class="space-y-2 border-t border-stone-100 p-4">
        <a href="/admission.html" class="btn btn-primary w-full">ভর্তি তথ্য</a>
        <a href="/guardian/login.html" class="btn btn-outline w-full">অভিভাবক লগইন / নিবন্ধন</a>
      </div>
    </aside>
  `;
}

export function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const drawer = document.getElementById('mobile-menu-drawer');
  if (!drawer) return;

  const setOpen = (open) => {
    backdrop?.classList.toggle('hidden', !open);
    drawer.classList.toggle('translate-x-full', !open);
    drawer.setAttribute('aria-hidden', String(!open));
    openBtn?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('overflow-hidden', open);
  };

  openBtn?.addEventListener('click', () => setOpen(true));
  closeBtn?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
