/**
 * Breadcrumb
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderBreadcrumbs(items = []) {
  if (!items || items.length === 0) return '';

  const sep = `<span class="text-stone-300" aria-hidden="true">/</span>`;

  return `
    <nav class="border-b border-stone-200/70 bg-white/60" aria-label="Breadcrumb">
      <ol class="wrap flex flex-wrap items-center gap-2 py-2.5 text-xs text-stone-500">
        <li><a href="/" class="hover:text-brand-700">মূলপাতা</a></li>
        ${items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return `<li class="flex items-center gap-2">${sep}${
            isLast || !item.url
              ? `<span class="font-medium text-stone-700" ${isLast ? 'aria-current="page"' : ''}>${item.label}</span>`
              : `<a href="${item.url}" class="hover:text-brand-700">${item.label}</a>`
          }</li>`;
        }).join('')}
      </ol>
    </nav>
  `;
}
