/**
 * Loading indicator
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

export function renderLoadingSpinner(message = 'তথ্য লোড হচ্ছে...') {
  return `
    <div class="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div class="h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600"></div>
      <p class="text-sm text-stone-500">${message}</p>
    </div>
  `;
}
