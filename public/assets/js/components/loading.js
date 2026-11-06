/**
 * Loading Spinner & Skeleton Components
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function renderLoadingSpinner(message = 'তথ্য লোড হচ্ছে...') {
  return `
    <div class="py-12 flex flex-col items-center justify-center text-center space-y-3">
      <div class="relative w-12 h-12">
        <div class="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-[#0B4619] animate-spin"></div>
        <div class="absolute inset-2 w-8 h-8 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" style="animation-direction: reverse; animation-duration: 0.8s;"></div>
      </div>
      <p class="text-sm font-medium text-stone-600 animate-pulse">${message}</p>
    </div>
  `;
}

export function renderSkeletonCards(count = 3) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${Array.from({ length: count }).map(() => `
        <div class="bg-white rounded-lg border border-stone-200 p-5 shadow-xs animate-pulse space-y-3">
          <div class="h-4 bg-stone-200 rounded w-1/3"></div>
          <div class="h-6 bg-stone-200 rounded w-4/5"></div>
          <div class="space-y-2 pt-2">
            <div class="h-3 bg-stone-100 rounded"></div>
            <div class="h-3 bg-stone-100 rounded w-5/6"></div>
          </div>
          <div class="pt-3 border-t border-stone-100 flex justify-between">
            <div class="h-3 bg-stone-200 rounded w-1/4"></div>
            <div class="h-3 bg-stone-200 rounded w-1/4"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
