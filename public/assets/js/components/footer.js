/**
 * Footer
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import { SITE } from '../site.js';
import { esc, safeUrl } from '../utils/escape.js';
import { toBengaliNumber } from '../utils/date.js';

const col = (title, links) => `
  <div>
    <h4 class="mb-4 text-sm font-semibold text-white">${title}</h4>
    <ul class="space-y-2.5 text-sm">
      ${links.map(([label, url]) => `<li><a href="${url}" class="text-brand-100/70 transition hover:text-white">${label}</a></li>`).join('')}
    </ul>
  </div>
`;

export function renderFooter(settings = {}) {
  const address = settings?.address || SITE.address;
  const phone = settings?.phone || SITE.phone;
  const email = settings?.email || SITE.email;
  const year = toBengaliNumber(new Date().getFullYear());

  return `
    <footer class="mt-20 bg-brand-900 text-brand-100">
      <div class="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-4 lg:col-span-1">
          <div class="flex items-center gap-3">
            <img src="${SITE.logoUrl}" alt="" class="h-11 w-11 rounded-full bg-white object-contain p-0.5" />
            <p class="text-sm font-semibold leading-snug text-white">${SITE.shortName}</p>
          </div>
          <p class="text-sm leading-relaxed text-brand-100/70">
            ${SITE.established} সাল থেকে কুরআন-সুন্নাহ ও আধুনিক শিক্ষার সমন্বয়ে আদর্শ মানুষ গড়ার প্রত্যয়ে।
          </p>
          <dl class="grid grid-cols-2 gap-3 text-xs">
            <div><dt class="text-brand-100/50">ইআইআইএন</dt><dd class="mt-0.5 text-white">${SITE.eiin}</dd></div>
            <div><dt class="text-brand-100/50">স্থাপিত</dt><dd class="mt-0.5 text-white">${SITE.established}</dd></div>
          </dl>
        </div>

        ${col('প্রতিষ্ঠান', [
          ['পরিচিতি', '/about.html'],
          ['পরিচালনা পর্ষদ', '/administration.html'],
          ['শিক্ষকবৃন্দ', '/teachers.html'],
          ['কর্মকর্তা ও কর্মচারী', '/staff.html'],
          ['গ্যালারি', '/gallery.html']
        ])}

        ${col('শিক্ষার্থী সেবা', [
          ['ভর্তি তথ্য', '/admission.html'],
          ['নোটিশ বোর্ড', '/notices.html'],
          ['পরীক্ষার ফলাফল', '/results.html'],
          ['ক্লাস ও পরীক্ষা রুটিন', '/routines.html'],
          ['ডাউনলোড', '/downloads.html']
        ])}

        <div>
          <h4 class="mb-4 text-sm font-semibold text-white">যোগাযোগ</h4>
          <ul class="space-y-2.5 text-sm text-brand-100/70">
            <li id="footer-address">${esc(address)}</li>
            <li id="footer-phone">ফোন: <a class="hover:text-white" href="tel:${esc(phone)}">${esc(phone)}</a></li>
            <li id="footer-email">ইমেইল: <a class="hover:text-white" href="mailto:${esc(email)}">${esc(email)}</a></li>
            <li id="footer-social" class="flex gap-3 pt-1">
              ${settings?.facebookUrl ? `<a href="${safeUrl(settings.facebookUrl)}" target="_blank" rel="noopener noreferrer" class="hover:text-white">ফেসবুক</a>` : ''}
              ${settings?.youtubeUrl ? `<a href="${safeUrl(settings.youtubeUrl)}" target="_blank" rel="noopener noreferrer" class="hover:text-white">ইউটিউব</a>` : ''}
            </li>
            <li><a href="/contact.html" class="font-medium text-gold-300 hover:text-white">যোগাযোগ পাতা →</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-100/50 sm:flex-row">
          <p>© ${year} ${SITE.name}</p>
          <p id="footer-dev-credit">${settings?.developerCredit ? esc(settings.developerCredit) : ''}</p>
        </div>
      </div>
    </footer>
  `;
}
