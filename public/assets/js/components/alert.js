/**
 * Toast notifications
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { esc } from '../utils/escape.js';

const STYLES = {
  success: 'border-brand-200 bg-white text-brand-800 [&_.dot]:bg-brand-500',
  error: 'border-rose-200 bg-white text-rose-800 [&_.dot]:bg-rose-500',
  warning: 'border-amber-200 bg-white text-amber-800 [&_.dot]:bg-amber-500',
  info: 'border-stone-200 bg-white text-stone-700 [&_.dot]:bg-stone-400'
};

export function showAlert({ type = 'info', message = '', duration = 4500 } = {}) {
  let container = document.getElementById('global-alert-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-alert-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.className = 'fixed bottom-5 right-4 left-4 z-[60] flex flex-col items-end gap-2 sm:left-auto';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-stone-900/5 transition duration-300 translate-y-2 opacity-0 ${STYLES[type] || STYLES.info}`;
  el.innerHTML = `
    <span class="dot mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
    <span class="flex-1">${esc(message)}</span>
    <button type="button" class="text-stone-400 hover:text-stone-700" aria-label="বন্ধ করুন">✕</button>
  `;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.remove('translate-y-2', 'opacity-0'));

  const remove = () => {
    el.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => el.remove(), 300);
  };
  el.querySelector('button')?.addEventListener('click', remove);
  if (duration > 0) setTimeout(remove, duration);
}
