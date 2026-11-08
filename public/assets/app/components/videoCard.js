/**
 * Inline video cards (YouTube & Facebook) — the video plays inside the card,
 * no pop-up.
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Preview ("thumbnail") rules:
 *   - YouTube: YouTube's own thumbnail (or an uploaded image) + play button;
 *     a tap swaps it for the player, which starts immediately.
 *   - Facebook with an uploaded preview image: same as above.
 *   - Facebook without one: Facebook's own player is embedded straight away
 *     (lazily, when the card scrolls into view), which shows the video's
 *     preview frame and plays in place.
 */

import { esc, safeUrl } from '../utils/escape.js';
import { cdnImage } from '../utils/cloudinary.js';
import { parseVideo } from '../utils/video.js';

const PLAY_ICON = `<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`;

/** Player URL sized to the box it is shown in */
function playerUrl(video, box, autoplay) {
  if (video.provider === 'youtube') {
    return video.embed.replace('autoplay=1', `autoplay=${autoplay ? 1 : 0}`) + '&playsinline=1';
  }
  const w = Math.max(220, Math.round(box.clientWidth));
  const h = Math.max(180, Math.round(box.clientHeight));
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=false&width=${w}&height=${h}&autoplay=${autoplay}&mute=0`;
}

function mountPlayer(box, video, autoplay) {
  box.innerHTML = `<iframe src="${esc(playerUrl(video, box, autoplay))}" title="ভিডিও" class="absolute inset-0 h-full w-full border-0"
    scrolling="no" loading="lazy" allowfullscreen
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"></iframe>`;
  box.dataset.mounted = '1';
}

/** True when the item has a real preview image (uploaded, or YouTube's) */
function previewImage(v, video) {
  const img = v.imageUrl || v.thumbnailUrl || video.thumbnail || '';
  return img;
}

export function renderVideoCard(v, index) {
  const video = parseVideo(v.videoUrl);
  if (!video) return '';
  const vertical = v.vertical ?? video.vertical;
  const poster = previewImage(v, video);
  const badge = `${video.provider === 'facebook' ? 'Facebook' : 'YouTube'}${vertical ? ' · রিল' : ''}`;

  return `
    <article class="card overflow-hidden ${vertical ? 'mx-auto w-full max-w-[22rem]' : ''}">
      <div class="relative ${vertical ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden bg-stone-900"
        data-video-box="${index}" data-mode="${poster ? 'poster' : 'auto'}">
        ${poster ? `
          <button type="button" class="group absolute inset-0 h-full w-full" aria-label="${esc(v.title)} — ভিডিও চালান">
            <img src="${safeUrl(cdnImage(poster, { width: vertical ? 480 : 800 }))}" alt="" class="h-full w-full object-cover" loading="lazy" />
            <span class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></span>
            <span class="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/95 pl-1 text-brand-800 shadow-lg transition group-hover:scale-110">${PLAY_ICON}</span>
            <span class="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-white">${badge}</span>
          </button>
        ` : `
          <div class="absolute inset-0 flex items-center justify-center text-xs text-white/60">ভিডিও লোড হচ্ছে...</div>
        `}
      </div>
      <div class="p-4">
        <h3 class="font-medium leading-snug text-stone-800">${esc(v.title)}</h3>
        ${v.description ? `<p class="mt-1 line-clamp-2 text-sm text-stone-500">${esc(v.description)}</p>` : ''}
      </div>
    </article>
  `;
}

/**
 * Activates the cards rendered by renderVideoCard inside `container`.
 * @param {HTMLElement} container
 * @param {Array} videos same array (and order) used for rendering
 */
export function initVideoCards(container, videos) {
  const boxes = [...container.querySelectorAll('[data-video-box]')];
  const posters = new Map(); // box → its preview markup, to restore when another video starts

  const activate = (box) => {
    const video = parseVideo(videos[Number(box.dataset.videoBox)]?.videoUrl);
    const button = box.querySelector('button');
    if (!video || !button) return;
    button.addEventListener('click', () => {
      // Only one video plays at a time: put the others back to their preview
      posters.forEach((html, other) => {
        if (other !== box && other.dataset.mounted) {
          other.innerHTML = html;
          delete other.dataset.mounted;
          activate(other);
        }
      });
      mountPlayer(box, video, true);
    });
  };

  boxes.forEach(box => {
    if (box.dataset.mode === 'poster') {
      posters.set(box, box.innerHTML);
      activate(box);
    }
  });

  // Facebook videos without a preview image: embed the player when visible
  const auto = boxes.filter(b => b.dataset.mode === 'auto' && !b.dataset.mounted);
  if (!auto.length) return;
  const mountAuto = box => {
    const video = parseVideo(videos[Number(box.dataset.videoBox)]?.videoUrl);
    if (video) mountPlayer(box, video, false);
  };
  if (!('IntersectionObserver' in window)) {
    auto.forEach(mountAuto);
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      mountAuto(entry.target);
    });
  }, { rootMargin: '200px' });
  auto.forEach(b => io.observe(b));
}
