/**
 * Empty State Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Displays dignified, verified empty states when administrative data is not yet published
 */

export function renderEmptyState({
  title = 'তথ্য অনুপলব্ধ',
  message = 'বর্তমানে এই বিভাগে কোনো তথ্য অন্তর্ভুক্ত নেই। প্রশাসনিকভাবে তথ্য হালনাগাদ করা হলে তা এখানে প্রদর্শিত হবে।',
  icon = 'document',
  actionText = '',
  actionUrl = ''
} = {}) {
  const icons = {
    document: `<svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
    users: `<svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
    bell: `<svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`,
    calendar: `<svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
    photo: `<svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
    folder: `<svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`
  };

  const selectedIcon = icons[icon] || icons.document;

  return `
    <div class="bg-white rounded-xl border border-dashed border-stone-300 p-8 sm:p-12 text-center max-w-lg mx-auto my-6 shadow-xs">
      <div class="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-[#0B4619]">
        ${selectedIcon}
      </div>
      <h3 class="text-base sm:text-lg font-bold text-slate-800 mb-2">${title}</h3>
      <p class="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">${message}</p>
      ${actionText && actionUrl ? `
        <a href="${actionUrl}" class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-semibold rounded-lg shadow-xs transition">
          ${actionText}
        </a>
      ` : ''}
    </div>
  `;
}
