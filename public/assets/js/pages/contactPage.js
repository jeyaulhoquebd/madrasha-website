/**
 * Contact
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Contact details come from Firestore settings/general { phone, email, address, officeHours, mapEmbedUrl }
 */

import { db, addDoc, collection, serverTimestamp } from '../firebase/config.js';
import { getGeneralSettings } from '../components/layout.js';
import { showAlert } from '../components/alert.js';
import { renderPageHeader } from '../components/pageHeader.js';
import { esc, safeUrl } from '../utils/escape.js';
import { SITE } from '../site.js';

const DEFAULT_MAP = 'https://maps.google.com/maps?q=' + encodeURIComponent('Jail Road, Khagrachhari Sadar, Khagrachhari') + '&z=15&output=embed';
const SUBJECTS = ['ভর্তি সংক্রান্ত', 'ফলাফল ও সনদ', 'সাধারণ পরামর্শ', 'অন্যান্য'];

export async function initContactPage() {
  const container = document.getElementById('contact-page-container');
  if (!container) return;

  const settings = (await getGeneralSettings()) || {};
  const address = settings.address || SITE.address;
  const mapUrl = settings.mapEmbedUrl && /^https:\/\/(www\.)?google\.com\/maps\/embed/.test(settings.mapEmbedUrl)
    ? settings.mapEmbedUrl
    : DEFAULT_MAP;

  const info = [
    ['ঠিকানা', esc(address)],
    settings.phone ? ['ফোন', `<a href="tel:${esc(settings.phone)}" class="hover:text-brand-700">${esc(settings.phone)}</a>`] : null,
    settings.email ? ['ইমেইল', `<a href="mailto:${esc(settings.email)}" class="hover:text-brand-700">${esc(settings.email)}</a>`] : null,
    settings.officeHours ? ['অফিস সময়', esc(settings.officeHours)] : null,
    ['ইআইআইএন', SITE.eiin]
  ].filter(Boolean);

  container.innerHTML = `
    ${renderPageHeader({
      eyebrow: 'যোগাযোগ',
      title: 'যোগাযোগ করুন',
      lead: 'ভর্তি, ফলাফল বা যেকোনো প্রাতিষ্ঠানিক তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।'
    })}

    <div class="grid gap-10 lg:grid-cols-5">
      <div class="space-y-6 lg:col-span-2">
        <dl class="card divide-y divide-stone-100">
          ${info.map(([k, v]) => `
            <div class="px-5 py-4">
              <dt class="text-xs text-stone-500">${k}</dt>
              <dd class="mt-1 text-[15px] text-stone-800">${v}</dd>
            </div>
          `).join('')}
        </dl>
        <div class="card overflow-hidden">
          <iframe title="মাদ্রাসার অবস্থান" src="${safeUrl(mapUrl)}" class="h-72 w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
      </div>

      <div class="card p-6 sm:p-8 lg:col-span-3">
        <h2 class="text-lg font-semibold text-brand-900">বার্তা পাঠান</h2>
        <p class="mt-1 text-sm text-stone-500">আপনার প্রশ্ন বা মতামত লিখুন, প্রশাসন পর্যালোচনা করে উত্তর দেবে।</p>

        ${db ? '' : `<p class="mt-4 rounded-lg bg-gold-100/70 px-4 py-3 text-sm text-stone-700">অনলাইন বার্তা এই মুহূর্তে চালু নেই। অনুগ্রহ করে সরাসরি অফিসে যোগাযোগ করুন।</p>`}

        <form id="contact-inquiry-form" class="mt-6 space-y-4" ${db ? '' : 'hidden'}>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block"><span class="field-label">নাম *</span>
              <input type="text" id="contact-name" required maxlength="100" class="field" autocomplete="name" /></label>
            <label class="block"><span class="field-label">মোবাইল *</span>
              <input type="tel" id="contact-phone" required maxlength="20" inputmode="tel" class="field" autocomplete="tel" /></label>
            <label class="block"><span class="field-label">ইমেইল</span>
              <input type="email" id="contact-email" maxlength="120" class="field" autocomplete="email" /></label>
            <label class="block"><span class="field-label">বিষয় *</span>
              <select id="contact-subject" required class="field">
                ${SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select></label>
          </div>
          <label class="block"><span class="field-label">বার্তা *</span>
            <textarea id="contact-message" required rows="5" maxlength="2000" class="field"></textarea></label>
          <button type="submit" id="contact-submit-btn" class="btn btn-primary">বার্তা পাঠান</button>
        </form>

        <p id="contact-success-msg" class="mt-5 hidden rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-800" role="status">
          ধন্যবাদ! আপনার বার্তা পৌঁছেছে। প্রয়োজনে প্রশাসন আপনার সাথে যোগাযোগ করবে।
        </p>
      </div>
    </div>
  `;

  const form = document.getElementById('contact-inquiry-form');
  const btn = document.getElementById('contact-submit-btn');
  const success = document.getElementById('contact-success-msg');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!db) return;
    const val = id => document.getElementById(id).value.trim();

    btn.disabled = true;
    btn.textContent = 'পাঠানো হচ্ছে...';
    try {
      await addDoc(collection(db, 'messages'), {
        name: val('contact-name'),
        phone: val('contact-phone'),
        email: val('contact-email'),
        subject: val('contact-subject'),
        message: val('contact-message'),
        createdAt: serverTimestamp()
      });
      form.reset();
      success.classList.remove('hidden');
      showAlert({ type: 'success', message: 'বার্তা পাঠানো হয়েছে।' });
    } catch (error) {
      console.error('[Firestore] message submit:', error);
      showAlert({ type: 'error', message: 'বার্তা পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।' });
    } finally {
      btn.disabled = false;
      btn.textContent = 'বার্তা পাঠান';
    }
  });
}
