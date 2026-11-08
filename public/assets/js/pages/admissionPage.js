/**
 * Admission (information + full online application)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Firestore: settings/admission { title, details, isOpen, dates: [{label, date}] }
 *            admissions (public create-only, validated by firestore.rules; reviewed by admins)
 */

import { db, doc, getDoc, addDoc, collection, serverTimestamp } from '../firebase/config.js';
import { showAlert } from '../components/alert.js';
import { renderPageHeader, renderSectionHeading } from '../components/pageHeader.js';
import { esc } from '../utils/escape.js';
import { photoToDataUrl } from '../utils/image.js';
import { SITE, HIFZ_URL } from '../site.js';

// level → classes
export const ADMISSION_CLASSES = {
  ebtedayee: { label: 'ইবতেদায়ী (প্রাথমিক)', classes: ['প্রথম শ্রেণি', 'দ্বিতীয় শ্রেণি', 'তৃতীয় শ্রেণি', 'চতুর্থ শ্রেণি', 'পঞ্চম শ্রেণি'] },
  dakhil: { label: 'দাখিল (মাধ্যমিক)', classes: ['ষষ্ঠ শ্রেণি', 'সপ্তম শ্রেণি', 'অষ্টম শ্রেণি', 'নবম শ্রেণি', 'দশম শ্রেণি'] },
  alim: { label: 'আলিম (উচ্চ মাধ্যমিক)', classes: ['আলিম ১ম বর্ষ (একাদশ)', 'আলিম ২য় বর্ষ (দ্বাদশ)'] },
  fazil: { label: 'ফাজিল (স্নাতক)', classes: ['ফাজিল ১ম বর্ষ', 'ফাজিল ২য় বর্ষ', 'ফাজিল ৩য় বর্ষ'] }
};

const ELIGIBILITY = [
  ['ইবতেদায়ী', 'সরকারি নীতিমালা অনুযায়ী বয়স; প্রাথমিক মৌখিক সাক্ষাৎকার।'],
  ['দাখিল', 'পূর্ববর্তী শ্রেণিতে উত্তীর্ণের সনদ ও প্রশংসাপত্র।'],
  ['আলিম', 'দাখিল/এসএসসি উত্তীর্ণ, সরকার নির্ধারিত ন্যূনতম জিপিএ।'],
  ['ফাজিল', 'আলিম/এইচএসসি উত্তীর্ণ, ইসলামী আরবি বিশ্ববিদ্যালয়ের শর্ত সাপেক্ষে।']
];

const DOCUMENTS = [
  'শিক্ষার্থীর জন্ম নিবন্ধন সনদের ফটোকপি',
  'শিক্ষার্থীর পাসপোর্ট সাইজের ৩ কপি রঙিন ছবি',
  'পিতা ও মাতার জাতীয় পরিচয়পত্রের ফটোকপি',
  'পূর্ববর্তী প্রতিষ্ঠানের প্রশংসাপত্র ও ছাড়পত্র (টিসি)',
  'সর্বশেষ পরীক্ষার নম্বরপত্র',
  'আলিম/ফাজিলের জন্য: দাখিল/আলিম পরীক্ষার মূল নম্বরপত্র, প্রবেশপত্র ও রেজিস্ট্রেশন কার্ড',
  'আলিম/ফাজিলের জন্য: শিক্ষার্থীর জাতীয় পরিচয়পত্র (থাকলে)'
];

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const toEnDigits = s => String(s || '').replace(/[০-৯]/g, d => BN_DIGITS.indexOf(d));
const isMobile = s => /^01[3-9]\d{8}$/.test(toEnDigits(s).replace(/[\s-]/g, '').replace(/^\+?88/, ''));
const cleanMobile = s => toEnDigits(s).replace(/[\s-]/g, '').replace(/^\+?88/, '');
const digitsOnly = s => toEnDigits(s).replace(/\D/g, '');

function section(no, title, body, note = '') {
  return `
    <fieldset class="border-t border-stone-100 pt-6 first:border-0 first:pt-0">
      <legend class="mb-4 flex items-center gap-3">
        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">${no}</span>
        <span class="text-base font-semibold text-brand-900">${title}</span>
      </legend>
      ${note ? `<p class="-mt-2 mb-4 text-xs text-stone-500">${note}</p>` : ''}
      <div class="grid gap-4 sm:grid-cols-2">${body}</div>
    </fieldset>
  `;
}

const input = (id, label, { required = false, type = 'text', full = false, placeholder = '', max = 100, attrs = '', help = '' } = {}) => `
  <label class="block ${full ? 'sm:col-span-2' : ''}" ${attrs}>
    <span class="field-label">${label}${required ? ' <span class="text-rose-600">*</span>' : ''}</span>
    <input type="${type}" id="${id}" name="${id}" class="field" maxlength="${max}" ${required ? 'required' : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} />
    ${help ? `<span class="mt-1 block text-xs text-stone-400">${help}</span>` : ''}
  </label>`;

const select = (id, label, options, { required = false, attrs = '' } = {}) => `
  <label class="block" ${attrs}>
    <span class="field-label">${label}${required ? ' <span class="text-rose-600">*</span>' : ''}</span>
    <select id="${id}" name="${id}" class="field" ${required ? 'required' : ''}>
      <option value="">নির্বাচন করুন</option>
      ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
    </select>
  </label>`;

function renderForm() {
  const year = new Date().getFullYear();
  const sessions = [String(year + 1), String(year)];

  return `
    <form id="online-admission-form" class="space-y-8" novalidate>
      ${section('১', 'ভর্তির তথ্য', `
        <label class="block">
          <span class="field-label">যে শ্রেণিতে ভর্তি হতে চান <span class="text-rose-600">*</span></span>
          <select id="adm-class" name="adm-class" required class="field">
            <option value="">নির্বাচন করুন</option>
            ${Object.entries(ADMISSION_CLASSES).map(([level, g]) => `
              <optgroup label="${g.label}">
                ${g.classes.map(c => `<option value="${c}" data-level="${level}">${c}</option>`).join('')}
              </optgroup>`).join('')}
          </select>
          <span class="mt-1 block text-xs text-stone-400">হিফজ বিভাগে ভর্তির জন্য <a href="${HIFZ_URL}" target="_blank" rel="noopener" class="link">হিফজ একাডেমির ওয়েবসাইট</a> দেখুন।</span>
        </label>
        ${select('adm-session', 'শিক্ষাবর্ষ', sessions, { required: true })}
      `)}

      ${section('২', 'শিক্ষার্থীর তথ্য', `
        <div class="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div id="adm-photo-preview" class="flex h-36 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 text-center text-xs text-stone-400">ছবি</div>
          <div>
            <span class="field-label">শিক্ষার্থীর ছবি <span class="text-rose-600">*</span></span>
            <label class="btn btn-outline cursor-pointer">
              <input type="file" id="adm-photo" accept="image/*" class="sr-only" />
              ছবি নির্বাচন করুন
            </label>
            <p class="mt-2 text-xs leading-relaxed text-stone-500">সাম্প্রতিক তোলা পাসপোর্ট সাইজের রঙিন ছবি (JPG/PNG)। ছবিটি স্বয়ংক্রিয়ভাবে ছোট করে নেওয়া হবে।</p>
          </div>
        </div>
        ${input('adm-student-name', 'শিক্ষার্থীর নাম (বাংলায়)', { required: true })}
        ${input('adm-student-name-en', 'শিক্ষার্থীর নাম (ইংরেজিতে, বড় হাতের অক্ষরে)', { required: true, placeholder: 'MD. ABDULLAH' })}
        ${input('adm-dob', 'জন্ম তারিখ', { required: true, type: 'date' })}
        ${select('adm-gender', 'লিঙ্গ', ['ছাত্র', 'ছাত্রী'], { required: true })}
        ${input('adm-birth-reg', 'জন্ম নিবন্ধন নম্বর', { required: true, max: 20, help: '১৭ সংখ্যার জন্ম নিবন্ধন নম্বর' })}
        ${input('adm-nid', 'জাতীয় পরিচয়পত্র (NID) নম্বর', { max: 20, attrs: 'data-for="alim fazil" hidden', help: 'আলিম/ফাজিল শিক্ষার্থীর NID থাকলে দিন' })}
        ${select('adm-blood', 'রক্তের গ্রুপ', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'জানা নেই'])}
      `)}

      ${section('৩', 'পিতা ও মাতার তথ্য', `
        ${input('adm-father-name', 'পিতার নাম', { required: true })}
        ${input('adm-father-phone', 'পিতার মোবাইল নম্বর', { required: true, type: 'tel', max: 16, placeholder: '01XXXXXXXXX' })}
        ${input('adm-father-nid', 'পিতার NID নম্বর', { max: 20 })}
        ${input('adm-father-occupation', 'পিতার পেশা', { max: 60 })}
        ${input('adm-mother-name', 'মাতার নাম', { required: true })}
        ${input('adm-mother-phone', 'মাতার মোবাইল নম্বর', { type: 'tel', max: 16, placeholder: '01XXXXXXXXX' })}
        ${input('adm-mother-nid', 'মাতার NID নম্বর', { max: 20 })}
      `)}

      ${section('৪', 'অভিভাবকের তথ্য', `
        ${input('adm-guardian-name', 'অভিভাবকের নাম')}
        ${input('adm-guardian-relation', 'শিক্ষার্থীর সাথে সম্পর্ক', { max: 40, placeholder: 'যেমন: চাচা' })}
        ${input('adm-guardian-phone', 'অভিভাবকের মোবাইল নম্বর', { type: 'tel', max: 16, placeholder: '01XXXXXXXXX' })}
      `, 'পিতা-মাতা ছাড়া অন্য কেউ অভিভাবক হলে পূরণ করুন।')}

      ${section('৫', 'ঠিকানা', `
        <label class="block sm:col-span-2"><span class="field-label">বর্তমান ঠিকানা <span class="text-rose-600">*</span></span>
          <textarea id="adm-present-address" required rows="2" maxlength="300" class="field" placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা"></textarea></label>
        <label class="flex items-center gap-2 text-sm text-stone-600 sm:col-span-2">
          <input type="checkbox" id="adm-same-address" class="h-4 w-4 accent-brand-700" /> স্থায়ী ঠিকানা বর্তমান ঠিকানার মতোই
        </label>
        <label class="block sm:col-span-2"><span class="field-label">স্থায়ী ঠিকানা <span class="text-rose-600">*</span></span>
          <textarea id="adm-permanent-address" required rows="2" maxlength="300" class="field" placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা"></textarea></label>
      `)}

      ${section('৬', 'পূর্ববর্তী শিক্ষা', `
        ${input('adm-prev-school', 'পূর্ববর্তী শিক্ষা প্রতিষ্ঠানের নাম', { max: 150, full: true })}
        ${input('adm-prev-class', 'সর্বশেষ উত্তীর্ণ শ্রেণি / পরীক্ষা', { max: 60, placeholder: 'যেমন: পঞ্চম শ্রেণি / দাখিল' })}
        ${input('adm-prev-result', 'ফলাফল / জিপিএ', { max: 30 })}
        ${input('adm-prev-roll', 'বোর্ড পরীক্ষার রোল নম্বর', { max: 20, attrs: 'data-for="alim fazil" hidden' })}
        ${input('adm-prev-reg', 'রেজিস্ট্রেশন নম্বর', { max: 20, attrs: 'data-for="alim fazil" hidden' })}
        ${input('adm-prev-year', 'পাসের সাল', { max: 4, attrs: 'data-for="alim fazil" hidden' })}
        ${select('adm-prev-board', 'বোর্ড / বিশ্ববিদ্যালয়', ['বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড', 'চট্টগ্রাম শিক্ষা বোর্ড', 'অন্যান্য শিক্ষা বোর্ড', 'ইসলামী আরবি বিশ্ববিদ্যালয়'], { attrs: 'data-for="alim fazil" hidden' })}
      `, 'প্রথম শ্রেণিতে ভর্তির ক্ষেত্রে প্রযোজ্য না হলে খালি রাখুন।')}

      ${section('৭', 'অন্যান্য', `
        <label class="block sm:col-span-2"><span class="field-label">অতিরিক্ত তথ্য</span>
          <textarea id="adm-notes" rows="2" maxlength="500" class="field" placeholder="বিশেষ কোনো তথ্য থাকলে লিখুন (যেমন: হিফজ সম্পন্ন, শারীরিক বিবেচনা ইত্যাদি)"></textarea></label>
        <label class="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 sm:col-span-2">
          <input type="checkbox" id="adm-declare" required class="mt-1 h-4 w-4 accent-brand-700" />
          <span>আমি ঘোষণা করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও নির্ভুল। কোনো তথ্য ভুল প্রমাণিত হলে কর্তৃপক্ষ আবেদন বাতিল করতে পারবেন।</span>
        </label>
      `)}

      <div class="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-stone-500"><span class="text-rose-600">*</span> চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে।</p>
        <button type="submit" id="adm-submit-btn" class="btn btn-primary px-8">আবেদন জমা দিন</button>
      </div>
    </form>
  `;
}

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
      title: settings?.title ? esc(settings.title) : 'ভর্তি তথ্য ও অনলাইন আবেদন',
      lead: settings?.details
        ? esc(settings.details)
        : 'ইবতেদায়ী প্রথম শ্রেণি থেকে ফাজিল পর্যন্ত ভর্তির যোগ্যতা, প্রয়োজনীয় কাগজপত্র এবং অনলাইন আবেদন ফরম।'
    })}

    <div class="no-print grid gap-6 lg:grid-cols-3">
      <section class="card p-6">
        <h2 class="font-semibold text-brand-900">ভর্তির যোগ্যতা</h2>
        <dl class="mt-4 space-y-3 text-sm">
          ${ELIGIBILITY.map(([k, v]) => `<div><dt class="font-medium text-stone-800">${k}</dt><dd class="text-stone-600">${v}</dd></div>`).join('')}
        </dl>
      </section>
      <section class="card p-6">
        <h2 class="font-semibold text-brand-900">প্রয়োজনীয় কাগজপত্র</h2>
        <ul class="mt-4 space-y-2 text-sm text-stone-700">
          ${DOCUMENTS.map(d => `<li class="flex gap-2.5"><span class="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500"></span>${d}</li>`).join('')}
        </ul>
      </section>
      <section class="card p-6">
        <h2 class="font-semibold text-brand-900">${dates.length ? 'সময়সূচি' : 'যোগাযোগ'}</h2>
        ${dates.length ? `
          <dl class="mt-4 divide-y divide-stone-100 text-sm">
            ${dates.map(d => `<div class="flex justify-between gap-3 py-2"><dt class="text-stone-600">${esc(d.label)}</dt><dd class="font-medium text-brand-800">${esc(d.date)}</dd></div>`).join('')}
          </dl>` : `
          <p class="mt-4 text-sm leading-relaxed text-stone-600">ভর্তি সংক্রান্ত যেকোনো তথ্যের জন্য অফিস চলাকালীন যোগাযোগ করুন।</p>
          <p class="mt-3 text-sm"><a href="tel:${SITE.phone}" class="link">${SITE.phone}</a></p>
          <p class="text-sm"><a href="mailto:${SITE.email}" class="link">${SITE.email}</a></p>`}
        <div class="mt-5 space-y-2 border-t border-stone-100 pt-4 text-sm">
          <a href="/downloads.html" class="link block">অফলাইন ভর্তি ফরম ডাউনলোড →</a>
          <a href="${HIFZ_URL}" target="_blank" rel="noopener" class="link block">হিফজ বিভাগে ভর্তি →</a>
        </div>
      </section>
    </div>

    <section id="apply" class="mt-12 scroll-mt-6">
      <div class="no-print">${renderSectionHeading('অনলাইন ভর্তি আবেদন')}</div>
      <div id="admission-form-card" class="card p-6 sm:p-8">
        ${onlineEnabled ? renderForm() : `
          <p class="rounded-lg bg-gold-100/70 px-4 py-3 text-sm text-stone-700">
            অনলাইন আবেদন এই মুহূর্তে চালু নেই। ভর্তির জন্য সরাসরি মাদ্রাসা অফিসে যোগাযোগ করুন অথবা অফলাইন ফরম ডাউনলোড করুন।
          </p>`}
      </div>
    </section>
  `;

  if (onlineEnabled) bindForm();
}

function bindForm() {
  const form = document.getElementById('online-admission-form');
  const classSel = document.getElementById('adm-class');
  const photoInput = document.getElementById('adm-photo');
  const preview = document.getElementById('adm-photo-preview');
  const submitBtn = document.getElementById('adm-submit-btn');
  const val = id => document.getElementById(id)?.value.trim() || '';
  let photo = '';

  const currentLevel = () => classSel.selectedOptions[0]?.dataset.level || '';

  // Show NID / board exam fields only for Alim and Fazil
  classSel.addEventListener('change', () => {
    const level = currentLevel();
    form.querySelectorAll('[data-for]').forEach(el => {
      el.hidden = !el.dataset.for.split(' ').includes(level);
    });
  });

  photoInput.addEventListener('change', async () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    try {
      photo = await photoToDataUrl(file);
      preview.innerHTML = `<img src="${photo}" alt="শিক্ষার্থীর ছবি" class="h-full w-full object-cover" />`;
      preview.classList.remove('border-dashed', 'border-rose-400');
    } catch (e) {
      photo = '';
      showAlert({ type: 'error', message: e.message });
    }
  });

  document.getElementById('adm-same-address').addEventListener('change', e => {
    const perm = document.getElementById('adm-permanent-address');
    if (e.target.checked) perm.value = val('adm-present-address');
    perm.readOnly = e.target.checked;
  });
  document.getElementById('adm-present-address').addEventListener('input', () => {
    if (document.getElementById('adm-same-address').checked) {
      document.getElementById('adm-permanent-address').value = val('adm-present-address');
    }
  });

  const fail = (id, message) => {
    showAlert({ type: 'error', message });
    const el = document.getElementById(id);
    el?.focus();
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  };

  function validate() {
    if (!form.checkValidity()) {
      const bad = form.querySelector('input:invalid, select:invalid, textarea:invalid');
      const label = bad?.closest('label')?.querySelector('.field-label')?.textContent.replace('*', '').trim();
      return fail(bad?.id, label ? `"${label}" পূরণ করুন।` : 'সব প্রয়োজনীয় ঘর পূরণ করুন।');
    }
    if (!photo) {
      preview.classList.add('border-rose-400');
      return fail('adm-photo', 'শিক্ষার্থীর ছবি দিন।');
    }
    const reg = digitsOnly(val('adm-birth-reg'));
    if (reg.length !== 17) return fail('adm-birth-reg', 'জন্ম নিবন্ধন নম্বর ১৭ সংখ্যার হতে হবে।');
    for (const id of ['adm-nid', 'adm-father-nid', 'adm-mother-nid']) {
      const n = digitsOnly(val(id));
      if (n && ![10, 13, 17].includes(n.length)) return fail(id, 'NID নম্বর ১০, ১৩ অথবা ১৭ সংখ্যার হতে হবে।');
    }
    if (!isMobile(val('adm-father-phone'))) return fail('adm-father-phone', 'পিতার সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।');
    for (const id of ['adm-mother-phone', 'adm-guardian-phone']) {
      if (val(id) && !isMobile(val(id))) return fail(id, 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।');
    }
    return true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!db || !validate()) return;

    const level = currentLevel();
    const higher = level === 'alim' || level === 'fazil';
    const payload = {
      classApplied: val('adm-class'),
      level,
      session: val('adm-session'),
      photo,
      studentName: val('adm-student-name'),
      studentNameEn: val('adm-student-name-en').toUpperCase(),
      dateOfBirth: val('adm-dob'),
      gender: val('adm-gender'),
      birthRegNo: digitsOnly(val('adm-birth-reg')),
      nid: higher ? digitsOnly(val('adm-nid')) : '',
      bloodGroup: val('adm-blood'),
      fatherName: val('adm-father-name'),
      fatherPhone: cleanMobile(val('adm-father-phone')),
      fatherNid: digitsOnly(val('adm-father-nid')),
      fatherOccupation: val('adm-father-occupation'),
      motherName: val('adm-mother-name'),
      motherPhone: val('adm-mother-phone') ? cleanMobile(val('adm-mother-phone')) : '',
      motherNid: digitsOnly(val('adm-mother-nid')),
      guardianName: val('adm-guardian-name'),
      guardianRelation: val('adm-guardian-relation'),
      guardianPhone: val('adm-guardian-phone') ? cleanMobile(val('adm-guardian-phone')) : '',
      presentAddress: val('adm-present-address'),
      permanentAddress: val('adm-permanent-address'),
      previousSchool: val('adm-prev-school'),
      previousClass: val('adm-prev-class'),
      previousResult: val('adm-prev-result'),
      prevExamRoll: higher ? val('adm-prev-roll') : '',
      prevExamReg: higher ? val('adm-prev-reg') : '',
      prevExamYear: higher ? val('adm-prev-year') : '',
      prevBoard: higher ? val('adm-prev-board') : '',
      notes: val('adm-notes'),
      phone: cleanMobile(val('adm-guardian-phone') || val('adm-father-phone')),
      status: 'pending',
      createdAt: serverTimestamp()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'জমা হচ্ছে...';
    try {
      const ref = await addDoc(collection(db, 'admissions'), payload);
      showSuccess(ref.id, payload);
      showAlert({ type: 'success', message: 'আবেদন সফলভাবে জমা হয়েছে।' });
    } catch (error) {
      console.error('[Firestore] admission submit:', error);
      showAlert({ type: 'error', message: 'আবেদন জমা দেওয়া যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।' });
      submitBtn.disabled = false;
      submitBtn.textContent = 'আবেদন জমা দিন';
    }
  });
}

function showSuccess(id, p) {
  const appNo = id.slice(0, 8).toUpperCase();
  const row = (k, v) => (v ? `<tr><th class="w-2/5 py-1.5 pr-4 text-left font-normal text-stone-500">${k}</th><td class="py-1.5 text-stone-800">${esc(v)}</td></tr>` : '');

  document.getElementById('admission-form-card').innerHTML = `
    <div class="no-print mb-6 rounded-lg bg-brand-50 px-5 py-4 text-sm text-brand-800" role="status">
      <p class="font-semibold">আপনার আবেদন জমা হয়েছে।</p>
      <p class="mt-1">আবেদন নম্বর: <strong class="font-mono">${appNo}</strong> — এই নম্বরটি সংরক্ষণ করুন। মাদ্রাসা অফিস থেকে শীঘ্রই যোগাযোগ করা হবে।</p>
    </div>

    <div class="flex items-start justify-between gap-6 border-b border-stone-200 pb-5">
      <div>
        <p class="text-xs text-stone-500">${SITE.name}</p>
        <h2 class="mt-1 text-xl font-bold text-brand-900">ভর্তি আবেদনের সারসংক্ষেপ</h2>
        <p class="mt-1 text-sm text-stone-600">আবেদন নম্বর: <span class="font-mono font-semibold">${appNo}</span> · শিক্ষাবর্ষ: ${esc(p.session)}</p>
      </div>
      <img src="${p.photo}" alt="" class="h-32 w-24 flex-shrink-0 rounded-md border border-stone-200 object-cover" />
    </div>

    <table class="mt-5 w-full text-sm">
      ${row('ভর্তির শ্রেণি', p.classApplied)}
      ${row('শিক্ষার্থীর নাম', p.studentName)}
      ${row('Name (English)', p.studentNameEn)}
      ${row('জন্ম তারিখ', p.dateOfBirth)}
      ${row('লিঙ্গ', p.gender)}
      ${row('জন্ম নিবন্ধন নম্বর', p.birthRegNo)}
      ${row('NID নম্বর', p.nid)}
      ${row('পিতার নাম', p.fatherName)}
      ${row('পিতার মোবাইল', p.fatherPhone)}
      ${row('মাতার নাম', p.motherName)}
      ${row('মাতার মোবাইল', p.motherPhone)}
      ${row('অভিভাবক', p.guardianName && `${p.guardianName} (${p.guardianRelation || 'অভিভাবক'}) ${p.guardianPhone}`)}
      ${row('বর্তমান ঠিকানা', p.presentAddress)}
      ${row('স্থায়ী ঠিকানা', p.permanentAddress)}
      ${row('পূর্ববর্তী প্রতিষ্ঠান', p.previousSchool)}
    </table>

    <div class="no-print mt-8 flex flex-wrap gap-3">
      <button type="button" onclick="window.print()" class="btn btn-primary">প্রিন্ট / PDF সংরক্ষণ</button>
      <a href="/admission.html" class="btn btn-outline">নতুন আবেদন</a>
    </div>
  `;
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
}
