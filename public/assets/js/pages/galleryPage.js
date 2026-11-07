/**
 * Photo & Video Gallery
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Firestore: gallery { title, type: 'image'|'video', category, imageUrl, thumbnailUrl, videoUrl, description, createdAt }
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { renderPagination, initPagination } from '../components/pagination.js';
import { renderEmptyState } from '../components/emptyState.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';
import { SITE } from '../site.js';

const CATEGORIES = [
  { value: 'all', label: 'সকল' },
  { value: 'campus', label: 'ক্যাম্পাস' },
  { value: 'events', label: 'অনুষ্ঠান' },
  { value: 'sports', label: 'ক্রীড়া ও সাংস্কৃতিক' }
];
const PER_PAGE = 9;

let view = 'images';
let allImages = [];
let allVideos = [];
let filtered = [];
let category = 'all';
let page = 1;
let lightboxIndex = 0;

export async function initGalleryPage() {
  const container = document.getElementById('gallery-page-container');
  if (!container) return;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'গ্যালারি',
      title: 'ছবি ও ভিডিও',
      lead: 'ক্যাম্পাস, শিক্ষা কার্যক্রম ও বিভিন্ন অনুষ্ঠানের মুহূর্ত।'
    })}

    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div id="gallery-view-tabs" role="tablist" class="inline-flex rounded-lg border border-stone-200 bg-white p-1">
        <button type="button" role="tab" data-view="images" class="rounded-md px-4 py-1.5 text-sm font-medium">ছবি</button>
        <button type="button" role="tab" data-view="videos" class="rounded-md px-4 py-1.5 text-sm font-medium">ভিডিও</button>
      </div>
      <div id="image-categories-bar" class="flex flex-wrap gap-2">
        ${CATEGORIES.map(c => `<button type="button" data-cat="${c.value}" class="chip ${c.value === 'all' ? 'chip-active' : ''}">${c.label}</button>`).join('')}
      </div>
    </div>

    <div id="gallery-grid-slot" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
    <div id="gallery-pagination-slot"></div>

    <div id="lightbox-modal" class="fixed inset-0 z-[70] hidden items-center justify-center bg-stone-950/90 p-4" role="dialog" aria-modal="true" aria-label="ছবি">
      <button id="lightbox-close-btn" type="button" class="absolute right-4 top-4 h-10 w-10 rounded-full text-2xl text-white/80 hover:bg-white/10" aria-label="বন্ধ করুন">✕</button>
      <button id="lightbox-prev-btn" type="button" class="absolute left-2 h-12 w-12 rounded-full text-3xl text-white/80 hover:bg-white/10 sm:left-6" aria-label="আগের ছবি">‹</button>
      <figure class="max-w-5xl text-center">
        <img id="lightbox-img" src="" alt="" class="max-h-[80vh] rounded-lg object-contain" />
        <figcaption id="lightbox-caption" class="mt-3 text-sm text-white/80"></figcaption>
      </figure>
      <button id="lightbox-next-btn" type="button" class="absolute right-2 h-12 w-12 rounded-full text-3xl text-white/80 hover:bg-white/10 sm:right-6" aria-label="পরের ছবি">›</button>
    </div>
  `;

  allImages = [];
  allVideos = [];
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')));
      snap.forEach(d => {
        const data = { id: d.id, ...d.data() };
        (data.type === 'video' ? allVideos : allImages).push(data);
      });
    } catch (e) {
      console.warn('[Firestore] gallery:', e.message);
    }
  }
  // Official campus photo is always available
  if (allImages.length === 0) {
    allImages = [{ id: 'campus', title: 'মাদ্রাসা ক্যাম্পাস', category: 'campus', imageUrl: SITE.heroUrl }];
  }

  document.getElementById('gallery-view-tabs').addEventListener('click', e => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    view = btn.dataset.view;
    page = 1;
    render();
  });

  const cats = document.getElementById('image-categories-bar');
  cats.addEventListener('click', e => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    cats.querySelectorAll('button').forEach(b => b.classList.toggle('chip-active', b === btn));
    category = btn.dataset.cat;
    page = 1;
    render();
  });

  setupLightbox();
  render();
}

function render() {
  document.querySelectorAll('#gallery-view-tabs button').forEach(b => {
    const active = b.dataset.view === view;
    b.setAttribute('aria-selected', String(active));
    b.className = `rounded-md px-4 py-1.5 text-sm font-medium transition ${active ? 'bg-brand-700 text-white' : 'text-stone-600 hover:text-brand-700'}`;
  });
  document.getElementById('image-categories-bar').classList.toggle('hidden', view !== 'images');

  const grid = document.getElementById('gallery-grid-slot');
  const pager = document.getElementById('gallery-pagination-slot');

  if (view === 'videos') {
    pager.innerHTML = '';
    grid.innerHTML = allVideos.length === 0
      ? `<div class="card col-span-full">${renderEmptyState({ title: 'এখনও কোনো ভিডিও যুক্ত হয়নি', message: 'ভিডিও প্রকাশিত হলে এখানে দেখা যাবে।', icon: 'photo' })}</div>`
      : allVideos.map(v => `
        <a href="${safeUrl(v.videoUrl)}" target="_blank" rel="noopener" class="card group overflow-hidden">
          <div class="relative aspect-video bg-stone-100">
            <img src="${safeUrl(v.thumbnailUrl, SITE.heroUrl)}" alt="" class="h-full w-full object-cover" loading="lazy" />
            <span class="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-800 transition group-hover:scale-105">▶</span>
          </div>
          <div class="p-4">
            <h3 class="font-medium text-stone-800">${esc(v.title)}</h3>
            ${v.description ? `<p class="mt-1 line-clamp-2 text-sm text-stone-500">${esc(v.description)}</p>` : ''}
          </div>
        </a>
      `).join('');
    return;
  }

  filtered = allImages.filter(img => category === 'all' || img.category === category);
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="card col-span-full">${renderEmptyState({ title: 'এই ক্যাটাগরিতে কোনো ছবি নেই', message: 'অন্য ক্যাটাগরি নির্বাচন করুন।', icon: 'photo' })}</div>`;
    pager.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  page = Math.min(page, totalPages);
  const start = (page - 1) * PER_PAGE;

  grid.innerHTML = filtered.slice(start, start + PER_PAGE).map((img, i) => `
    <button type="button" data-index="${start + i}" class="group overflow-hidden rounded-xl border border-stone-200/80 bg-white text-left">
      <div class="aspect-[4/3] overflow-hidden bg-stone-100">
        <img src="${safeUrl(img.imageUrl)}" alt="${esc(img.title)}" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
      </div>
      ${img.title ? `<p class="px-4 py-3 text-sm text-stone-700">${esc(img.title)}</p>` : ''}
    </button>
  `).join('');

  grid.querySelectorAll('button[data-index]').forEach(el => {
    el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index, 10)));
  });

  pager.innerHTML = renderPagination({ currentPage: page, totalPages, containerId: 'gallery-pagination-controls' });
  initPagination('gallery-pagination-controls', p => {
    page = p;
    render();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const close = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };
  document.getElementById('lightbox-close-btn').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.getElementById('lightbox-prev-btn').addEventListener('click', () => openLightbox((lightboxIndex - 1 + filtered.length) % filtered.length));
  document.getElementById('lightbox-next-btn').addEventListener('click', () => openLightbox((lightboxIndex + 1) % filtered.length));
  document.addEventListener('keydown', e => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') openLightbox((lightboxIndex - 1 + filtered.length) % filtered.length);
    if (e.key === 'ArrowRight') openLightbox((lightboxIndex + 1) % filtered.length);
  });
}

function openLightbox(index) {
  const item = filtered[index];
  if (!item) return;
  lightboxIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  img.src = item.imageUrl;
  img.alt = item.title || '';
  document.getElementById('lightbox-caption').textContent = item.title || '';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
