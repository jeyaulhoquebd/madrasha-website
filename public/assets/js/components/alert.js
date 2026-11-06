/**
 * Alert & Toast Notification Component
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

export function showAlert({
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  message = '',
  duration = 4000
} = {}) {
  let alertContainer = document.getElementById('global-alert-container');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'global-alert-container';
    alertContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full px-4 sm:px-0';
    document.body.appendChild(alertContainer);
  }

  const styles = {
    success: 'bg-[#0B4619] text-white border-emerald-600',
    error: 'bg-rose-800 text-white border-rose-600',
    warning: 'bg-amber-600 text-white border-amber-500',
    info: 'bg-slate-800 text-white border-slate-700'
  };

  const icons = {
    success: `<svg class="w-5 h-5 text-amber-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
    error: `<svg class="w-5 h-5 text-rose-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
    warning: `<svg class="w-5 h-5 text-amber-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
    info: `<svg class="w-5 h-5 text-blue-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
  };

  const alertEl = document.createElement('div');
  alertEl.className = `p-3.5 rounded-lg shadow-lg border text-xs sm:text-sm flex items-center justify-between gap-3 transform transition-all duration-300 translate-y-2 opacity-0 ${styles[type] || styles.info}`;
  
  alertEl.innerHTML = `
    <div class="flex items-center gap-2.5">
      ${icons[type] || icons.info}
      <span class="font-medium">${message}</span>
    </div>
    <button class="opacity-70 hover:opacity-100 p-1 text-white focus:outline-hidden" aria-label="বন্ধ করুন">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  alertContainer.appendChild(alertEl);

  // Trigger animation
  requestAnimationFrame(() => {
    alertEl.classList.remove('translate-y-2', 'opacity-0');
  });

  const closeBtn = alertEl.querySelector('button');
  const removeAlert = () => {
    alertEl.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => alertEl.remove(), 300);
  };

  closeBtn?.addEventListener('click', removeAlert);

  if (duration > 0) {
    setTimeout(removeAlert, duration);
  }
}
