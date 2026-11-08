/**
 * Cloudflare Turnstile ("আপনি কি মানুষ?") widget
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Client side uses the public SITE KEY. Every token is then checked on the
 * server by the Pages Function /api/verify-turnstile (functions/api/), which
 * holds the SECRET KEY as a Cloudflare environment secret.
 */

export const TURNSTILE_SITE_KEY = '0x4AAAAAAF4X6j-GuTv9-Vmc';

// Cloudflare's official always-pass test key, used only on localhost
const TEST_SITE_KEY = '1x00000000000000000000AA';
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

let scriptPromise;
function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = () => reject(new Error('Turnstile load failed'));
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/**
 * Renders the widget inside `el`.
 * @returns {{ getToken: () => string, reset: () => void }}
 */
export function mountTurnstile(el, { action = 'form' } = {}) {
  let token = '';
  let widgetId = null;

  el.innerHTML = '<p class="text-xs text-stone-400">যাচাই লোড হচ্ছে...</p>';
  loadScript()
    .then(ts => {
      el.innerHTML = '';
      widgetId = ts.render(el, {
        sitekey: isLocal ? TEST_SITE_KEY : TURNSTILE_SITE_KEY,
        action,
        language: 'bn',
        theme: 'light',
        callback: t => { token = t; },
        'expired-callback': () => { token = ''; },
        'error-callback': () => { token = ''; }
      });
    })
    .catch(() => {
      el.innerHTML = '<p class="text-xs text-rose-600">মানব-যাচাই লোড হয়নি। পাতাটি রিফ্রেশ করুন।</p>';
    });

  return {
    getToken: () => token,
    reset: () => {
      token = '';
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
    }
  };
}

/**
 * Verifies a token on the server. Returns { ok, message }.
 */
export async function verifyHuman(token) {
  if (isLocal) return { ok: true }; // local development only
  if (!token) return { ok: false, message: '"আপনি কি মানুষ?" যাচাইটি সম্পন্ন করুন।' };

  try {
    const res = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json().catch(() => ({}));
    if (data.success) return { ok: true };
    if (data.error === 'not-configured') {
      return { ok: false, message: 'সার্ভারে মানব-যাচাই এখনো সেটআপ করা হয়নি (TURNSTILE_SECRET_KEY)। অফিসে যোগাযোগ করুন।' };
    }
    return { ok: false, message: 'মানব-যাচাই ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' };
  } catch {
    return { ok: false, message: 'মানব-যাচাই সার্ভারে পৌঁছানো যায়নি। ইন্টারনেট সংযোগ দেখুন।' };
  }
}

/** Markup block for forms */
export function turnstileSlot(id) {
  return `<div class="sm:col-span-2"><span class="field-label">মানব-যাচাই <span class="text-rose-600">*</span></span><div id="${id}" class="min-h-[65px]"></div></div>`;
}
