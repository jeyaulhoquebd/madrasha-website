/**
 * Verified institutional constants (single source of truth)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Only verified facts belong here. Phone / email below come from the public
 * EIIN registry and can be overridden from Admin → Settings (settings/general).
 */

export const SITE = {
  name: 'খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা',
  shortName: 'বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল মাদ্রাসা',
  englishName: 'Khagrachhari Baitush Sharaf Jabbaria Adarsha Fazil (Degree) Madrasah',

  // Source: institution.bd/eiin/131810 (government institution registry)
  eiin: '১৩১৮১০',
  established: '১৯৯১',
  establishedFull: '১ জানুয়ারি ১৯৯১',
  level: 'ফাজিল (পাস)',
  type: 'আলিয়া মাদ্রাসা',
  management: 'বেসরকারি',
  gender: 'সহশিক্ষা (ছাত্র-ছাত্রী)',
  status: 'চলমান',
  address: 'বায়তুশ শরফ রোড, আরামবাগ, খাগড়াছড়ি সদর, খাগড়াছড়ি – ৪৪০০',
  addressDetail: 'আরামবাগ মৌজা, খাগড়াছড়ি পৌরসভা (ওয়ার্ড নং ৩), খাগড়াছড়ি সদর উপজেলা',
  email: 'bsjadmkc@gmail.com',
  phone: '01309131810',
  mapQuery: 'Baitush Sharaf Road, Arambagh, Khagrachhari',

  logoUrl: 'https://res.cloudinary.com/edsn06rr/image/upload/v1793898297/images.jpg',
  heroUrl: 'https://res.cloudinary.com/edsn06rr/image/upload/v1793898407/a1a9d6b9-0f63-4ca4-bb47-8a8fc27dd326.png',
  muhtamimPhoto: '/assets/images/muhtamim.jpg',
  bismillah: 'بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيْمِ'
};

/** Hifz department has its own website */
export const HIFZ_URL = 'https://hifjacademy.com/';

/** Website developer credit (footer) */
export const DEVELOPER = { name: 'Jeyaul Hoque', url: 'https://jeyaulhoque.pages.dev/' };

/** Primary navigation (shared by desktop header and mobile drawer) */
export const NAV_ITEMS = [
  { key: 'home', label: 'মূলপাতা', url: '/' },
  { key: 'about', label: 'পরিচিতি', url: '/about.html' },
  {
    key: 'people',
    label: 'প্রশাসন',
    match: ['administration', 'teachers', 'staff'],
    children: [
      { key: 'administration', label: 'পরিচালনা পর্ষদ', url: '/administration.html' },
      { key: 'teachers', label: 'শিক্ষকবৃন্দ', url: '/teachers.html' },
      { key: 'staff', label: 'কর্মকর্তা ও কর্মচারী', url: '/staff.html' }
    ]
  },
  {
    key: 'academics',
    label: 'একাডেমিক',
    match: ['academic', 'departments', 'routines', 'results'],
    children: [
      { key: 'academic', label: 'শিক্ষা কার্যক্রম', url: '/academic.html' },
      { key: 'departments', label: 'বিভাগসমূহ', url: '/departments.html' },
      { key: 'hifz', label: 'হিফজ বিভাগ ↗', url: 'https://hifjacademy.com/', external: true },
      { key: 'routines', label: 'ক্লাস ও পরীক্ষা রুটিন', url: '/routines.html' },
      { key: 'results', label: 'পরীক্ষার ফলাফল', url: '/results.html' }
    ]
  },
  { key: 'admission', label: 'ভর্তি', url: '/admission.html' },
  { key: 'notices', label: 'নোটিশ', url: '/notices.html', match: ['notices', 'notice-details'] },
  { key: 'downloads', label: 'ডাউনলোড', url: '/downloads.html' },
  { key: 'gallery', label: 'গ্যালারি', url: '/gallery.html' },
  { key: 'contact', label: 'যোগাযোগ', url: '/contact.html' }
];

export function isNavActive(item, activePage) {
  return item.key === activePage || (item.match || []).includes(activePage);
}
