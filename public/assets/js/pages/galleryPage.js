/**
 * Gallery Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Separate Image and Video Galleries with Full-Screen Lightbox Modal, Categories & Pagination
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { OFFICIAL_HERO_IMAGE_URL, OFFICIAL_LOGO_URL } from './home.js';
import { renderPagination, initPagination } from '../components/pagination.js';

let activeView = 'images'; // 'images' | 'videos'
let allImages = [];
let allVideos = [];
let filteredImages = [];
let selectedCategory = 'all';
let currentImageIndex = 0;
let currentPage = 1;
const itemsPerPage = 6;

export async function initGalleryPage() {
  const container = document.getElementById('gallery-page-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-8 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">ক্যাম্পাস আলোকচিত্র ও ভিডিও</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">ছবি ও ভিডিও গ্যালারি</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        মাদ্রাসার প্রাকৃতিক সবুজ ক্যাম্পাস, একাডেমিক ভবন, জাতীয় দিবস ও ইসলামী অনুষ্ঠানের চিত্রশালা
      </p>
    </div>

    <!-- Main View Switcher Tabs -->
    <div class="flex justify-center mb-8">
      <div class="bg-stone-200/80 p-1.5 rounded-2xl flex space-x-1 rtl:space-x-reverse max-w-md w-full">
        <button id="view-images-btn" class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-[#072e10] shadow-xs">
          🖼️ ফটো গ্যালারি (Image Gallery)
        </button>
        <button id="view-videos-btn" class="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-stone-600 hover:text-[#0B4619]">
          🎥 ভিডিও গ্যালারি (Video Gallery)
        </button>
      </div>
    </div>

    <!-- Image Categories Bar (Visible when activeView === 'images') -->
    <div id="image-categories-bar" class="flex justify-center flex-wrap gap-2 mb-8 text-xs font-semibold">
      <button data-cat="all" class="px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs">সকল ছবি</button>
      <button data-cat="campus" class="px-3.5 py-1.5 rounded-lg transition bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50">ক্যাম্পাস ও ভবন</button>
      <button data-cat="events" class="px-3.5 py-1.5 rounded-lg transition bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50">অনুষ্ঠান ও মাহফিল</button>
      <button data-cat="sports" class="px-3.5 py-1.5 rounded-lg transition bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50">ক্রীড়া ও সাংস্কৃতিক</button>
    </div>

    <!-- Gallery Grid Slot -->
    <div id="gallery-grid-slot" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="col-span-full py-12 text-center text-stone-400">গ্যালারি লোড হচ্ছে...</div>
    </div>

    <!-- Pagination Slot -->
    <div id="gallery-pagination-slot" class="mt-8"></div>

    <!-- Fullscreen Lightbox Modal -->
    <div id="lightbox-modal" class="fixed inset-0 bg-black/90 z-50 hidden flex flex-col items-center justify-center p-4">
      <button id="lightbox-close-btn" class="absolute top-5 right-5 text-white/80 hover:text-white p-2 text-2xl focus:outline-hidden" aria-label="বন্ধ করুন">✕</button>
      <div class="relative max-w-4xl max-h-[80vh] flex items-center justify-center">
        <button id="lightbox-prev-btn" class="absolute -left-12 sm:-left-16 text-white text-3xl p-2 hover:text-amber-300 focus:outline-hidden">‹</button>
        <img id="lightbox-img" src="" alt="" class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl">
        <button id="lightbox-next-btn" class="absolute -right-12 sm:-right-16 text-white text-3xl p-2 hover:text-amber-300 focus:outline-hidden">›</button>
      </div>
      <p id="lightbox-caption" class="text-white text-xs sm:text-sm mt-4 text-center max-w-lg font-medium"></p>
    </div>
  `;

  // Fetch images and videos from Firestore or official showcase
  allImages = [];
  allVideos = [];

  if (db) {
    try {
      const imgSnap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')));
      imgSnap.forEach(d => {
        const data = d.data();
        if (data.type === 'video') {
          allVideos.push({ id: d.id, ...data });
        } else {
          allImages.push({ id: d.id, ...data });
        }
      });
    } catch (e) {
      console.warn('[Firestore] Gallery load notice:', e.message);
    }
  }

  // Official verified fallback assets if none in DB
  if (allImages.length === 0) {
    allImages = [
      {
        id: 'img-1',
        title: 'মাদ্রাসার প্রধান একাডেমিক ভবন ও ক্যাম্পাস প্রাঙ্গণ',
        category: 'campus',
        imageUrl: OFFICIAL_HERO_IMAGE_URL
      },
      {
        id: 'img-2',
        title: 'প্রাকৃতিক পাহাড়ি মনোরম পরিবেশে মাদ্রাসার শিক্ষাঙ্গন',
        category: 'campus',
        imageUrl: OFFICIAL_HERO_IMAGE_URL
      },
      {
        id: 'img-3',
        title: 'মাদ্রাসার অফিসিয়াল মনোগ্রাম ও পরিচিতি ব্যাজ',
        category: 'events',
        imageUrl: OFFICIAL_LOGO_URL
      }
    ];
  }

  if (allVideos.length === 0) {
    allVideos = [
      {
        id: 'vid-1',
        title: 'মাদ্রাসার পরিচিতি ও ক্যাম্পাস তথ্যচিত্র',
        description: 'খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসার শিক্ষা কার্যক্রম ও পরিবেশ।',
        thumbnailUrl: OFFICIAL_HERO_IMAGE_URL,
        videoUrl: 'https://www.youtube.com'
      },
      {
        id: 'vid-2',
        title: 'বার্ষিক ক্রীড়া, সাংস্কৃতিক ও সিরাত মাহফিল',
        description: 'শিক্ষার্থীদের অংশগ্রহণে বার্ষিক সাংস্কৃতিক প্রতিযোগিতা ও পুরস্কার বিতরণ।',
        thumbnailUrl: OFFICIAL_HERO_IMAGE_URL,
        videoUrl: 'https://www.youtube.com'
      }
    ];
  }

  // Setup tab switcher
  const imagesBtn = document.getElementById('view-images-btn');
  const videosBtn = document.getElementById('view-videos-btn');
  const catBar = document.getElementById('image-categories-bar');

  imagesBtn?.addEventListener('click', () => {
    activeView = 'images';
    imagesBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-[#072e10] shadow-xs';
    videosBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-stone-600 hover:text-[#0B4619]';
    catBar?.classList.remove('hidden');
    currentPage = 1;
    renderGallery();
  });

  videosBtn?.addEventListener('click', () => {
    activeView = 'videos';
    videosBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-[#072e10] shadow-xs';
    imagesBtn.className = 'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-stone-600 hover:text-[#0B4619]';
    catBar?.classList.add('hidden');
    currentPage = 1;
    renderGallery();
  });

  // Setup category pills
  const catButtons = document.querySelectorAll('#image-categories-bar button');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.className = 'px-3.5 py-1.5 rounded-lg transition bg-white text-stone-700 border border-stone-200 hover:bg-emerald-50');
      btn.className = 'px-3.5 py-1.5 rounded-lg transition bg-[#0B4619] text-white shadow-xs';
      selectedCategory = btn.getAttribute('data-cat');
      currentPage = 1;
      renderGallery();
    });
  });

  // Setup Lightbox Modal events
  setupLightbox();

  renderGallery();
}

function renderGallery() {
  const gridSlot = document.getElementById('gallery-grid-slot');
  const paginationSlot = document.getElementById('gallery-pagination-slot');
  if (!gridSlot) return;

  if (activeView === 'images') {
    filteredImages = allImages.filter(img => selectedCategory === 'all' || img.category === selectedCategory);

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filteredImages.slice(startIndex, startIndex + itemsPerPage);

    gridSlot.innerHTML = pageItems.map((img, idx) => `
      <div 
        data-lightbox-index="${startIndex + idx}"
        class="group relative rounded-2xl overflow-hidden shadow-xs border border-stone-200 bg-white aspect-4/3 cursor-pointer hover:shadow-lg transition duration-300"
      >
        <img 
          src="${img.imageUrl}" 
          alt="${img.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
          <span class="text-xs font-bold text-white leading-snug">${img.title}</span>
          <span class="text-[11px] text-amber-300 mt-1 inline-flex items-center gap-1">
            🔍 বড় আকারে দেখতে ক্লিক করুন
          </span>
        </div>
      </div>
    `).join('');

    // Attach click to open lightbox
    gridSlot.querySelectorAll('[data-lightbox-index]').forEach(el => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-lightbox-index'), 10);
        openLightbox(index);
      });
    });

    if (paginationSlot) {
      paginationSlot.innerHTML = renderPagination({
        currentPage,
        totalPages,
        containerId: 'gallery-pagination-controls'
      });

      initPagination('gallery-pagination-controls', (newPage) => {
        currentPage = newPage;
        renderGallery();
        window.scrollTo({ top: 350, behavior: 'smooth' });
      });
    }

  } else {
    // Video Gallery View
    gridSlot.innerHTML = allVideos.map(vid => `
      <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-5 space-y-3">
        <div class="relative bg-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
          <img 
            src="${vid.thumbnailUrl || OFFICIAL_HERO_IMAGE_URL}" 
            alt="${vid.title}" 
            class="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-300"
          />
          <div class="absolute w-14 h-14 rounded-full bg-[#0B4619]/90 border-2 border-amber-300 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <svg class="w-6 h-6 ml-0.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z"></path></svg>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-base text-slate-800">${vid.title}</h4>
          <p class="text-xs text-stone-500 mt-1 leading-relaxed">${vid.description || ''}</p>
        </div>
      </div>
    `).join('');

    if (paginationSlot) paginationSlot.innerHTML = '';
  }
}

function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      openLightbox(currentImageIndex - 1);
    } else {
      openLightbox(filteredImages.length - 1);
    }
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentImageIndex < filteredImages.length - 1) {
      openLightbox(currentImageIndex + 1);
    } else {
      openLightbox(0);
    }
  });
}

function openLightbox(index) {
  if (!filteredImages[index]) return;
  currentImageIndex = index;
  const item = filteredImages[index];

  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');

  if (imgEl && captionEl && modal) {
    imgEl.src = item.imageUrl;
    captionEl.textContent = item.title;
    modal.classList.remove('hidden');
  }
}
