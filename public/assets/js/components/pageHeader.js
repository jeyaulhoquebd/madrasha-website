/**
 * Minimal page title block shared by all inner pages
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

export function renderPageHeader({ eyebrow = '', title = '', lead = '', align = 'left' } = {}) {
  const center = align === 'center';
  return `
    <header class="mb-10 border-b border-stone-200/80 pb-8 ${center ? 'text-center' : ''}">
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
      <h1 class="mt-3 text-3xl font-bold leading-snug text-brand-900 sm:text-4xl">${title}</h1>
      ${lead ? `<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600 ${center ? 'mx-auto' : ''}">${lead}</p>` : ''}
    </header>
  `;
}

/** Small section heading used inside pages */
export function renderSectionHeading(title, aside = '') {
  return `
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 class="text-xl font-semibold text-brand-900">${title}</h2>
      ${aside}
    </div>
  `;
}
