# খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
**অফিসিয়াল ওয়েব পোর্টাল ও প্রশাসনিক ব্যবস্থা**

## 📖 পরিচিতি
এই প্রকল্পটি খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসার (EIIN: ১৩১৮১০, স্থাপিত: ১৯৯১) জন্য তৈরি একটি আধুনিক, নির্ভরযোগ্য এবং নিরাপদ প্রাতিষ্ঠানিক ওয়েব পোর্টাল।

---

## 🛠️ প্রযুক্তি স্ট্যাক (Technology Stack)
- **ফ্রন্টএন্ড:** Semantic HTML5, Tailwind CSS, Vanilla JavaScript (Browser-Native ES Modules).
  *(কোনো React, Next.js, Vue, Angular, Bootstrap, jQuery বা TypeScript ব্যবহার করা হয়নি)*
- **স্টাইলিং ও সিএসএস:** Tailwind CSS CLI (উৎপাদনমুখী CSS: `public/assets/css/output.css`)
- **ব্যাকএন্ড ও ক্লাউড ডেটাবেজ:** Firebase Cloud Firestore (মডুলার Web SDK v10.14.1)
- **প্রশাসনিক নিরাপত্তা ও অথেন্টিকেশন:** Firebase Authentication ও কঠোর Firebase Security Rules
- **মিডিয়া ও ডকুমেন্ট স্টোরেজ:** Cloudinary
- **ফন্ট:** Hind Siliguri এবং Noto Sans Bengali

---

## 📂 ফাইল ও ডিরেক্টরি কাঠামো (Directory Structure)

```text
/
├── public/                     # পাবলিক ওয়েব ও ফায়ারবেস হোস্টিং রুট
│   ├── index.html              # মূলপাতা (হোমপেজ)
│   ├── about.html              # পরিচিতি ও ইতিহাস
│   ├── administration.html     # প্রশাসন ও পরিচালনা পর্ষদ
│   ├── academic.html           # শিক্ষা কার্যক্রম
│   ├── departments.html        # বিভাগসমূহ
│   ├── teachers.html           # সম্মানিত শিক্ষক মণ্ডলী
│   ├── staff.html              # কর্মকর্তা ও কর্মচারীবৃন্দ
│   ├── admission.html          # ভর্তি নির্দেশিকা ও তথ্য
│   ├── notices.html            # নোটিশ বোর্ড
│   ├── notice-details.html     # একক নোটিশ বিবরণ
│   ├── results.html            # পরীক্ষার ফলাফল
│   ├── routines.html           # ক্লাস ও পরীক্ষা রুটিন
│   ├── downloads.html          # ফরম ও সিলেবাস ডাউনলোড
│   ├── gallery.html            # ফটো ও ভিডিও গ্যালারি
│   ├── contact.html            # যোগাযোগ ও গুগল ম্যাপ
│   │
│   ├── admin/                  # প্রশাসনিক নিয়ন্ত্রণ পোর্টাল
│   │   ├── login.html          # এডমিন লগইন
│   │   ├── index.html          # এডমিন ড্যাশবোর্ড ওভারভিউ
│   │   ├── notices.html        # নোটিশ প্রকাশ ও ব্যবস্থাপনা
│   │   ├── teachers.html       # শিক্ষক তথ্য ব্যবস্থাপনা
│   │   ├── staff.html          # কর্মচারী ব্যবস্থাপনা
│   │   ├── departments.html    # বিভাগীয় তথ্য ব্যবস্থাপনা
│   │   ├── admissions.html     # অনলাইন ভর্তি আবেদন পর্যালোচনা
│   │   ├── results.html        # পরীক্ষার ফলাফল আপলোড
│   │   ├── routines.html       # রুটিন ব্যবস্থাপনা
│   │   ├── downloads.html      # ডাউনলোড ফাইল ব্যবস্থাপনা
│   │   ├── gallery.html        # গ্যালারি মিডিয়া আপলোড
│   │   └── settings.html       # সাধারণ ও ক্লাউড সেটিংস
│   │
│   └── assets/
│       ├── css/
│       │   └── output.css      # টেইলউইন্ড সিএসএস এর কম্পাইল্ড আউটপুট
│       ├── js/
│       │   ├── firebase/       # ফায়ারবেস মডুলার কনফিগারেশন (v10.14.1)
│       │   ├── components/     # পুনর্ব্যবহারযোগ্য কম্পোনেন্টসমূহ (Header, Nav, Footer, etc.)
│       │   ├── pages/          # পেজ-নির্দিষ্ট লজিক
│       │   ├── admin/          # এডমিন প্যানেল লজিক
│       │   └── utils/          # ইউটিলিটি মডিউল (তারিখ, সংখ্যা, ক্লাউডিনারি)
│       └── images/             # ইমেজ ও ব্র্যান্ড অ্যাসেট
│
├── styles/
│   └── input.css               # টেইলউইন্ড সোর্স সিএসএস
│
├── functions/                  # ফায়ারবেস ক্লাউড ফাংশন (প্রশাসনিক অপারেশন)
│   ├── index.js
│   └── package.json
│
├── firestore.rules             # ফায়ারস্টোর নিরাপত্তা নীতিমালা
├── firestore.indexes.json      # কম্পোজিট কুয়েরি ইনডেক্স
├── firebase.json               # ফায়ারবেস হোস্টিং ও ডেপ্লয়মেন্ট কনফিগারেশন
├── .firebaserc.example         # ফায়ারবেস প্রোজেক্ট এলিয়াস
├── .gitignore
├── package.json
├── README.md
└── PROJECT_STATUS.md           # প্রকল্প স্থিতি ও অগ্রগতি ট্র্যাকার
```

---

## 🎨 ডিজাইন সিস্টেম
মিনিমাল ও পরিচ্ছন্ন ইসলামী থিম — গাঢ় সবুজ (`brand-*`), পরিমিত সোনালি অ্যাকসেন্ট (`gold-*`) ও হালকা আইভরি ব্যাকগ্রাউন্ড।
সকল রং ও কম্পোনেন্ট ক্লাস (`btn`, `card`, `field`, `chip`, `eyebrow` ইত্যাদি) `styles/input.css` ফাইলে সংজ্ঞায়িত।
প্রতিষ্ঠানের যাচাইকৃত তথ্য (নাম, EIIN, স্থাপিত সাল, ঠিকানা, লোগো) এক জায়গায়: `public/assets/js/site.js`।

---

## 💻 স্থানীয়ভাবে চালানোর নিয়ম (How to Run Locally)

```bash
npm install
npm run build:css   # অথবা: npm run watch:css
npm run dev         # http://localhost:3000
```

---

## 🔥 ফায়ারবেস সংযোগ (Firebase Setup)

1. Firebase প্রজেক্ট: **`kbsjafm`** — কনফিগারেশন `public/assets/js/firebase/config.js` ফাইলে যুক্ত করা আছে।
2. Authentication → Settings → **Authorized domains**-এ ওয়েবসাইটের ডোমেইন (যেমন `xxxx.pages.dev`) যোগ করুন, নাহলে এডমিন লগইন কাজ করবে না।
   কনফিগারেশন খালি থাকলে সাইট "স্ট্যান্ডবাই মোডে" চলে — গুগলে কোনো রিকোয়েস্ট যায় না, কনসোলে কোনো এরর আসে না, এবং প্রতিটি পাতায় মার্জিত খালি অবস্থা দেখায়।
3. **Authentication → Email/Password** চালু করে এডমিন ব্যবহারকারী তৈরি করুন।
4. প্রধান এডমিন: UID `8ALeLYl29me8iozWeTVFoe0FIJ63` — এটি `firestore.rules` (`isAdmin()`) এবং
   `public/assets/js/firebase/config.js` (`ADMIN_UIDS`) দুই জায়গাতেই যুক্ত আছে।
   নতুন এডমিন যোগ করতে দুই জায়গায় UID যোগ করুন, অথবা Console থেকে `admins/{UID}` ডকুমেন্ট তৈরি করুন।
   নিরাপত্তার কারণে ওয়েবসাইট থেকে `admins` কালেকশনে লেখা সম্পূর্ণ নিষিদ্ধ।
5. নিয়ম ডেপ্লয় করুন: Firebase Console → Firestore → Rules-এ `firestore.rules` ফাইলের লেখা বসিয়ে Publish করুন (অথবা `firebase deploy --only firestore:rules`)। কোনো কম্পোজিট ইনডেক্সের প্রয়োজন নেই।
6. ব্রাউজারে `আপনার-ডোমেইন/admin` লিখে এডমিন প্যানেলে যান (পাবলিক সাইটে কোথাও এডমিনের লিংক নেই; লগইন ছাড়া এডমিন পাতা দেখা যায় না)। লগইন করে **সেটিংস** পাতায় ফোন, ইমেইল, অধ্যক্ষের বাণী, ভর্তির তথ্য ইত্যাদি দিন।
7. এডমিন প্যানেল থেকে নোটিশ, শিক্ষক, কর্মচারী, পরিচালনা পর্ষদ, বিভাগ, ফলাফল, রুটিন, ক্যালেন্ডার, ডাউনলোড ও গ্যালারি যোগ/সম্পাদনা/মুছে ফেলা যায়; ভর্তি আবেদন ও বার্তা দেখা ও ব্যবস্থাপনা করা যায়।
8. (ঐচ্ছিক) সেটিংস → ফাইল আপলোড-এ Cloudinary cloud name ও unsigned preset দিলে ফর্মে সরাসরি ছবি/PDF আপলোড বাটন আসবে।

### Firestore কালেকশন
| কালেকশন | ব্যবহার |
|---|---|
| `settings/general` | ফোন, ইমেইল, ঠিকানা, অফিস সময়, সোশ্যাল ও ম্যাপ লিংক |
| `settings/muhtamim` | মুহতামিমের নাম, পদবি, ছবি ও বাণী (ডিফল্ট ছবি: `public/assets/images/muhtamim.jpg`) |
| `settings/principal` | অধ্যক্ষের নাম, পদবি, ছবি ও বাণী |
| `settings/about`, `settings/academic`, `settings/admission` | পাতাভিত্তিক লেখা |
| `notices`, `results` | `isPublished: true` হলে জনসাধারণ দেখতে পায় |
| `teachers`, `staff`, `administration`, `departments` | `displayOrder` অনুযায়ী সাজানো |
| `routines`, `downloads`, `gallery`, `calendar` | ফাইল ও মিডিয়া |
| `admissions` | পূর্ণাঙ্গ ভর্তি আবেদন (শিক্ষার্থীর ছবি, জন্ম নিবন্ধন, NID, পিতা-মাতা ও অভিভাবকের তথ্য, ঠিকানা, পূর্ববর্তী শিক্ষা)। ছবি ব্রাউজারেই ছোট করে (~২৫ KB) ডকুমেন্টের ভেতরে রাখা হয়। এডমিন প্যানেল থেকে আবেদনপত্র প্রিন্ট করা যায় |
| `messages` | যোগাযোগ ফর্মের বার্তা |

হিফজ বিভাগ: মেনু, হোমপেজ ও বিভাগ পাতা থেকে https://hifjacademy.com/ ওয়েবসাইটে যায় (`HIFZ_URL`, `site.js`)।

---

## 🛡️ ডেটা সততা ও নীতিমালা (Data Integrity)
- কোনো কাল্পনিক শিক্ষক, ফলাফল, তারিখ বা ফোন নম্বর ব্যবহার করা নিষিদ্ধ। তথ্য না থাকলে সংশ্লিষ্ট অংশ লুকানো থাকে অথবা মার্জিত খালি অবস্থা দেখায়।
- Firestore থেকে আসা সকল লেখা `esc()` / `safeUrl()` (`utils/escape.js`) দিয়ে নিরাপদ করে তবেই পাতায় দেখানো হয়।
