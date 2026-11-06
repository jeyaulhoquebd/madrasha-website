/**
 * Departments Page Controller
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Loads official verified educational departments as interactive cards
 */

import { db, collection, getDocs, query, orderBy } from '../firebase/config.js';
import { OFFICIAL_HERO_IMAGE_URL, OFFICIAL_LOGO_URL } from './home.js';

export async function initDepartmentsPage() {
  const container = document.getElementById('departments-grid-container');
  if (!container) return;

  let departments = [];

  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'departments'), orderBy('displayOrder', 'asc')));
      snap.forEach(d => departments.push({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[Firestore] Departments load fallback:', e.message);
    }
  }

  // Verified official departments fallback if Firestore is not yet seeded
  if (departments.length === 0) {
    departments = [
      {
        id: 'quran-studies',
        name: 'আল-কুরআন ও ইসলামিক স্টাডিজ বিভাগ',
        category: 'ফাজিল ও আলিম স্তর',
        description: 'পবিত্র কুরআনের বিশুদ্ধ তাফসির, উলূমুল কুরআন ও সমকালীন ইসলামী অনুশাসন অধ্যয়নের অন্যতম প্রধান বিভাগ।',
        subjects: ['তাফসিরুল কুরআন', 'উসূলুত তাফসির', 'উলূমুল কুরআন', 'ইসলামিক স্টাডিজ', 'আকাইদ ও ফিকহ'],
        image: OFFICIAL_HERO_IMAGE_URL,
        admissionInfo: 'দাখিল বা সমমানের পরীক্ষায় উত্তীর্ণ শিক্ষার্থীরা আলিম স্তরে এবং আলিম/এইচএসসি উত্তীর্ণরা ফাজিল স্তরে ভর্তি হতে পারে।'
      },
      {
        id: 'hadith-studies',
        name: 'আল-হাদিস ও ইসলামিক স্টাডিজ বিভাগ',
        category: 'ফাজিল ও আলিম স্তর',
        description: 'সহিহ বুখারি, মুসলিম সহ সিহাহ সিত্তাহ এর বিশুদ্ধ হাদিস সংকলন, সনদ বিশ্লেষণ ও প্রয়োগিক শিক্ষাদান।',
        subjects: ['সহিহ হাদিস সংকলন', 'উসূলুল হাদিস', 'মুসত্বালাহুল হাদিস', 'দাওয়া ও ইরশাদ'],
        image: OFFICIAL_HERO_IMAGE_URL,
        admissionInfo: 'সংশ্লিষ্ট স্তরের ন্যূনতম জিপিএ ও মাদ্রাসা বোর্ডের ভর্তি নির্দেশিকা অনুযায়ী ভর্তি গ্রহণযোগ্য।'
      },
      {
        id: 'arabic-language',
        name: 'আরবি ভাষা ও সাহিত্য বিভাগ',
        category: 'দাখিল, আলিম ও ফাজিল স্তর',
        description: 'আরবি ব্যাকরণ (নাহু-সরফ), বালাগাত-মানতিক ও ব্যবহারিক আরবি কথোপকথন ও সাহিত্য চর্চায় শিক্ষার্থীদের দক্ষ করে তোলার বিভাগ।',
        subjects: ['কাওয়ায়েদুল লুগাতিল আরাবিয়া', 'ইনশা ও তারবিয়াহ', 'বালাগাত ও মানতিক', 'আরবি সাহিত্য'],
        image: OFFICIAL_HERO_IMAGE_URL,
        admissionInfo: 'মাদ্রাসার সকল শিক্ষার্থীর জন্য আবশ্যিক এবং উচ্চতর স্তরে ঐচ্ছিক বিষয় হিসেবে অধ্যয়নের সুযোগ রয়েছে।'
      },
      {
        id: 'general-science',
        name: 'বিজ্ঞান ও তথ্যপ্রযুক্তি বিভাগ',
        category: 'দাখিল ও আলিম স্তর',
        description: 'ইসলামী অনুশাসনের পাশাপাশি পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও আইসিটি এর ব্যবহারিক ল্যাবভিত্তিক আধুনিক বিজ্ঞান শিক্ষা।',
        subjects: ['পদার্থবিজ্ঞান', 'রসায়নবিজ্ঞান', 'জীববিজ্ঞান', 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', 'উচ্চতর গণিত'],
        image: OFFICIAL_HERO_IMAGE_URL,
        admissionInfo: 'দাখিল বিজ্ঞান বিভাগে ভর্তির জন্য ইবতেদায়ী সমাপনী এবং আলিমে দাখিল বিজ্ঞান বিভাগ থেকে উত্তীর্ণ হতে হবে।'
      },
      {
        id: 'humanities-general',
        name: 'সাধারণ ও মানবিক বিভাগ',
        category: 'দাখিল ও আলিম স্তর',
        description: 'কুরআন-হাদিসের পাশাপাশি বাংলা, ইংরেজি, গণিত, সামাজিক বিজ্ঞান ও ইসলামের ইতিহাস সমন্বিত সাধারণ পাঠ্যক্রম।',
        subjects: ['বাংলা সাহিত্য ও ব্যাকরণ', 'ইংরেজি ভাষা ও গ্রামার', 'সাধারণ গণিত', 'ইসলামের ইতিহাস ও সংস্কৃতি'],
        image: OFFICIAL_HERO_IMAGE_URL,
        admissionInfo: 'সকল শিক্ষার্থীর জন্য উন্মুক্ত এবং সরকার নির্ধারিত ভর্তির নিয়মাবলী প্রযোজ্য।'
      }
    ];
  }

  container.innerHTML = `
    <div class="mb-10 text-center max-w-2xl mx-auto space-y-2">
      <span class="text-xs font-bold text-[#0B4619] tracking-wider uppercase">প্রাতিষ্ঠানিক অনুষদ</span>
      <h1 class="text-2xl sm:text-4xl font-extrabold text-[#072e10]">মাদ্রাসার শিক্ষা বিভাগসমূহ</h1>
      <p class="text-xs sm:text-sm text-stone-500">
        বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড ও ইসলামী আরবি বিশ্ববিদ্যালয় অনুমোদিত প্রাতিষ্ঠানিক বিভাগসমূহ
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      ${departments.map(dept => `
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#0B4619] transition duration-300 flex flex-col justify-between group">
          <div>
            <!-- Department Image Header -->
            <div class="relative h-44 overflow-hidden bg-slate-900">
              <img 
                src="${dept.image || OFFICIAL_HERO_IMAGE_URL}" 
                alt="${dept.name}" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-90"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute bottom-3 left-4 right-4">
                <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#d4af37] text-[#072e10] mb-1">
                  ${dept.category || 'অনুমোদিত বিভাগ'}
                </span>
                <h3 class="text-base font-bold text-white leading-snug drop-shadow-xs">
                  ${dept.name}
                </h3>
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-5 sm:p-6 space-y-4">
              <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
                ${dept.description}
              </p>

              <!-- Subjects List -->
              ${dept.subjects && dept.subjects.length > 0 ? `
                <div class="space-y-1.5 pt-2">
                  <h4 class="text-xs font-bold text-[#072e10] flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#0B4619]"></span>
                    <span>প্রধান পাঠ্য বিষয়সমূহ:</span>
                  </h4>
                  <div class="flex flex-wrap gap-1.5">
                    ${dept.subjects.map(s => `
                      <span class="px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-700 font-medium">
                        ${s}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Admission Information -->
              ${dept.admissionInfo ? `
                <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100/80 text-xs text-stone-700 space-y-1">
                  <span class="font-bold text-[#0B4619] block">ভর্তি সংক্রান্ত তথ্য:</span>
                  <p class="leading-relaxed text-stone-600">${dept.admissionInfo}</p>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Bottom Card Action -->
          <div class="px-5 sm:px-6 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
            <a href="/admission.html" class="text-xs font-bold text-[#0B4619] group-hover:text-[#072e10] flex items-center gap-1">
              <span>ভর্তি আবেদন করুন</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
            <span class="text-[11px] text-stone-400 font-medium">নিয়মিত পাঠদান</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
