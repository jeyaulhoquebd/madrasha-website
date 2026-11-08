/**
 * HTML escaping helpers
 * Every value that comes from Firestore (or any user input) must pass through
 * esc() before it is placed inside an HTML template string.
 */

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/**
 * Escapes a value for safe use in HTML text and quoted attributes.
 * @param {unknown} value
 * @returns {string}
 */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"'`]/g, ch => HTML_ESCAPES[ch]);
}

/**
 * Returns a URL only if it uses a safe scheme (http, https, mailto, tel) or is relative.
 * Anything else (e.g. javascript:) becomes the fallback.
 * @param {unknown} url
 * @param {string} [fallback='#']
 * @returns {string} escaped URL
 */
export function safeUrl(url, fallback = '#') {
  if (!url) return esc(fallback);
  const value = String(url).trim();
  if (/^(https?:|mailto:|tel:|\/|\.\/|#)/i.test(value)) return esc(value);
  return esc(fallback);
}
