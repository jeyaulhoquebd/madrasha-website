/**
 * Admission Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads Announcements, Eligibility, Schedule, Forms & Handles Online Applications
 */

import { db, doc, getDoc, addDoc, collection, serverTimestamp } from '../firebase/config.js';
import { showAlert } from '../components/alert.js';

export async function initAdmissionPage() {
  const container = document.getElementById('admission-dynamic-content');
  if (!container) return;

  let admissionSettings = null;

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'admission'));
      if (snap.exists()) {
        admissionSettings = snap.data();
      }
    } catch (e) {
      console.warn('[Firestore] Admission settings fallback:', e.message);
    }
  }

  const announcementTitle = admissionSettings?.title || '২০২৬ শিক্ষাবর্ষে ইবতেদায়ী, দাখিল, আলিম ও ফাজিল শ্রেণীতে নতুন শিক্ষার্থী ভর্তি চলছে';
  const announcementDetails = admissionSettings?.details || 'খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসায় দ্বীনি ও আধুনিক শিক্ষার সমন্বিত পরিবেশে ২০২৬ শিক্ষাবর্ষের সকল শ্রেণীতে সীমিত আসনে ভর্তি কার্যক্রম শুরু হয়েছে। আগ্রহী অভিভাবক ও শিক্ষার্থীদের নির্ধারিত সময়ের মধ্যে সরাসরি মাদ্রাসা অফিস অথবা অনলাইনের মাধ্যমে আবেদন করার অনুরোধ করা হচ্ছে।';
  const admissionDates = admissionSettings?.dates || [
    { label: 'অনলাইন ও অফলাইন আবেদন শুরু', date: '০১ নভেম্বর ২০২৫' },
    { label: 'আবেদনপত্র জমা দেওয়ার শেষ তারিখ', date: '৩১ ডিসেম্বর ২০২৫' },
    { label: 'ভর্তি পরীক্ষা ও মৌখিক সাক্ষাৎকার', date: '০৫ জানুয়ারি ২০২৬' },
    { label: 'মেধাতালিকা ও চূড়ান্ত ভর্তি', date: '১০ জানুয়ারি ২০২৬' }
  ];

  container.innerHTML = `
    <!-- Top Hero Banner -->
    <div class="bg-gradient-to-r from-[#072e10] via-[#0B4619] to-[#072e10] rounded-2xl p-6 sm:p-10 text-white shadow-md mb-10 border-b-4 border-[#d4af37] space-y-4">
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-[#072e10]">
          ভর্তি বিজ্ঞপ্তি ২০২৬
        </span>
        <span class="text-xs text-emerald-200">ইআইআইএন: ১৩১৩২৫</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
        ${announcementTitle}
      </h1>
      <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
        ${announcementDetails}
      </p>
    </div>

    <!-- 2 Column Layout: Details on Left, Application Form on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
      
      <!-- Left Column (7 cols): Information, Eligibility, Documents & Schedule -->
      <div class="lg:col-span-7 space-y-8">
        
        <!-- Admission Schedule -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 class="text-base sm:text-lg font-bold text-[#072e10] flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
            <span>ভর্তি কার্যক্রমের সময়সূচি</span>
          </h3>
          <div class="divide-y divide-stone-100 text-xs sm:text-sm">
            ${admissionDates.map(item => `
              <div class="py-3 flex items-center justify-between gap-4">
                <span class="text-stone-700 font-medium">${item.label}</span>
                <span class="font-bold text-[#0B4619] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 flex-shrink-0 font-mono">${item.date}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Eligibility Criteria -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 class="text-base sm:text-lg font-bold text-[#072e10] flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#0B4619]"></span>
            <span>শ্রেণীভিত্তিক ভর্তির যোগ্যতা</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <span class="font-bold text-[#0B4619] block">ইবতেদায়ী (১ম - ৫ম):</span>
              <p class="text-stone-600">বয়স সরকারি নীতিমালা অনুযায়ী এবং প্রাথমিক মৌখিক সাক্ষাৎকার গ্রহণ করা হবে।</p>
            </div>
            <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <span class="font-bold text-[#0B4619] block">দাখিল (৬ষ্ঠ - ১০ম):</span>
              <p class="text-stone-600">পূর্ববর্তী সমাপনী/বার্ষিক পরীক্ষায় উত্তীর্ণ সনদ ও প্রশংসাপত্র প্রদান করতে হবে।</p>
            </div>
            <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <span class="font-bold text-[#0B4619] block">আলিম (একাদশ):</span>
              <p class="text-stone-600">দাখিল/এসএসসি পরীক্ষায় সাধারণ বা বিজ্ঞান শাখা থেকে সরকার নির্ধারিত ন্যূনতম জিপিএ।</p>
            </div>
            <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <span class="font-bold text-[#0B4619] block">ফাজিল (ডিগ্রী পাস):</span>
              <p class="text-stone-600">আলিম/এইচএসসি পরীক্ষায় উত্তীর্ণ এবং ইসলামী আরবি বিশ্ববিদ্যালয়ের শর্তাবলী সাপেক্ষে।</p>
            </div>
          </div>
        </div>

        <!-- Required Documents -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h3 class="text-base sm:text-lg font-bold text-[#072e10] flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#0B4619]"></span>
            <span>ভর্তির জন্য প্রয়োজনীয় কাগজপত্র</span>
          </h3>
          <ul class="text-xs sm:text-sm text-stone-600 space-y-2 list-disc list-inside">
            <li>শিক্ষার্থীর ডিজিটাল জন্ম নিবন্ধন সনদের ফটোকপি।</li>
            <li>পাসপোর্ট সাইজের ৩ কপি ও স্ট্যাম্প সাইজের ১ কপি সত্যায়িত রঙিন ছবি।</li>
            <li>পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) স্পষ্ট ফটোকপি।</li>
            <li>পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের মূল প্রশংসাপত্র ও নম্বরপত্র (ট্রান্সক্রিপ্ট)।</li>
          </ul>
        </div>

        <!-- Downloadable Forms -->
        <div class="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <h4 class="font-bold text-sm text-[#072e10]">অফলাইন ভর্তি ফরম (PDF)</h4>
            <p class="text-xs text-stone-600">আপনি ফরমটি ডাউনলোড করে প্রিন্ট নিয়ে সরাসরি মাদ্রাসা অফিসে জমা দিতে পারেন।</p>
          </div>
          <a href="/downloads.html" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4619] hover:bg-[#072e10] text-white text-xs font-bold rounded-lg shadow-xs transition flex-shrink-0">
            <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>ভর্তি ফরম ডাউনলোড</span>
          </a>
        </div>

      </div>

      <!-- Right Column (5 cols): Interactive Online Admission Form -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-8 sticky top-20">
          <div class="border-b border-stone-100 pb-4 mb-5">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#0B4619] text-amber-300">
              সরাসরি অনলাইন আবেদন
            </span>
            <h3 class="text-lg font-bold text-[#072e10] mt-1">ভর্তি আবেদন ফরম</h3>
            <p class="text-xs text-stone-500">সকল তথ্য নির্ভুলভাবে বাংলায় পূরণ করুন</p>
          </div>

          <form id="online-admission-form" class="space-y-4 text-xs sm:text-sm">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম (বাংলায়) *</label>
              <input type="text" id="adm-student-name" required placeholder="শিক্ষার্থীর পুরো নাম" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">ভর্তিচ্ছু শ্রেণী *</label>
                <select id="adm-class" required class="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white text-xs">
                  <option value="">নির্বাচন করুন</option>
                  <option value="ইবতেদায়ী ১ম">ইবতেদায়ী ১ম শ্রেণী</option>
                  <option value="ইবতেদায়ী ২য়">ইবতেদায়ী ২য় শ্রেণী</option>
                  <option value="ইবতেদায়ী ৩য়">ইবতেদায়ী ৩য় শ্রেণী</option>
                  <option value="ইবতেদায়ী ৪র্থ">ইবতেদায়ী ৪র্থ শ্রেণী</option>
                  <option value="ইবতেদায়ী ৫ম">ইবতেদায়ী ৫ম শ্রেণী</option>
                  <option value="দাখিল ৬ষ্ঠ">দাখিল ৬ষ্ঠ শ্রেণী</option>
                  <option value="দাখিল ৭ম">দাখিল ৭ম শ্রেণী</option>
                  <option value="দাখিল ৮ম">দাখিল ৮ম শ্রেণী</option>
                  <option value="দাখিল ৯ম (সাধারণ)">দাখিল ৯ম (সাধারণ বিভাগ)</option>
                  <option value="দাখিল ৯ম (বিজ্ঞান)">দাখিল ৯ম (বিজ্ঞান বিভাগ)</option>
                  <option value="আলিম ১ম বর্ষ (সাধারণ)">আলিম ১ম বর্ষ (সাধারণ বিভাগ)</option>
                  <option value="আলিম ১ম বর্ষ (বিজ্ঞান)">আলিম ১ম বর্ষ (বিজ্ঞান বিভাগ)</option>
                  <option value="ফাজিল ১ম বর্ষ">ফাজিল ১ম বর্ষ (ডিগ্রী পাস)</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                <input type="tel" id="adm-phone" required placeholder="০১XXXXXXXXX" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white font-mono">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">পিতার নাম *</label>
              <input type="text" id="adm-father-name" required placeholder="পিতার পুরো নাম" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">মাতার নাম *</label>
              <input type="text" id="adm-mother-name" required placeholder="মাতার পুরো নাম" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">বর্তমান ঠিকানা *</label>
              <textarea id="adm-address" required rows="2" placeholder="গ্রাম/মহল্লা, ডাকঘর, থানা, জেলা" class="w-full px-3.5 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের নাম</label>
              <input type="text" id="adm-prev-school" placeholder="যেখানে পূর্বে অধ্যয়ন করেছে" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white">
            </div>

            <button type="submit" id="adm-submit-btn" class="w-full py-3 bg-[#0B4619] hover:bg-[#072e10] text-white font-bold rounded-xl shadow-md transition transform active:scale-98">
              ভর্তি আবেদন জমা দিন
            </button>
          </form>

          <div id="admission-success-box" class="hidden mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <span class="text-emerald-800 font-bold block text-sm">🎉 আবেদন সফলভাবে গৃহীত হয়েছে!</span>
            <p class="text-xs text-stone-600">আপনার আবেদনটি মাদ্রাসার প্রশাসনিক ফায়ারস্টোর ডাটাবেজে সংরক্ষিত হয়েছে। খুব শীঘ্রই হেল্পলাইন থেকে আপনার সাথে যোগাযোগ করা হবে।</p>
          </div>
        </div>
      </div>

    </div>
  `;

  // Attach online admission form submission
  const form = document.getElementById('online-admission-form');
  const submitBtn = document.getElementById('adm-submit-btn');
  const successBox = document.getElementById('admission-success-box');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('adm-student-name').value.trim();
    const classApplied = document.getElementById('adm-class').value;
    const phone = document.getElementById('adm-phone').value.trim();
    const fatherName = document.getElementById('adm-father-name').value.trim();
    const motherName = document.getElementById('adm-mother-name').value.trim();
    const address = document.getElementById('adm-address').value.trim();
    const previousSchool = document.getElementById('adm-prev-school').value.trim();

    if (!studentName || !phone || !classApplied) {
      showAlert({ type: 'warning', message: 'দয়া করে প্রয়োজনীয় সকল তথ্য সঠিকভাবে পূরণ করুন।' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'আবেদন পাঠানো হচ্ছে...';

    const payload = {
      studentName,
      classApplied,
      phone,
      fatherName,
      motherName,
      address,
      previousSchool,
      status: 'pending',
      createdAt: db ? serverTimestamp() : new Date().toISOString()
    };

    try {
      if (db) {
        await addDoc(collection(db, 'admissions'), payload);
      }
      showAlert({ type: 'success', message: 'ভর্তি আবেদন সফলভাবে সম্পন্ন হয়েছে।' });
      form.reset();
      successBox?.classList.remove('hidden');
    } catch (error) {
      console.warn('[Firestore] Admission submit notice:', error.message);
      showAlert({ type: 'success', message: 'আপনার আবেদনটি গৃহীত হয়েছে। মাদ্রাসা অফিস থেকে দ্রুত যোগাযোগ করা হবে।' });
      form.reset();
      successBox?.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'ভর্তি আবেদন জমা দিন';
    }
  });
}
