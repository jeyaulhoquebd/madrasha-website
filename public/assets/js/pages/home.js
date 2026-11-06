/**
 * Homepage Dynamic Data Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Real Cloud Firestore integration with strict verified content discipline
 */

import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from '../firebase/config.js';
import { formatBengaliDate } from '../utils/date.js';
import { updateLayoutSettings } from '../components/layout.js';
import { renderNoticeTicker } from '../components/noticeTicker.js';

export const OFFICIAL_HERO_IMAGE_URL = "https://res.cloudinary.com/edsn06rr/image/upload/v1793898407/a1a9d6b9-0f63-4ca4-bb47-8a8fc27dd326.png";
export const OFFICIAL_LOGO_URL = "https://res.cloudinary.com/edsn06rr/image/upload/v1793898297/images.jpg";

/**
 * Loads institutional settings from Firestore
 */
export async function loadInstitutionalSettings() {
  if (!db) return null;
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      updateLayoutSettings(data);
      return data;
    }
  } catch (error) {
    console.warn('[Firestore] Settings load fallback:', error.message);
  }
  return null;
}

/**
 * Loads published notices from Firestore for the home notice board & ticker
 */
export async function loadRecentNotices() {
  const noticesContainer = document.getElementById('home-notices-container');
  const tickerSlot = document.getElementById('notice-ticker-slot');

  if (!db) {
    showNoticeEmptyState(noticesContainer, 'ফায়ারবেস ডেটাবেজ সংযোগ অপেক্ষমান। প্রশাসনিক নোটিশ যুক্ত করা হলে সরাসরি দৃশ্যমান হবে।');
    return [];
  }

  try {
    const q = query(
      collection(db, 'notices'),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    const notices = [];
    snapshot.forEach(docSnap => {
      notices.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (notices.length > 0) {
      // Render Notice Board list
      if (noticesContainer) {
        noticesContainer.innerHTML = notices.map(notice => `
          <div class="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 hover:bg-emerald-50/50 hover:border-emerald-300 transition group flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B4619] text-amber-300">
                  ${notice.category || 'সাধারণ'}
                </span>
                <span class="text-[11px] text-stone-500">
                  ${formatBengaliDate(notice.publishedAt)}
                </span>
              </div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0B4619] leading-snug">
                <a href="/notice-details.html?id=${notice.id}">
                  ${notice.title}
                </a>
              </h4>
            </div>
            <a href="/notice-details.html?id=${notice.id}" class="flex-shrink-0 p-1.5 text-stone-400 group-hover:text-[#0B4619] transition" title="বিস্তারিত দেখুন">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
        `).join('');
      }

      // Update Ticker
      if (tickerSlot) {
        tickerSlot.innerHTML = renderNoticeTicker(notices);
      }

      return notices;
    } else {
      showNoticeEmptyState(noticesContainer, 'বর্তমানে কোনো সক্রিয় নোটিশ নেই। কর্তৃপক্ষ কর্তৃক নতুন বিজ্ঞপ্তি প্রকাশের পর এখানে প্রদর্শিত হবে।');
      return [];
    }
  } catch (error) {
    console.warn('[Firestore] Notice board load notice:', error.message);
    showNoticeEmptyState(noticesContainer, 'বর্তমানে নতুন কোনো নোটিশ পাওয়া যায়নি। সকল নোটিশের জন্য নোটিশ বোর্ডে যান।');
    return [];
  }
}

function showNoticeEmptyState(container, message) {
  if (!container) return;
  container.innerHTML = `
    <div class="p-6 text-center text-stone-500 space-y-2">
      <svg class="w-10 h-10 text-stone-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      <p class="text-xs leading-relaxed">${message}</p>
      <a href="/notices.html" class="inline-block text-xs font-semibold text-[#0B4619] hover:underline">
        সকল নোটিশ আর্কাইভ দেখুন →
      </a>
    </div>
  `;
}

/**
 * Loads Principal's message from Firestore
 */
export async function loadPrincipalMessage() {
  const container = document.getElementById('principal-message-container');
  if (!container) return;

  if (!db) {
    container.innerHTML = `
      <div class="p-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center space-y-2">
        <p class="text-xs sm:text-sm text-stone-600 font-medium">
          অধ্যক্ষ মহোদয়ের দিকনির্দেশনামূলক বাণী ও ফটো প্রশাসনিক যাচাইকরণ ও ফায়ারবেস ক্লাউড সংরক্ষণের পর সরাসরি এখানে আনুষ্ঠানিকভাবে প্রদর্শিত হবে।
        </p>
        <span class="inline-block text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
          প্রশাসনিক স্থিতি: বাণী অনুমোদনাধীন
        </span>
      </div>
    `;
    return;
  }

  try {
    const docSnap = await getDoc(doc(db, 'settings', 'principal'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      container.innerHTML = `
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-stone-100 overflow-hidden shadow-md border-2 border-[#d4af37] flex-shrink-0 mx-auto sm:mx-0">
            <img 
              src="${data.photoUrl || OFFICIAL_LOGO_URL}" 
              alt="${data.name || 'অধ্যক্ষ'}" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="space-y-2.5 text-center sm:text-left flex-1">
            <div>
              <h4 class="text-base sm:text-lg font-bold text-[#072e10]">${data.name || 'অধ্যক্ষ মহোদয়'}</h4>
              <p class="text-xs font-semibold text-[#0B4619]">${data.designation || 'অধ্যক্ষ, খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল মাদ্রাসা'}</p>
            </div>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
              "${data.message || 'বিসমিল্লাহির রাহমানির রাহিম। দ্বীনি শিক্ষা ও আধুনিক জ্ঞানের সমন্বয়ে আমাদের মাদ্রাসা আদর্শ মানুষ গড়ার মহান ব্রতে এগিয়ে চলছে।'}"
            </p>
            <div class="pt-2">
              <a href="/administration.html" class="inline-flex items-center text-xs font-bold text-[#0B4619] hover:underline">
                সম্পূর্ণ প্রাতিষ্ঠানিক বার্তা পড়ুন →
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="p-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center space-y-2">
          <p class="text-xs sm:text-sm text-stone-600 font-medium">
            অধ্যক্ষ মহোদয়ের দিকনির্দেশনামূলক বাণী ও ফটো প্রশাসনিক যাচাইকরণ ও ফায়ারবেস ক্লাউড সংরক্ষণের পর সরাসরি এখানে আনুষ্ঠানিকভাবে প্রদর্শিত হবে।
          </p>
          <span class="inline-block text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            প্রশাসনিক স্থিতি: বাণী অনুমোদনাধীন
          </span>
        </div>
      `;
    }
  } catch (error) {
    console.warn('[Firestore] Principal message notice:', error.message);
  }
}

/**
 * Loads Teacher Highlights from Firestore
 */
export async function loadTeacherHighlights() {
  const container = document.getElementById('home-teachers-container');
  if (!container) return;

  if (!db) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300 space-y-2">
        <svg class="w-10 h-10 text-stone-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <p class="text-xs sm:text-sm text-stone-600 font-medium">শিক্ষক মণ্ডলীর বিস্তারিত প্রোফাইল ডাটাবেজ হালনাগাদাধীন</p>
        <p class="text-xs text-stone-400">অনুমোদিত ও যাচাইকৃত শিক্ষক তালিকা অ্যাডমিন প্যানেল থেকে সংরক্ষণের পর প্রদর্শিত হবে।</p>
        <div class="pt-2">
          <a href="/teachers.html" class="inline-block px-4 py-2 bg-[#0B4619] text-white rounded text-xs font-semibold hover:bg-[#072e10] transition">
            সকল শিক্ষক বিভাগ দেখুন
          </a>
        </div>
      </div>
    `;
    return;
  }

  try {
    const q = query(collection(db, 'teachers'), limit(4));
    const snapshot = await getDocs(q);
    const teachers = [];
    snapshot.forEach(docSnap => {
      teachers.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (teachers.length > 0) {
      container.innerHTML = teachers.map(t => `
        <div class="bg-white rounded-xl border border-stone-200 p-5 text-center shadow-2xs hover:shadow-md transition group">
          <div class="w-20 h-20 mx-auto rounded-full bg-stone-100 overflow-hidden ring-2 ring-[#d4af37]/60 mb-3">
            <img src="${t.photoUrl || OFFICIAL_LOGO_URL}" alt="${t.name}" class="w-full h-full object-cover">
          </div>
          <h4 class="text-sm font-bold text-slate-800 group-hover:text-[#0B4619]">${t.name}</h4>
          <p class="text-xs text-stone-500 mt-0.5">${t.designation || 'সহকারী শিক্ষক'}</p>
          <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-[#0B4619] border border-emerald-200">
            ${t.department || 'সাধারণ বিভাগ'}
          </span>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300 space-y-2">
          <svg class="w-10 h-10 text-stone-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <p class="text-xs sm:text-sm text-stone-600 font-medium">শিক্ষক মণ্ডলীর বিস্তারিত প্রোফাইল ডাটাবেজ হালনাগাদাধীন</p>
          <p class="text-xs text-stone-400">অনুমোদিত ও যাচাইকৃত শিক্ষক তালিকা অ্যাডমিন প্যানেল থেকে সংরক্ষণের পর প্রদর্শিত হবে।</p>
          <div class="pt-2">
            <a href="/teachers.html" class="inline-block px-4 py-2 bg-[#0B4619] text-white rounded text-xs font-semibold hover:bg-[#072e10] transition">
              সকল শিক্ষক বিভাগ দেখুন
            </a>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.warn('[Firestore] Teachers highlight notice:', error.message);
  }
}

/**
 * Initializes all Homepage dynamic integrations
 */
export async function initHomePage() {
  await loadInstitutionalSettings();
  await loadRecentNotices();
  await loadPrincipalMessage();
  await loadTeacherHighlights();
}
