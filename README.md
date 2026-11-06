# খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
**অফিসিয়াল ওয়েব পোর্টাল ও প্রশাসনিক ব্যবস্থা**

## 📖 পরিচিতি
এই প্রকল্পটি খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসার (EIIN: ১৩১৩২৫, স্থাপিত: ১৯৯৮) জন্য তৈরি একটি আধুনিক, নির্ভরযোগ্য এবং নিরাপদ প্রাতিষ্ঠানিক ওয়েব পোর্টাল।

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

## 💻 স্থানীয়ভাবে চালানোর নিয়ম (How to Run Locally)

### ১. ডিপেন্ডেন্সি ইন্সটল করুন
```bash
npm install
```

### ২. Tailwind CSS কম্পাইল করুন
এককালীন প্রোডাকশন বিল্ডের জন্য:
```bash
npm run build:css
```
সিএসএস পরিবর্তনের সাথে স্বয়ংক্রিয়ভাবে রিবিল্ড করতে:
```bash
npm run watch:css
```

### ৩. ডেভেলপমেন্ট সার্ভার চালু করুন
লোকাল সার্ভার চালু করতে:
```bash
npm run dev
```
এরপর ব্রাউজারে `http://localhost:3000` এ প্রবেশ করুন।

---

## 🛡️ ডেটা সততা ও নীতিমালা (Data Integrity)
- প্রাতিষ্ঠানিক নির্ভরযোগ্যতা রক্ষায় কোনো কাল্পনিক/অনুমানমূলক শিক্ষক নাম, ফলাফল বা ফোন নম্বর ব্যবহার করা নিষিদ্ধ।
- তথ্য অনুপস্থিত থাকলে মার্জিত খালি অবস্থা (Empty State) প্রদর্শিত হবে।
- প্রশাসনিক পোর্টাল (`/admin/login.html`) থেকে অনুমোদিত কর্মকর্তারা সরাসরি তথ্য হালনাগাদ করতে পারবেন।
