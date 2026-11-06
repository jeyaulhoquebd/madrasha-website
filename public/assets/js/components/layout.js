/**
 * Master Page Layout Engine
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Modular Vanilla JavaScript ES Modules
 */

import { renderHeader } from './header.js';
import { renderNavigation } from './navigation.js';
import { renderMobileMenu, initMobileMenu } from './mobileMenu.js';
import { renderNoticeTicker } from './noticeTicker.js';
import { renderBreadcrumbs } from './breadcrumb.js';
import { renderFooter } from './footer.js';

/**
 * Initializes and mounts institutional components into target DOM slots
 * @param {object} options
 * @param {string} options.activePage - key of the active page
 * @param {Array} [options.breadcrumbs] - array of breadcrumb objects [{label, url}]
 * @param {boolean} [options.showTicker=false] - whether to show the notice ticker
 * @param {Array} [options.notices] - active ticker notices
 * @param {object} [options.settings] - dynamic institutional settings from Firestore
 */
export function initPageLayout({
  activePage = 'home',
  breadcrumbs = [],
  showTicker = false,
  notices = [],
  settings = {}
} = {}) {
  // 1. Mount Header & Nav
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      ${renderHeader(settings)}
      ${renderNavigation(activePage)}
      ${showTicker ? renderNoticeTicker(notices) : ''}
      ${breadcrumbs && breadcrumbs.length > 0 ? renderBreadcrumbs(breadcrumbs) : ''}
    `;
  }

  // 2. Mount Mobile Menu Drawer & Backdrop
  let mobileMenuSlot = document.getElementById('mobile-menu-slot');
  if (!mobileMenuSlot) {
    mobileMenuSlot = document.createElement('div');
    mobileMenuSlot.id = 'mobile-menu-slot';
    document.body.appendChild(mobileMenuSlot);
  }
  mobileMenuSlot.innerHTML = renderMobileMenu(activePage);
  initMobileMenu();

  // 3. Mount Footer
  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter(settings);
  }

  console.log(`[Madrasa Portal] Layout initialized for page: ${activePage}`);
}

/**
 * Updates dynamic settings in the mounted header and footer
 */
export function updateLayoutSettings(settings = {}) {
  if (settings.phone) {
    const headerPhone = document.getElementById('header-phone');
    if (headerPhone) headerPhone.querySelector('span').textContent = settings.phone;
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) footerPhone.innerHTML = `হেল্পলাইন: <span class="font-mono">${settings.phone}</span>`;
  }

  if (settings.email) {
    const headerEmail = document.getElementById('header-email');
    if (headerEmail) headerEmail.querySelector('span').textContent = settings.email;
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) footerEmail.innerHTML = `ইমেইল: <span class="font-mono">${settings.email}</span>`;
  }

  if (settings.address) {
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress) footerAddress.textContent = settings.address;
  }

  if (settings.developerCredit) {
    const devCredit = document.getElementById('footer-dev-credit');
    if (devCredit) devCredit.textContent = settings.developerCredit;
  }
}
