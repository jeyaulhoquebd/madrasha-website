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
 * @param {string} options.activePage - key of the active page (e.g. 'home', 'about', 'teachers', 'notices', etc.)
 * @param {Array} [options.breadcrumbs] - array of breadcrumb objects [{label, url}]
 * @param {boolean} [options.showTicker=true] - whether to show the notice ticker
 * @param {Array} [options.notices] - active ticker notices
 */
export function initPageLayout({
  activePage = 'home',
  breadcrumbs = [],
  showTicker = false,
  notices = []
} = {}) {
  // 1. Mount Header & Nav
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      ${renderHeader()}
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
    footerContainer.innerHTML = renderFooter();
  }

  console.log(`[Madrasa Portal] Layout initialized for page: ${activePage}`);
}
