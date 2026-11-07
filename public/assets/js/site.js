/**
 * Verified institutional constants (single source of truth)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 *
 * Only verified facts belong here. Contact details (phone / email / social
 * links) are intentionally NOT hard-coded: they are loaded from Firestore
 * (settings/general) and are simply hidden until an administrator adds them.
 */

export const SITE = {
  name: 'খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা',
  shortName: 'বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল মাদ্রাসা',
  englishName: 'Khagrachhari Baitush Sharaf Jabbaria Adarsha Fazil (Degree) Madrasah',
  eiin: '১৩১৩২৫',
  established: '১৯৯৮',
  level: 'ফাজিল (ডিগ্রী)',
  address: 'জেল রোড, খাগড়াছড়ি সদর, খাগড়াছড়ি পার্বত্য জেলা',
  logoUrl: 'https://res.cloudinary.com/edsn06rr/image/upload/v1793898297/images.jpg',
  heroUrl: 'https://res.cloudinary.com/edsn06rr/image/upload/v1793898407/a1a9d6b9-0f63-4ca4-bb47-8a8fc27dd326.png',
  bismillah: 'بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيْمِ'
};

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
