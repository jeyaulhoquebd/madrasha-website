/**
 * Empty State
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Shown whenever verified data has not been published yet.
 */

const ICONS = {
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a1 1 0 0 1 .7.3l5.4 5.4a1 1 0 0 1 .3.7V19a2 2 0 0 1-2 2z',
  users: 'M17 20h5v-2a3 3 0 0 0-5.4-1.9M17 20H7m10 0v-2c0-.7-.1-1.3-.4-1.9M7 20H2v-2a3 3 0 0 1 5.4-1.9M7 20v-2c0-.7.1-1.3.4-1.9m0 0a5 5 0 0 1 9.2 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  bell: 'M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
  photo: 'M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
  folder: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z'
};

export function renderEmptyState({
  title = 'তথ্য শীঘ্রই প্রকাশিত হবে',
  message = 'এই বিভাগের তথ্য এখনও প্রকাশ করা হয়নি। প্রশাসনিকভাবে হালনাগাদ করা হলে এখানে দেখা যাবে।',
  icon = 'document',
  actionText = '',
  actionUrl = ''
} = {}) {
  return `
    <div class="mx-auto max-w-md px-6 py-12 text-center">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[icon] || ICONS.document}"/></svg>
      </div>
      <h3 class="text-base font-semibold text-stone-800">${title}</h3>
      <p class="mt-2 text-sm leading-relaxed text-stone-500">${message}</p>
      ${actionText && actionUrl ? `<a href="${actionUrl}" class="btn btn-outline mt-5">${actionText}</a>` : ''}
    </div>
  `;
}
