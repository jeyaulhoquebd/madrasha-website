/**
 * Breadcrumb Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderBreadcrumbs(items = []) {
  if (!items || items.length === 0) return '';

  return `
    <nav class="bg-stone-100/80 border-b border-stone-200 py-2.5 text-xs text-stone-600" aria-label="Breadcrumb">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol class="flex items-center flex-wrap gap-1 sm:gap-2">
          <li>
            <a href="/" class="hover:text-[#0B4619] inline-flex items-center gap-1 font-medium transition">
              <svg class="w-3.5 h-3.5 text-stone-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span>মূলপাতা</span>
            </a>
          </li>

          ${items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return `
              <li class="flex items-center gap-1 sm:gap-2">
                <svg class="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                ${isLast ? `
                  <span class="text-[#0B4619] font-semibold" aria-current="page">${item.label}</span>
                ` : `
                  <a href="${item.url || '#'}" class="hover:text-[#0B4619] font-medium transition">${item.label}</a>
                `}
              </li>
            `;
          }).join('')}
        </ol>
      </div>
    </nav>
  `;
}
