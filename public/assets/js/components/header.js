/**
 * Site Header (top strip + identity + desktop navigation)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { SITE } from '../site.js';
import { renderNavigation } from './navigation.js';

export const OFFICIAL_LOGO_URL = SITE.logoUrl;

export function renderHeader(settings = {}, activePage = 'home') {
  return `
    <div class="bg-brand-900 text-brand-100">
      <div class="wrap flex h-9 items-center justify-between gap-4 text-xs">
        <span class="arabic text-sm text-gold-300" lang="ar">${SITE.bismillah}</span>
        <div class="flex items-center gap-4">
          <span class="hidden sm:inline">ইআইআইএন: <span class="text-white">${SITE.eiin}</span></span>
          <span id="header-phone" class="hidden md:inline">ফোন: <a class="text-white hover:underline" href="tel:${SITE.phone}">${SITE.phone}</a></span>
          <a href="mailto:${SITE.email}" class="hidden text-brand-100/80 transition hover:text-white lg:inline">${SITE.email}</a>
        </div>
      </div>
    </div>

    <header class="border-b border-stone-200/80 bg-white">
      <div class="wrap flex items-center justify-between gap-4 py-4">
        <a href="/" class="group flex min-w-0 items-center gap-3 sm:gap-4">
          <img
            src="${SITE.logoUrl}"
            alt="মাদ্রাসার লোগো"
            width="56" height="56"
            class="h-12 w-12 flex-shrink-0 rounded-full border border-stone-200 object-contain sm:h-14 sm:w-14"
            loading="eager"
          />
          <span class="min-w-0">
            <span class="block text-[11px] font-medium text-stone-500 sm:text-xs">খাগড়াছড়ি · স্থাপিত ${SITE.established}</span>
            <span class="block text-base font-bold leading-snug text-brand-900 transition group-hover:text-brand-700 sm:text-xl">
              ${SITE.shortName}
            </span>
          </span>
        </a>

        <div class="flex items-center gap-2">
          <a href="/admission.html" class="btn btn-primary hidden md:inline-flex">ভর্তি তথ্য</a>
          <button
            id="mobile-menu-btn"
            type="button"
            aria-label="মেনু খুলুন"
            aria-controls="mobile-menu-drawer"
            aria-expanded="false"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-brand-800 transition hover:bg-brand-50 lg:hidden"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
      ${renderNavigation(activePage)}
    </header>
  `;
}
