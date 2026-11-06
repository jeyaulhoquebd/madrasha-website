/**
 * Administration Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads Governing Body, Principal, Vice Principal & Admin Staff from Firestore
 */

import { db, collection, getDocs, query, orderBy, getDoc, doc } from '../firebase/config.js';
import { OFFICIAL_LOGO_URL } from './home.js';
import { renderEmptyState } from '../components/emptyState.js';

export async function initAdministrationPage() {
  const container = document.getElementById('administration-content');
  if (!container) return;

  let members = [];
  let principalData = null;

  if (db) {
    try {
      const q = query(collection(db, 'administration'), orderBy('displayOrder', 'asc'));
      const snap = await getDocs(q);
      snap.forEach(d => members.push({ id: d.id, ...d.data() }));

      const pSnap = await getDoc(doc(db, 'settings', 'principal'));
      if (pSnap.exists()) {
        principalData = pSnap.data();
      }
    } catch (e) {
      console.warn('[Firestore] Administration load fallback:', e.message);
    }
  }

  // Filter groups
  const governingBody = members.filter(m => m.category === 'governing' || m.category === 'committee');
  const leaders = members.filter(m => m.category === 'leadership' || m.designation?.includes('অধ্যক্ষ'));
  const adminStaff = members.filter(m => m.category === 'staff' || m.category === 'office');

  container.innerHTML = `
    <!-- Page Header Banner -->
    <div class="mb-10 text-center max-w-3xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">প্রশাসনিক কাঠামো ও পরিচালনা</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">মাদ্রাসার প্রশাসন ও গভর্নিং বডি</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        সুষ্ঠু প্রাতিষ্ঠানিক ব্যবস্থাপনা ও উচ্চ শিক্ষাগত মান বজায় রাখতে দিকনির্দেশনাকারী পরিচালনা পর্ষদ
      </p>
    </div>

    <!-- Leadership Section: Principal & Vice Principal -->
    <section class="mb-14">
      <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider mb-6">
        <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
        <span>প্রাতিষ্ঠানিক নেতৃত্ব</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Principal Card -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-[#0B4619] transition">
          <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-stone-100 overflow-hidden ring-2 ring-[#d4af37] flex-shrink-0 shadow-md">
            <img 
              src="${principalData?.photoUrl || OFFICIAL_LOGO_URL}" 
              alt="${principalData?.name || 'অধ্যক্ষ মহোদয়'}" 
              class="w-full h-full object-cover"
            />
          </div>
          <div class="space-y-2 text-center sm:text-left flex-1">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-[#0B4619] border border-emerald-200">
              প্রধান নির্বাহী
            </span>
            <h3 class="text-lg font-bold text-slate-800">${principalData?.name || 'অধ্যক্ষ মহোদয়'}</h3>
            <p class="text-xs font-semibold text-[#0B4619]">${principalData?.designation || 'অধ্যক্ষ, খাগড়াছড়ি বায়তুশ শরফ মাদ্রাসা'}</p>
            <p class="text-xs text-stone-600 leading-relaxed italic">
              "${principalData?.message || 'জ্ঞান, আমল ও নৈতিকতার সমন্বয়ে আদর্শ চরিত্রবান মানুষ গড়তে আমরা প্রতিশ্রুতিবদ্ধ।'}"
            </p>
          </div>
        </div>

        <!-- Vice Principal or Leadership Card -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-[#0B4619] transition">
          <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-stone-100 overflow-hidden ring-2 ring-emerald-300 flex-shrink-0 shadow-md">
            <img 
              src="${OFFICIAL_LOGO_URL}" 
              alt="উপাধ্যক্ষ" 
              class="w-full h-full object-contain p-2"
            />
          </div>
          <div class="space-y-2 text-center sm:text-left flex-1">
            <span class="px-2.5 py-0.5 rounded text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
              একাডেমিক সমন্বয়ক
            </span>
            <h3 class="text-lg font-bold text-slate-800">উপাধ্যক্ষ মহোদয়</h3>
            <p class="text-xs font-semibold text-[#0B4619]">উপাধ্যক্ষ, খাগড়াছড়ি বায়তুশ শরফ মাদ্রাসা</p>
            <p class="text-xs text-stone-600 leading-relaxed italic">
              "একাডেমিক অনুশাসন ও শিক্ষার্থীদের নিয়মিত পাঠদান তত্ত্বাবধানে নিবেদিত।"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Governing Body / Management Committee -->
    <section class="mb-14">
      <div class="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
        <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider">
          <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
          <span>গভর্নিং বডি ও পরিচালনা পর্ষদ</span>
        </div>
        <span class="text-xs text-stone-500 font-medium">অনুমোদিত কমিটি</span>
      </div>

      <div id="governing-body-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${governingBody.length > 0 ? governingBody.map(m => `
          <div class="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-[#0B4619] transition flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-stone-100 ring-2 ring-[#d4af37]/60 overflow-hidden flex-shrink-0">
              <img src="${m.photoUrl || OFFICIAL_LOGO_URL}" alt="${m.name}" class="w-full h-full object-cover">
            </div>
            <div class="space-y-1">
              <h4 class="text-sm font-bold text-slate-800">${m.name}</h4>
              <p class="text-xs font-semibold text-[#0B4619]">${m.designation}</p>
              ${m.description ? `<p class="text-[11px] text-stone-500 line-clamp-2">${m.description}</p>` : ''}
            </div>
          </div>
        `).join('') : `
          <div class="col-span-full">
            ${renderEmptyState({
              title: 'গভর্নিং বডির পূর্ণাঙ্গ তালিকা প্রশাসনিক অনুমোদন সাপেক্ষে প্রকাশ করা হবে',
              message: 'বর্তমানে পরিচালনা পর্ষদের হালনাগাদকৃত সদস্য তালিকা অন্তর্ভুক্তির প্রক্রিয়া চলছে। অ্যাডমিন পোর্টাল থেকে অনুমোদিত তালিকা সংযুক্ত করার পর এখানে দৃশ্যমান হবে।',
              icon: 'users'
            })}
          </div>
        `}
      </div>
    </section>

    <!-- Administrative Staff -->
    <section class="mb-14">
      <div class="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
        <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider">
          <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
          <span>প্রশাসনিক কর্মকর্তা ও অফিসিয়াল স্টাফ</span>
        </div>
        <a href="/staff.html" class="text-xs font-semibold text-[#0B4619] hover:underline">সকল কর্মচারী তালিকা →</a>
      </div>

      <div id="admin-staff-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${adminStaff.length > 0 ? adminStaff.map(s => `
          <div class="bg-white rounded-xl border border-stone-200 p-5 text-center shadow-xs hover:border-[#0B4619] transition">
            <div class="w-16 h-16 mx-auto rounded-full bg-stone-100 ring-2 ring-stone-200 overflow-hidden mb-3">
              <img src="${s.photoUrl || OFFICIAL_LOGO_URL}" alt="${s.name}" class="w-full h-full object-cover">
            </div>
            <h4 class="text-sm font-bold text-slate-800">${s.name}</h4>
            <p class="text-xs text-stone-500 mt-0.5">${s.designation}</p>
          </div>
        `).join('') : `
          <div class="col-span-full">
            <div class="p-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center text-xs text-stone-500">
              প্রশাসনিক কর্মকর্তাদের প্রোফাইল ডাটাবেজ হালনাগাদাধীন।
            </div>
          </div>
        `}
      </div>
    </section>
  `;
}
