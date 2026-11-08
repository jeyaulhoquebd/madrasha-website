/**
 * Cloudflare Pages Function: POST /api/verify-turnstile
 * Server-side validation of a Cloudflare Turnstile token.
 *
 * The secret key is NOT stored in the code. Add it in
 * Cloudflare Dashboard → Workers & Pages → (project) → Settings →
 * Variables and Secrets → Add → Type "Secret", Name: TURNSTILE_SECRET_KEY
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

export async function onRequestPost({ request, env }) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ success: false, error: 'not-configured' }, 500);
  }

  let token = '';
  try {
    ({ token } = await request.json());
  } catch {
    return json({ success: false, error: 'bad-request' }, 400);
  }
  if (!token || typeof token !== 'string' || token.length > 2048) {
    return json({ success: false, error: 'missing-token' }, 400);
  }

  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch(SITEVERIFY_URL, { method: 'POST', body: form });
    const outcome = await res.json();
    return json({ success: Boolean(outcome.success), errors: outcome['error-codes'] || [] }, outcome.success ? 200 : 403);
  } catch {
    return json({ success: false, error: 'verify-failed' }, 502);
  }
}

export function onRequest() {
  return json({ success: false, error: 'method-not-allowed' }, 405);
}
