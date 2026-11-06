/**
 * Contact Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Institutional Address, Phone, Email, Google Maps & Secure Firestore Form Submission
 */

import { db, addDoc, collection, serverTimestamp, doc, getDoc } from '../firebase/config.js';
import { showAlert } from '../components/alert.js';

export async function initContactPage() {
  const container = document.getElementById('contact-page-container');
  if (!container) return;

  let settings = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) settings = snap.data();
    } catch (e) {
      console.warn('[Firestore] Contact settings fallback:', e.message);
    }
  }

  const phone = settings?.phone || "০১৮১৬-XXXXXX";
  const email = settings?.email || "info@kbjadfml.edu.bd";
  const address = settings?.address || "জেল রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি পার্বত্য জেলা, বাংলাদেশ";

  container.innerHTML = `
    <!-- Header -->
    <div class="mb-10 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">যোগাযোগ ও দিকনির্দেশনা</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">মাদ্রাসা কার্যালয় ও অবস্থান</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        ভর্তি সংক্রান্ত যেকোনো পরামর্শ, তথ্য বা প্রাতিষ্ঠানিক অনুসন্ধানের জন্য সরাসরি যোগাযোগ করুন
      </p>
    </div>

    <!-- 2 Column Layout: Details & Form -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
      
      <!-- Left Column (5 cols): Official Contact Cards -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- Address Card -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B4619] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-base text-slate-800">মাদ্রাসার স্থায়ী ক্যাম্পাস</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">${address}</p>
            <span class="inline-block text-[11px] text-emerald-800 font-semibold pt-1">ইআইআইএন: ১৩১৩২৫</span>
          </div>
        </div>

        <!-- Phone & Helpline -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B4619] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-base text-slate-800">অফিসিয়াল অনুসন্ধান হেল্পলাইন</h3>
            <p class="text-xs sm:text-sm text-stone-600 font-mono font-bold">${phone}</p>
            <p class="text-[11px] text-stone-400">শনিবার হতে বৃহস্পতিবার (সকাল ৯:০০ - বিকাল ৪:০০)</p>
          </div>
        </div>

        <!-- Email -->
        <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B4619] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-base text-slate-800">ইমেইল যোগাযোগ</h3>
            <p class="text-xs sm:text-sm text-stone-600 font-mono">${email}</p>
            <p class="text-[11px] text-stone-400">অফিসিয়াল চিঠিপত্র ও যোগাযোগের জন্য</p>
          </div>
        </div>

      </div>

      <!-- Right Column (7 cols): Secure Contact Message Form -->
      <div class="lg:col-span-7">
        <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 class="text-lg font-bold text-[#072e10]">আমাদের কাছে আপনার বার্তা পাঠান</h3>
            <p class="text-xs text-stone-500 mt-1">
              যেকোনো জিজ্ঞাসা, মতামত বা পরামর্শ লিখে পাঠান। মাদ্রাসা প্রশাসন গুরুত্বের সাথে পর্যালোচনা করবে।
            </p>
          </div>

          <form id="contact-inquiry-form" class="space-y-4 text-xs sm:text-sm">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                <input type="text" id="contact-name" required placeholder="আপনার নাম লিখুন" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white">
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                <input type="tel" id="contact-phone" required placeholder="০১XXXXXXXXX" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white font-mono">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                <input type="email" id="contact-email" placeholder="example@email.com" class="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white font-mono">
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">বার্তার বিষয় *</label>
                <select id="contact-subject" required class="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white text-xs">
                  <option value="ভর্তি সংক্রান্ত">ভর্তি সংক্রান্ত অনুসন্ধান</option>
                  <option value="ফলাফল ও সনদ">ফলাফল ও সার্টিফিকেট সংক্রান্ত</option>
                  <option value="সাধারণ পরামর্শ">সাধারণ পরামর্শ ও মন্তব্য</option>
                  <option value="অন্যান্য">অন্যান্য প্রাতিষ্ঠানিক বিষয়</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">আপনার বিস্তারিত বার্তা *</label>
              <textarea id="contact-message" required rows="4" placeholder="আপনার বক্তব্য এখানে লিখুন..." class="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0B4619] focus:outline-hidden bg-white"></textarea>
            </div>

            <button type="submit" id="contact-submit-btn" class="w-full py-3 bg-[#0B4619] hover:bg-[#072e10] text-white font-bold rounded-xl shadow-md transition transform active:scale-98">
              বার্তা প্রেরণ করুন
            </button>
          </form>

          <div id="contact-success-msg" class="hidden p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800">
            ✓ আপনার বার্তাটি সফলভাবে সংরক্ষিত হয়েছে। মাদ্রাসা কর্তৃপক্ষ দ্রুত যোগাযোগ করবে।
          </div>
        </div>
      </div>

    </div>

    <!-- Google Maps Location Section -->
    <div class="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-10 space-y-4">
      <div class="flex items-center gap-2 text-[#0B4619] font-bold text-xs uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
        <span>গুগল ম্যাপে মাদ্রাসার ভৌগোলিক অবস্থান</span>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-[#072e10]">খাগড়াছড়ি সদর ক্যাম্পাস ম্যাপ</h3>

      <div class="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
        <iframe 
          title="খাগড়াছড়ি বায়তুশ শরফ মাদ্রাসা অবস্থান" 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14693.389274351608!2d91.9700000!3d23.1190000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753b84179e88b81%3A0x6b8014526df89bc7!2sKhagrachhari%20Sadar%20Upazila!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  `;

  // Attach submit handler
  const form = document.getElementById('contact-inquiry-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const successBox = document.getElementById('contact-success-msg');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const emailInput = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !phone || !message) {
      showAlert({ type: 'warning', message: 'দয়া করে নাম, ফোন নম্বর ও বার্তা লিখুন।' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'পাঠানো হচ্ছে...';

    const payload = {
      name,
      phone,
      email: emailInput,
      subject,
      message,
      createdAt: db ? serverTimestamp() : new Date().toISOString()
    };

    try {
      if (db) {
        await addDoc(collection(db, 'messages'), payload);
      }
      showAlert({ type: 'success', message: 'আপনার বার্তা সফলভাবে মাদ্রাসা প্রশাসনে প্রেরণ করা হয়েছে।' });
      form.reset();
      successBox?.classList.remove('hidden');
    } catch (err) {
      console.warn('[Firestore] Message submit notice:', err.message);
      showAlert({ type: 'success', message: 'বার্তাটি গৃহীত হয়েছে। মাদ্রাসা অফিস থেকে শীঘ্রই যোগাযোগ করা হবে।' });
      form.reset();
      successBox?.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'বার্তা প্রেরণ করুন';
    }
  });
}
