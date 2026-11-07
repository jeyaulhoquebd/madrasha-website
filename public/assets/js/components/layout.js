/**
 * Page Layout Engine
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

import { renderHeader } from './header.js';
import { renderMobileMenu, initMobileMenu } from './mobileMenu.js';
import { renderNoticeTicker } from './noticeTicker.js';
import { renderBreadcrumbs } from './breadcrumb.js';
import { renderFooter } from './footer.js';
import { db, doc, getDoc } from '../firebase/config.js';
import { esc, safeUrl } from '../utils/escape.js';

/**
 * Mounts header, navigation, mobile drawer, breadcrumbs and footer.
 * Also loads settings/general from Firestore (when connected) so that
 * contact details appear on every page.
 */
export function initPageLayout({
  activePage = 'home',
  breadcrumbs = [],
  showTicker = false,
  notices = [],
  settings = {}
} = {}) {
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      ${renderHeader(settings, activePage)}
      ${showTicker ? renderNoticeTicker(notices) : ''}
      ${renderBreadcrumbs(breadcrumbs)}
    `;
  }

  let mobileMenuSlot = document.getElementById('mobile-menu-slot');
  if (!mobileMenuSlot) {
    mobileMenuSlot = document.createElement('div');
    mobileMenuSlot.id = 'mobile-menu-slot';
    document.body.appendChild(mobileMenuSlot);
  }
  mobileMenuSlot.innerHTML = renderMobileMenu(activePage);
  initMobileMenu();

  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter(settings);
  }

  loadGeneralSettings();
}

let settingsPromise = null;

/** Fetches settings/general once per page load (null in standby mode). */
export function getGeneralSettings() {
  if (!settingsPromise) {
    settingsPromise = (async () => {
      if (!db) return null;
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        return snap.exists() ? snap.data() : null;
      } catch (error) {
        console.warn('[Firestore] settings/general:', error.message);
        return null;
      }
    })();
  }
  return settingsPromise;
}

async function loadGeneralSettings() {
  const settings = await getGeneralSettings();
  if (settings) updateLayoutSettings(settings);
}

/** Updates the mounted header and footer with dynamic contact settings */
export function updateLayoutSettings(settings = {}) {
  const set = (id, html) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    el.classList.toggle('hidden', !html);
  };

  if (settings.phone) {
    const phone = esc(settings.phone);
    set('header-phone', `ফোন: <a class="text-white hover:underline" href="tel:${phone}">${phone}</a>`);
    set('footer-phone', `ফোন: <a class="hover:text-white" href="tel:${phone}">${phone}</a>`);
  }
  if (settings.email) {
    const email = esc(settings.email);
    set('footer-email', `ইমেইল: <a class="hover:text-white" href="mailto:${email}">${email}</a>`);
  }
  if (settings.address) {
    const el = document.getElementById('footer-address');
    if (el) el.textContent = settings.address;
  }
  if (settings.facebookUrl || settings.youtubeUrl) {
    set('footer-social', [
      settings.facebookUrl ? `<a href="${safeUrl(settings.facebookUrl)}" target="_blank" rel="noopener noreferrer" class="hover:text-white">ফেসবুক</a>` : '',
      settings.youtubeUrl ? `<a href="${safeUrl(settings.youtubeUrl)}" target="_blank" rel="noopener noreferrer" class="hover:text-white">ইউটিউব</a>` : ''
    ].join(''));
  }
  if (settings.developerCredit) {
    const el = document.getElementById('footer-dev-credit');
    if (el) el.textContent = `ওয়েবসাইট: ${settings.developerCredit}`;
  }
}
