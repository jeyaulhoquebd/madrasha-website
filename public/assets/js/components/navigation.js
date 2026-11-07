/**
 * Desktop Navigation
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

import { NAV_ITEMS, isNavActive } from '../site.js';

const chevron = `<svg class="h-3.5 w-3.5 opacity-60 transition group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>`;

function linkClass(active) {
  return `relative inline-flex items-center gap-1 px-3 py-3 text-sm font-medium transition ${
    active
      ? 'text-brand-800 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-gold-500'
      : 'text-stone-600 hover:text-brand-700'
  }`;
}

export function renderNavigation(activePage = 'home') {
  const items = NAV_ITEMS.map(item => {
    const active = isNavActive(item, activePage);

    if (!item.children) {
      return `<a href="${item.url}" class="${linkClass(active)}" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`;
    }

    return `
      <div class="group relative">
        <button type="button" class="${linkClass(active)}" aria-haspopup="true">
          ${item.label} ${chevron}
        </button>
        <div class="invisible absolute left-0 top-full z-50 w-56 translate-y-1 pt-1 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div class="overflow-hidden rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg shadow-stone-900/5">
            ${item.children.map(child => `
              <a href="${child.url}" class="block rounded-lg px-3 py-2 text-sm transition ${
                child.key === activePage ? 'bg-brand-50 font-semibold text-brand-800' : 'text-stone-600 hover:bg-stone-50 hover:text-brand-700'
              }">${child.label}</a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <nav class="hidden border-t border-stone-100 lg:block" aria-label="প্রধান মেনু">
      <div class="wrap flex items-center gap-1">${items}</div>
    </nav>
  `;
}
