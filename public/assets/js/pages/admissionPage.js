/**
 * Admission
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: settings/admission { title, details, isOpen, dates: [{label, date}] }
 *            admissions (public create-only; reviewed by admins)
 */

import { db, doc, getDoc, addDoc, collection, serverTimestamp } from '../firebase/config.js';
import { showAlert } from '../components/alert.js';
import { renderPageHeader, renderSectionHeading } from '../components/pageHeader.js';
import { esc } from '../utils/escape.js';

const CLASSES = [
  'ইবতেদায়ী ১ম', 'ইবতেদায়ী ২য়', 'ইবতেদায়ী ৩য়', 'ইবতেদায়ী ৪র্থ', 'ইবতেদায়ী ৫ম',
  'দাখিল ৬ষ্ঠ', 'দাখিল ৭ম', 'দাখিল ৮ম', 'দাখিল ৯ম (সাধারণ)', 'দাখিল ৯ম (বিজ্ঞান)',
  'আলিম ১ম বর্ষ (সাধারণ)', 'আলিম ১ম বর্ষ (বিজ্ঞান)', 'ফাজিল ১ম বর্ষ'
];

const ELIGIBILITY = [
  ['ইবতেদায়ী', 'সরকারি নীতিমালা অনুযায়ী বয়স; প্রাথমিক মৌখিক সাক্ষাৎকার।'],
  ['দাখিল', 'পূর্ববর্তী শ্রেণিতে উত্তীর্ণের সনদ ও প্রশংসাপত্র।'],
  ['আলিম', 'দাখিল/এসএসসি উত্তীর্ণ, সরকার নির্ধারিত ন্যূনতম জিপিএ।'],
  ['ফাজিল', 'আলিম/এইচএসসি উত্তীর্ণ, ইসলামী আরবি বিশ্ববিদ্যালয়ের শর্ত সাপেক্ষে।']
];

const DOCUMENTS = [
  'শিক্ষার্থীর জন্ম নিবন্ধন সনদের ফটোকপি',
  'পাসপোর্ট সাইজের ৩ কপি রঙিন ছবি',
  'পিতা-মাতার জাতীয় পরিচয়পত্রের ফটোকপি',
  'পূর্ববর্তী প্রতিষ্ঠানের প্রশংসাপত্র ও নম্বরপত্র'
];

export async function initAdmissionPage() {
  const container = document.getElementById('admission-dynamic-content');
  if (!container) return;

  let settings = null;
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'admission'));
      if (snap.exists()) settings = snap.data();
    } catch (e) {
      console.warn('[Firestore] settings/admission:', e.message);
    }
  }

  const dates = Array.isArray(settings?.dates) ? settings.dates : [];
  const onlineEnabled = Boolean(db) && settings?.isOpen !== false;

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'ভর্তি',
      title: settings?.title ? esc(settings.title) : 'ভর্তি তথ্য ও আবেদন',
      lead: settings?.details
        ? esc(settings.details)
        : 'ইবতেদায়ী থেকে ফাজিল পর্যন্ত বিভিন্ন শ্রেণিতে ভর্তির যোগ্যতা, প্রয়োজনীয় কাগজপত্র ও আবেদনের নিয়ম।'
    })}

    <div class="grid gap-10 lg:grid-cols-5">
      <div class="space-y-12 lg:col-span-3">
        ${dates.length ? `
          <section>
            ${renderSectionHeading('সময়সূচি')}
            <dl class="card divide-y divide-stone-100">
              ${dates.map(d => `
                <div class="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                  <dt class="text-stone-600">${esc(d.label)}</dt>
                  <dd class="font-medium text-brand-800">${esc(d.date)}</dd>
                </div>
              `).join('')}
            </dl>
          </section>
        ` : ''}

        <section>
          ${renderSectionHeading('ভর্তির যোগ্যতা')}
          <dl class="card divide-y divide-stone-100">
            ${ELIGIBILITY.map(([k, v]) => `
              <div class="grid gap-1 px-5 py-4 text-sm sm:grid-cols-[7rem_1fr] sm:gap-4">
                <dt class="font-semibold text-brand-900">${k}</dt>
                <dd class="text-stone-600">${v}</dd>
              </div>
            `).join('')}
          </dl>
        </section>

        <section>
          ${renderSectionHeading('প্রয়োজনীয় কাগজপত্র')}
          <ul class="space-y-2.5 text-sm text-stone-700">
            ${DOCUMENTS.map(d => `<li class="flex gap-3"><span class="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500"></span>${d}</li>`).join('')}
          </ul>
          <a href="/downloads.html" class="link mt-6 inline-block text-sm">ভর্তি ফরম ডাউনলোড →</a>
        </section>
      </div>

      <aside class="lg:col-span-2">
        <div class="card p-6 lg:sticky lg:top-6">
          <h2 class="text-lg font-semibold text-brand-900">অনলাইন আবেদন</h2>
          <p class="mt-1 text-sm text-stone-500">তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করুন।</p>

          ${onlineEnabled ? '' : `
            <p class="mt-4 rounded-lg bg-gold-100/70 px-4 py-3 text-sm text-stone-700">
              অনলাইন আবেদন এই মুহূর্তে চালু নেই। ভর্তির জন্য সরাসরি মাদ্রাসা অফিসে যোগাযোগ করুন।
            </p>
          `}

          <form id="online-admission-form" class="mt-5 space-y-4" ${onlineEnabled ? '' : 'hidden'}>
            <label class="block"><span class="field-label">শিক্ষার্থীর নাম *</span>
              <input type="text" id="adm-student-name" required maxlength="100" class="field" autocomplete="name" /></label>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block"><span class="field-label">শ্রেণি *</span>
                <select id="adm-class" required class="field">
                  <option value="">নির্বাচন করুন</option>
                  ${CLASSES.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select></label>
              <label class="block"><span class="field-label">অভিভাবকের মোবাইল *</span>
                <input type="tel" id="adm-phone" required inputmode="tel" pattern="^(\\+?88)?0?1[3-9][0-9]{8}$|^(\\+?৮৮)?০?১[৩-৯][০-৯]{8}$" title="১১ সংখ্যার মোবাইল নম্বর লিখুন" placeholder="01XXXXXXXXX" class="field" /></label>
            </div>
            <label class="block"><span class="field-label">পিতার নাম *</span>
              <input type="text" id="adm-father-name" required maxlength="100" class="field" /></label>
            <label class="block"><span class="field-label">মাতার নাম *</span>
              <input type="text" id="adm-mother-name" required maxlength="100" class="field" /></label>
            <label class="block"><span class="field-label">বর্তমান ঠিকানা *</span>
              <textarea id="adm-address" required rows="2" maxlength="300" class="field"></textarea></label>
            <label class="block"><span class="field-label">পূর্ববর্তী প্রতিষ্ঠান</span>
              <input type="text" id="adm-prev-school" maxlength="150" class="field" /></label>
            <button type="submit" id="adm-submit-btn" class="btn btn-primary w-full">আবেদন জমা দিন</button>
          </form>

          <div id="admission-success-box" class="mt-5 hidden rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800" role="status">
            আপনার আবেদন জমা হয়েছে। মাদ্রাসা অফিস থেকে শীঘ্রই যোগাযোগ করা হবে।
          </div>
        </div>
      </aside>
    </div>
  `;

  const form = document.getElementById('online-admission-form');
  const submitBtn = document.getElementById('adm-submit-btn');
  const successBox = document.getElementById('admission-success-box');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!db) return;

    const val = id => document.getElementById(id).value.trim();
    const payload = {
      studentName: val('adm-student-name'),
      classApplied: val('adm-class'),
      phone: val('adm-phone'),
      fatherName: val('adm-father-name'),
      motherName: val('adm-mother-name'),
      address: val('adm-address'),
      previousSchool: val('adm-prev-school'),
      status: 'pending',
      createdAt: serverTimestamp()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'জমা হচ্ছে...';
    try {
      await addDoc(collection(db, 'admissions'), payload);
      form.reset();
      form.hidden = true;
      successBox.classList.remove('hidden');
      showAlert({ type: 'success', message: 'আবেদন সফলভাবে জমা হয়েছে।' });
    } catch (error) {
      console.error('[Firestore] admission submit:', error);
      showAlert({ type: 'error', message: 'আবেদন জমা দেওয়া যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।' });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'আবেদন জমা দিন';
    }
  });
}
