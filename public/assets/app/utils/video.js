/**
 * Video link parser (YouTube & Facebook)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Accepts any of:
 *   - a full <iframe ...> embed code copied from Facebook / YouTube
 *   - https://www.facebook.com/plugins/video.php?href=...   (Facebook embed link)
 *   - https://www.facebook.com/reel/123..., /watch?v=..., /<page>/videos/..., fb.watch/...
 *   - https://www.youtube.com/watch?v=..., youtu.be/..., /shorts/..., /embed/..., /live/...
 *
 * Returns null when the input is not a supported video.
 */

const decodeEntities = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export function parseVideo(input) {
  let raw = String(input || '').trim();
  if (!raw) return null;

  // 1. Pasted <iframe> embed code → take its src
  if (/<iframe/i.test(raw)) {
    const m = /src\s*=\s*["']([^"']+)["']/i.exec(raw);
    if (!m) return null;
    raw = decodeEntities(m[1]).trim();
  }
  if (raw.startsWith('//')) raw = 'https:' + raw;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|web|mobile)\./, '');

  // 2. YouTube
  if (['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'music.youtube.com'].includes(host)) {
    const id = /(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/.exec(url.href)?.[1];
    if (!id) return null;
    return {
      provider: 'youtube',
      url: `https://www.youtube.com/watch?v=${id}`,
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      vertical: /\/shorts\//.test(url.pathname)
    };
  }

  // 3. Facebook
  if (host === 'facebook.com' || host === 'fb.watch') {
    let videoPage = url.href;
    // embed link → the real video address is in the "href" parameter
    if (url.pathname.startsWith('/plugins/video.php')) {
      videoPage = url.searchParams.get('href') || '';
      if (!videoPage) return null;
    }
    let page;
    try {
      page = new URL(videoPage);
    } catch {
      return null;
    }
    const isVideo = page.hostname.endsWith('fb.watch')
      || /\/(reel|reels|videos|watch|share\/v|share\/r)\b/.test(page.pathname)
      || page.searchParams.has('v');
    if (!isVideo) return null;
    const clean = page.origin.replace('://m.', '://www.').replace('://web.', '://www.') + page.pathname + (page.searchParams.has('v') ? `?v=${page.searchParams.get('v')}` : '');
    const vertical = /\/(reel|reels|share\/r)\b/.test(page.pathname);
    return {
      provider: 'facebook',
      url: clean,
      embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=false&autoplay=true${vertical ? '&width=267&height=476' : '&width=560&height=315'}`,
      thumbnail: '',
      vertical
    };
  }

  return null;
}
