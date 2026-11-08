/**
 * Admin collection definitions (one per admin page)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Field names match what the public pages read, so anything saved here
 * appears on the website immediately.
 */

import { esc } from '../utils/escape.js';
import { toBengaliNumber } from '../utils/date.js';
import { fmt } from './crud.js';
import { parseVideo } from '../utils/video.js';

const join = (...parts) => parts.filter(Boolean).join(' · ');
const today = () => new Date();

const DISPLAY_ORDER = { name: 'displayOrder', label: 'ক্রম (ছোট সংখ্যা আগে দেখাবে)', type: 'number', default: 0 };

export const COLLECTIONS = {
  notices: {
    collection: 'notices',
    title: 'নোটিশ',
    subtitle: 'নোটিশ প্রকাশ, সম্পাদনা ও মুছে ফেলা। "প্রকাশিত" চিহ্নিত নোটিশই শুধু ওয়েবসাইটে দেখা যাবে।',
    itemLabel: 'নোটিশ',
    sortField: 'publishedAt',
    searchFields: ['title', 'category', 'content'],
    fields: [
      { name: 'title', label: 'শিরোনাম', required: true, full: true, maxlength: 200 },
      { name: 'category', label: 'ক্যাটাগরি', type: 'select', required: true, default: 'সাধারণ', options: [
        { value: 'সাধারণ', label: 'সাধারণ' }, { value: 'পরীক্ষা', label: 'পরীক্ষা' },
        { value: 'ভর্তি', label: 'ভর্তি' }, { value: 'ছুটি', label: 'ছুটি' }
      ] },
      { name: 'publishedAt', label: 'প্রকাশের তারিখ', type: 'date', required: true, default: today() },
      { name: 'memoNo', label: 'স্মারক নম্বর', maxlength: 100 },
      { name: 'summary', label: 'সংক্ষিপ্ত বিবরণ', full: true, maxlength: 300 },
      { name: 'content', label: 'বিস্তারিত', type: 'textarea', rows: 8 },
      { name: 'fileUrl', label: 'সংযুক্ত ফাইল (PDF) লিংক', type: 'url', upload: 'raw', full: true },
      { name: 'isPublished', label: 'ওয়েবসাইটে প্রকাশ করুন', type: 'checkbox', default: true }
    ],
    primary: n => esc(n.title),
    secondary: n => join(fmt.status(n.isPublished), esc(n.category), fmt.date(n.publishedAt))
  },

  teachers: {
    collection: 'teachers',
    title: 'শিক্ষকবৃন্দ',
    subtitle: 'শিক্ষকদের প্রোফাইল। ছবির লিংক না দিলে মাদ্রাসার লোগো দেখাবে।',
    itemLabel: 'শিক্ষক',
    sortField: 'displayOrder',
    sortDir: 'asc',
    thumbField: 'photoUrl',
    searchFields: ['name', 'designation', 'subject', 'department'],
    fields: [
      { name: 'name', label: 'নাম', required: true, maxlength: 100 },
      { name: 'designation', label: 'পদবি', required: true, maxlength: 100, placeholder: 'যেমন: সহকারী অধ্যাপক' },
      { name: 'department', label: 'বিভাগ', type: 'select', options: [
        { value: 'কুরআন ও হাদিস', label: 'কুরআন ও হাদিস' }, { value: 'আরবি ভাষা', label: 'আরবি ভাষা' },
        { value: 'বিজ্ঞান', label: 'বিজ্ঞান' }, { value: 'সাধারণ', label: 'সাধারণ' }
      ] },
      { name: 'subject', label: 'পাঠদানের বিষয়', maxlength: 150 },
      { name: 'qualifications', label: 'শিক্ষাগত যোগ্যতা', full: true, maxlength: 200 },
      { name: 'email', label: 'ইমেইল (ওয়েবসাইটে দেখাবে)', type: 'email', maxlength: 120 },
      { name: 'joiningDate', label: 'যোগদানের তারিখ', type: 'date' },
      { name: 'experience', label: 'অভিজ্ঞতা', maxlength: 60, placeholder: 'যেমন: ১৫ বছর' },
      DISPLAY_ORDER,
      { name: 'bio', label: 'সংক্ষিপ্ত পরিচিতি (ওয়েবসাইটে দেখাবে)', type: 'textarea', rows: 3 },
      { name: 'phone', label: 'মোবাইল (শুধু অফিসের রেকর্ড)', maxlength: 20, help: 'শিক্ষক তালিকা সবার জন্য খোলা — ব্যক্তিগত নম্বর দিতে না চাইলে খালি রাখুন' },
      { name: 'photoUrl', label: 'ছবি', type: 'url', upload: 'image', full: true }
    ],
    primary: t => esc(t.name),
    secondary: t => join(esc(t.designation), esc(t.department), `ক্রম ${toBengaliNumber(t.displayOrder ?? 0)}`)
  },

  staff: {
    collection: 'staff',
    title: 'কর্মকর্তা ও কর্মচারী',
    subtitle: 'অফিস ও সহায়ক কর্মচারীদের তালিকা।',
    itemLabel: 'কর্মচারী',
    sortField: 'displayOrder',
    sortDir: 'asc',
    thumbField: 'photoUrl',
    searchFields: ['name', 'designation', 'section'],
    fields: [
      { name: 'name', label: 'নাম', required: true, maxlength: 100 },
      { name: 'designation', label: 'পদবি', required: true, maxlength: 100 },
      { name: 'section', label: 'শাখা', maxlength: 100, placeholder: 'যেমন: হিসাব শাখা' },
      DISPLAY_ORDER,
      { name: 'photoUrl', label: 'ছবির লিংক', type: 'url', upload: 'image', full: true }
    ],
    primary: s => esc(s.name),
    secondary: s => join(esc(s.designation), esc(s.section))
  },

  administration: {
    collection: 'administration',
    title: 'পরিচালনা পর্ষদ ও প্রশাসন',
    subtitle: 'গভর্নিং বডি, প্রাতিষ্ঠানিক নেতৃত্ব ও প্রশাসনিক কর্মকর্তা। অধ্যক্ষের বাণী সেটিংস পাতা থেকে দিন।',
    itemLabel: 'সদস্য',
    sortField: 'displayOrder',
    sortDir: 'asc',
    thumbField: 'photoUrl',
    fields: [
      { name: 'name', label: 'নাম', required: true, maxlength: 100 },
      { name: 'designation', label: 'পদবি', required: true, maxlength: 100, placeholder: 'যেমন: সভাপতি' },
      { name: 'category', label: 'ধরন', type: 'select', required: true, default: 'governing', options: [
        { value: 'governing', label: 'গভর্নিং বডি' }, { value: 'leadership', label: 'প্রাতিষ্ঠানিক নেতৃত্ব' },
        { value: 'office', label: 'প্রশাসনিক কর্মকর্তা' }
      ] },
      DISPLAY_ORDER,
      { name: 'description', label: 'সংক্ষিপ্ত পরিচিতি', type: 'textarea', rows: 3 },
      { name: 'photoUrl', label: 'ছবির লিংক', type: 'url', upload: 'image', full: true }
    ],
    primary: m => esc(m.name),
    secondary: m => join(esc(m.designation), { governing: 'গভর্নিং বডি', leadership: 'নেতৃত্ব', office: 'প্রশাসন' }[m.category] || '')
  },

  departments: {
    collection: 'departments',
    title: 'বিভাগ ও শাখা',
    subtitle: 'এখানে কিছু যোগ করলে ওয়েবসাইটের ডিফল্ট বিভাগ তালিকার বদলে এই তালিকা দেখাবে।',
    itemLabel: 'বিভাগ',
    sortField: 'displayOrder',
    sortDir: 'asc',
    fields: [
      { name: 'name', label: 'বিভাগের নাম', required: true, maxlength: 120 },
      { name: 'category', label: 'স্তর', maxlength: 100, placeholder: 'যেমন: দাখিল ও আলিম' },
      { name: 'description', label: 'বিবরণ', type: 'textarea', rows: 3 },
      { name: 'subjects', label: 'প্রধান বিষয়সমূহ', type: 'list' },
      { name: 'admissionInfo', label: 'ভর্তি সংক্রান্ত তথ্য', full: true, maxlength: 300 },
      DISPLAY_ORDER
    ],
    primary: d => esc(d.name),
    secondary: d => esc(d.category || '')
  },

  results: {
    collection: 'results',
    title: 'পরীক্ষার ফলাফল',
    subtitle: 'সার্বিক ফলাফলের PDF প্রকাশ করুন। শিক্ষার্থীর ব্যক্তিগত তথ্য এখানে রাখবেন না।',
    itemLabel: 'ফলাফল',
    sortField: 'publishedAt',
    searchFields: ['title', 'examType', 'year'],
    fields: [
      { name: 'title', label: 'শিরোনাম', required: true, full: true, maxlength: 200 },
      { name: 'examType', label: 'পরীক্ষা', type: 'select', required: true, default: 'বার্ষিক', options: [
        { value: 'দাখিল', label: 'দাখিল' }, { value: 'আলিম', label: 'আলিম' }, { value: 'ফাজিল', label: 'ফাজিল' },
        { value: 'বার্ষিক', label: 'বার্ষিক' }, { value: 'অর্ধবার্ষিক', label: 'অর্ধবার্ষিক' }
      ] },
      { name: 'year', label: 'শিক্ষাবর্ষ', required: true, maxlength: 10, placeholder: String(new Date().getFullYear()) },
      { name: 'publishedAt', label: 'প্রকাশের তারিখ', type: 'date', required: true, default: today() },
      { name: 'remarks', label: 'মন্তব্য', maxlength: 300 },
      { name: 'fileUrl', label: 'ফলাফল ফাইল (PDF) লিংক', type: 'url', upload: 'raw', full: true },
      { name: 'isPublished', label: 'ওয়েবসাইটে প্রকাশ করুন', type: 'checkbox', default: true }
    ],
    primary: r => esc(r.title),
    secondary: r => join(fmt.status(r.isPublished), esc(r.examType), esc(r.year))
  },

  routines: {
    collection: 'routines',
    title: 'ক্লাস ও পরীক্ষার রুটিন',
    itemLabel: 'রুটিন',
    subtitle: 'রুটিনের PDF বা ছবির লিংক যুক্ত করুন।',
    fields: [
      { name: 'title', label: 'শিরোনাম', required: true, full: true, maxlength: 200 },
      { name: 'type', label: 'ধরন', type: 'select', required: true, default: 'class', options: [
        { value: 'class', label: 'ক্লাস রুটিন' }, { value: 'exam', label: 'পরীক্ষার রুটিন' }
      ] },
      { name: 'className', label: 'শ্রেণি / বিভাগ', maxlength: 100 },
      { name: 'session', label: 'সেশন', maxlength: 50 },
      { name: 'effectiveDate', label: 'কার্যকর তারিখ', type: 'date' },
      { name: 'fileUrl', label: 'রুটিন ফাইল লিংক', type: 'url', upload: 'raw', full: true }
    ],
    primary: r => esc(r.title),
    secondary: r => join(r.type === 'exam' ? 'পরীক্ষা' : 'ক্লাস', esc(r.className))
  },

  downloads: {
    collection: 'downloads',
    title: 'ডাউনলোড ফাইল',
    subtitle: 'ভর্তি ফরম, সিলেবাস ও অন্যান্য ফাইল।',
    itemLabel: 'ফাইল',
    fields: [
      { name: 'title', label: 'শিরোনাম', required: true, full: true, maxlength: 200 },
      { name: 'category', label: 'ক্যাটাগরি', type: 'select', required: true, default: 'admission', options: [
        { value: 'admission', label: 'ভর্তি ফরম' }, { value: 'syllabus', label: 'সিলেবাস' },
        { value: 'academic', label: 'একাডেমিক' }, { value: 'exam', label: 'পরীক্ষা' }, { value: 'other', label: 'অন্যান্য' }
      ] },
      { name: 'fileSize', label: 'ফাইলের ধরন/আকার', maxlength: 30, placeholder: 'যেমন: PDF, 250 KB' },
      { name: 'description', label: 'বিবরণ', full: true, maxlength: 300 },
      { name: 'fileUrl', label: 'ফাইলের লিংক', type: 'url', upload: 'raw', required: true, full: true }
    ],
    primary: f => esc(f.title),
    secondary: f => join(esc(f.category), fmt.date(f.createdAt))
  },

  gallery: {
    collection: 'gallery',
    title: 'গ্যালারি',
    subtitle: 'ছবি সরাসরি আপলোড করুন (Cloudinary-তে সংরক্ষিত হবে)। ভিডিও আপলোড বন্ধ — ভিডিওর জন্য YouTube বা Facebook লিংক দিন।',
    itemLabel: 'আইটেম',
    thumbField: 'imageUrl',
    bulkUpload: (file, url) => ({
      title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').slice(0, 150),
      type: 'image',
      category: 'campus',
      imageUrl: url,
      description: ''
    }),
    fields: [
      { name: 'type', label: 'ধরন', type: 'select', required: true, default: 'image', options: [
        { value: 'image', label: 'ছবি' }, { value: 'video', label: 'ভিডিও (YouTube / Facebook লিংক)' }
      ] },
      { name: 'category', label: 'ক্যাটাগরি', type: 'select', default: 'campus', options: [
        { value: 'campus', label: 'ক্যাম্পাস' }, { value: 'events', label: 'অনুষ্ঠান' }, { value: 'sports', label: 'ক্রীড়া ও সাংস্কৃতিক' }
      ] },
      { name: 'title', label: 'শিরোনাম', required: true, full: true, maxlength: 150 },
      { name: 'imageUrl', label: 'ছবি', type: 'url', upload: 'image', full: true, help: 'ছবির জন্য "ছবি আপলোড" চাপুন। ভিডিওর ক্ষেত্রে এটি ঐচ্ছিক — খালি রাখলে ভিডিওর নিজের প্রিভিউ দেখাবে।' },
      { name: 'videoUrl', label: 'ভিডিও লিংক বা এম্বেড কোড', type: 'textarea', rows: 3, full: true,
        placeholder: 'YouTube/Facebook লিংক, অথবা Facebook-এর "Embed" থেকে কপি করা <iframe ...> কোড এখানে পেস্ট করুন',
        help: 'Facebook রিল/ভিডিও লিংক, Facebook-এর এম্বেড লিংক বা পুরো iframe কোড, অথবা YouTube লিংক — যেকোনোটি দিলেই চলবে। ওয়েবসাইটে ভিডিওটি কার্ডের ভেতরেই চলবে। চাইলে উপরে নিজের পছন্দের প্রিভিউ ছবি দিতে পারেন (ঐচ্ছিক)।' },
      { name: 'description', label: 'বিবরণ', full: true, maxlength: 300 }
    ],
    beforeSave: d => {
      if (d.type === 'video') {
        const video = parseVideo(d.videoUrl);
        if (!video) throw new Error('ভিডিওর জন্য সঠিক YouTube বা Facebook লিংক / এম্বেড কোড দিন');
        d.videoUrl = video.url;          // clean, canonical link
        d.videoProvider = video.provider;
        d.vertical = video.vertical;     // reels / shorts play in a tall frame
        if (!d.imageUrl && video.thumbnail) d.imageUrl = video.thumbnail;
        d.thumbnailUrl = d.imageUrl || '';
      } else if (!d.imageUrl) {
        throw new Error('ছবি আপলোড করুন অথবা ছবির লিংক দিন');
      }
      return d;
    },
    primary: g => esc(g.title),
    secondary: g => join(g.type === 'video' ? `${parseVideo(g.videoUrl)?.provider === 'facebook' ? 'Facebook' : 'YouTube'} ভিডিও${g.vertical ? ' (রিল)' : ''}` : 'ছবি', esc({ campus: 'ক্যাম্পাস', events: 'অনুষ্ঠান', sports: 'ক্রীড়া' }[g.category] || g.category))
  },

  calendar: {
    collection: 'calendar',
    title: 'একাডেমিক ক্যালেন্ডার',
    subtitle: 'শিক্ষা কার্যক্রম পাতার ক্যালেন্ডার টেবিল। তারিখ অনুযায়ী সাজানো হয়।',
    itemLabel: 'কার্যক্রম',
    sortField: 'date',
    sortDir: 'asc',
    fields: [
      { name: 'title', label: 'কার্যক্রম', required: true, full: true, maxlength: 150 },
      { name: 'date', label: 'তারিখ (সাজানোর জন্য)', type: 'date', required: true },
      { name: 'period', label: 'সময়কাল (যেমন দেখাবে)', maxlength: 80, placeholder: 'যেমন: ১০ – ২০ জুন' },
      { name: 'description', label: 'বিবরণ', full: true, maxlength: 300 }
    ],
    primary: c => esc(c.title),
    secondary: c => join(esc(c.period), fmt.date(c.date))
  },

  admissions: {
    collection: 'admissions',
    title: 'ভর্তি আবেদন',
    subtitle: 'ওয়েবসাইট থেকে জমা হওয়া আবেদন। সম্পাদনা বাটনে পূর্ণ তথ্য ও অবস্থা পরিবর্তন, "প্রিন্ট" বাটনে আবেদনপত্র।',
    itemLabel: 'আবেদন',
    allowCreate: false,
    thumbField: 'photo',
    rowLink: a => `/admin/application.html?id=${encodeURIComponent(a.id)}`,
    rowLinkLabel: 'প্রিন্ট',
    searchFields: ['studentName', 'studentNameEn', 'phone', 'fatherPhone', 'classApplied', 'fatherName', 'birthRegNo'],
    fields: [
      { name: 'status', label: 'আবেদনের অবস্থা', type: 'select', required: true, options: [
        { value: 'pending', label: 'অপেক্ষমান' }, { value: 'contacted', label: 'যোগাযোগ করা হয়েছে' },
        { value: 'approved', label: 'ভর্তি সম্পন্ন' }, { value: 'rejected', label: 'বাতিল' }
      ] },
      { name: 'adminNote', label: 'অফিস নোট (শুধু এডমিন দেখবেন)', maxlength: 500 },
      { name: 'photo', label: 'শিক্ষার্থীর ছবি', type: 'photo' },
      { type: 'heading', label: 'ভর্তির তথ্য' },
      { name: 'classApplied', label: 'শ্রেণি', maxlength: 60 },
      { name: 'session', label: 'শিক্ষাবর্ষ', maxlength: 10 },
      { type: 'heading', label: 'শিক্ষার্থী' },
      { name: 'studentName', label: 'নাম (বাংলা)', required: true, maxlength: 100 },
      { name: 'studentNameEn', label: 'নাম (ইংরেজি)', maxlength: 100 },
      { name: 'dateOfBirth', label: 'জন্ম তারিখ', maxlength: 20 },
      { name: 'gender', label: 'লিঙ্গ', maxlength: 10 },
      { name: 'birthRegNo', label: 'জন্ম নিবন্ধন নম্বর', maxlength: 20 },
      { name: 'nid', label: 'NID নম্বর', maxlength: 20 },
      { name: 'bloodGroup', label: 'রক্তের গ্রুপ', maxlength: 10 },
      { type: 'heading', label: 'পিতা-মাতা ও অভিভাবক' },
      { name: 'fatherName', label: 'পিতার নাম', maxlength: 100 },
      { name: 'fatherPhone', label: 'পিতার মোবাইল', maxlength: 20 },
      { name: 'fatherNid', label: 'পিতার NID', maxlength: 20 },
      { name: 'fatherOccupation', label: 'পিতার পেশা', maxlength: 60 },
      { name: 'motherName', label: 'মাতার নাম', maxlength: 100 },
      { name: 'motherPhone', label: 'মাতার মোবাইল', maxlength: 20 },
      { name: 'motherNid', label: 'মাতার NID', maxlength: 20 },
      { name: 'guardianName', label: 'অভিভাবক', maxlength: 100 },
      { name: 'guardianRelation', label: 'সম্পর্ক', maxlength: 40 },
      { name: 'guardianPhone', label: 'অভিভাবকের মোবাইল', maxlength: 20 },
      { type: 'heading', label: 'ঠিকানা' },
      { name: 'presentAddress', label: 'বর্তমান ঠিকানা', type: 'textarea', rows: 2 },
      { name: 'permanentAddress', label: 'স্থায়ী ঠিকানা', type: 'textarea', rows: 2 },
      { type: 'heading', label: 'পূর্ববর্তী শিক্ষা' },
      { name: 'previousSchool', label: 'প্রতিষ্ঠান', full: true, maxlength: 150 },
      { name: 'previousClass', label: 'সর্বশেষ শ্রেণি/পরীক্ষা', maxlength: 60 },
      { name: 'previousResult', label: 'ফলাফল', maxlength: 30 },
      { name: 'prevExamRoll', label: 'রোল', maxlength: 20 },
      { name: 'prevExamReg', label: 'রেজিস্ট্রেশন', maxlength: 20 },
      { name: 'prevExamYear', label: 'পাসের সাল', maxlength: 4 },
      { name: 'prevBoard', label: 'বোর্ড', maxlength: 60 },
      { name: 'notes', label: 'আবেদনকারীর অতিরিক্ত তথ্য', type: 'textarea', rows: 2 }
    ],
    primary: a => `${esc(a.studentName)}${a.studentNameEn ? ` <span class="font-normal text-stone-400">(${esc(a.studentNameEn)})</span>` : ''}`,
    secondary: a => join(
      { pending: '<span class="text-amber-700">● অপেক্ষমান</span>', contacted: '<span class="text-sky-700">● যোগাযোগ হয়েছে</span>', approved: '<span class="text-brand-700">● ভর্তি সম্পন্ন</span>', rejected: '<span class="text-rose-700">● বাতিল</span>' }[a.status] || '',
      esc(a.classApplied), esc(a.fatherPhone || a.phone), fmt.date(a.createdAt)
    )
  },


  students: {
    collection: 'students',
    title: 'শিক্ষার্থী',
    subtitle: 'শিক্ষার্থীর আইডি কার্ড নম্বরই এখানে আইডি। অভিভাবক এই আইডি দিয়ে নিবন্ধন করলে অনুমোদনের পর শুধু নিজের সন্তানের তথ্য ও ফলাফল দেখতে পারবেন। "ফলাফল" বাটনে পরীক্ষার নম্বর যুক্ত করুন।',
    itemLabel: 'শিক্ষার্থী',
    idField: 'studentId',
    sortField: 'studentId',
    sortDir: 'asc',
    thumbField: 'photoUrl',
    rowLink: st => `/admin/student-results.html?id=${encodeURIComponent(st.id)}`,
    rowLinkLabel: 'ফলাফল',
    searchFields: ['studentId', 'name', 'nameEn', 'className', 'roll', 'fatherName'],
    fields: [
      { name: 'studentId', label: 'শিক্ষার্থীর আইডি (আইডি কার্ড নম্বর)', required: true, lockOnEdit: true, maxlength: 40, placeholder: 'যেমন: 2026-0123' },
      { name: 'status', label: 'অবস্থা', type: 'select', required: true, default: 'active', options: [
        { value: 'active', label: 'অধ্যয়নরত' }, { value: 'passed', label: 'উত্তীর্ণ / বিদায়ী' }, { value: 'left', label: 'প্রতিষ্ঠান ত্যাগ' }
      ] },
      { name: 'name', label: 'নাম (বাংলা)', required: true, maxlength: 100 },
      { name: 'nameEn', label: 'নাম (ইংরেজি)', maxlength: 100 },
      { name: 'className', label: 'শ্রেণি', required: true, maxlength: 60, placeholder: 'যেমন: ষষ্ঠ শ্রেণি' },
      { name: 'section', label: 'শাখা', maxlength: 30 },
      { name: 'roll', label: 'রোল', maxlength: 10 },
      { name: 'session', label: 'শিক্ষাবর্ষ', maxlength: 10 },
      { name: 'dateOfBirth', label: 'জন্ম তারিখ', maxlength: 20 },
      { name: 'bloodGroup', label: 'রক্তের গ্রুপ', maxlength: 10 },
      { name: 'fatherName', label: 'পিতার নাম', maxlength: 100 },
      { name: 'motherName', label: 'মাতার নাম', maxlength: 100 },
      { name: 'guardianPhone', label: 'অভিভাবকের মোবাইল', maxlength: 20 },
      { name: 'address', label: 'ঠিকানা', maxlength: 300 },
      { name: 'photoUrl', label: 'ছবির লিংক', type: 'url', upload: 'image', full: true },
      { name: 'remarks', label: 'মন্তব্য (অভিভাবক দেখতে পাবেন)', type: 'textarea', rows: 2 }
    ],
    primary: st => `${esc(st.name)} <span class="font-normal text-stone-400">· ${esc(st.id)}</span>`,
    secondary: st => join(esc(st.className), st.section ? `শাখা ${esc(st.section)}` : '', st.roll ? `রোল ${esc(st.roll)}` : '')
  },

  guardians: {
    collection: 'guardians',
    title: 'অভিভাবক অ্যাকাউন্ট',
    subtitle: 'ওয়েবসাইটে নিবন্ধিত অভিভাবক। শিক্ষার্থীর আইডি মিলিয়ে "অনুমোদিত" করলে তিনি লগইন করে শুধু নিজের সন্তানের তথ্য দেখতে পারবেন।',
    itemLabel: 'অভিভাবক',
    allowCreate: false,
    searchFields: ['name', 'email', 'phone', 'requestedStudentId'],
    fields: [
      { name: 'status', label: 'অবস্থা', type: 'select', required: true, options: [
        { value: 'pending', label: 'অপেক্ষমান' }, { value: 'approved', label: 'অনুমোদিত' }, { value: 'rejected', label: 'বাতিল' }
      ] },
      { name: 'requestedStudentId', label: 'অভিভাবকের দেওয়া শিক্ষার্থী আইডি', lockOnEdit: true, maxlength: 40 },
      { name: 'studentIds', label: 'যে শিক্ষার্থীদের তথ্য দেখতে পারবেন (আইডি)', type: 'list', help: 'খালি রেখে অনুমোদন দিলে অভিভাবকের দেওয়া আইডিটি স্বয়ংক্রিয়ভাবে যুক্ত হবে' },
      { name: 'name', label: 'নাম', maxlength: 100 },
      { name: 'relation', label: 'সম্পর্ক', maxlength: 30 },
      { name: 'phone', label: 'মোবাইল', maxlength: 20 },
      { name: 'email', label: 'ইমেইল', lockOnEdit: true, maxlength: 120 }
    ],
    beforeSave: d => {
      if (d.status === 'approved' && (!d.studentIds || !d.studentIds.length) && d.requestedStudentId) {
        d.studentIds = [d.requestedStudentId];
      }
      return d;
    },
    primary: g => `${g.status === 'pending' ? '<span class="mr-1 inline-block h-2 w-2 rounded-full bg-gold-500"></span>' : ''}${esc(g.name)} <span class="font-normal text-stone-400">(${esc(g.relation || 'অভিভাবক')})</span>`,
    secondary: g => join(
      { pending: '<span class="text-amber-700">অপেক্ষমান</span>', approved: '<span class="text-brand-700">অনুমোদিত</span>', rejected: '<span class="text-rose-700">বাতিল</span>' }[g.status] || '',
      `আইডি: ${esc((g.studentIds && g.studentIds.length ? g.studentIds : [g.requestedStudentId]).join(', '))}`,
      esc(g.phone), esc(g.email)
    )
  },

  messages: {
    collection: 'messages',
    title: 'বার্তা',
    subtitle: 'যোগাযোগ পাতা থেকে আসা বার্তা।',
    itemLabel: 'বার্তা',
    allowCreate: false,
    searchFields: ['name', 'phone', 'subject', 'message'],
    fields: [
      { name: 'handled', label: 'উত্তর দেওয়া হয়েছে', type: 'checkbox' },
      { name: 'name', label: 'নাম', maxlength: 100 },
      { name: 'phone', label: 'মোবাইল', maxlength: 20 },
      { name: 'email', label: 'ইমেইল', type: 'email', maxlength: 120 },
      { name: 'subject', label: 'বিষয়', maxlength: 60 },
      { name: 'message', label: 'বার্তা', type: 'textarea', rows: 6 }
    ],
    primary: m => `${m.handled ? '' : '<span class="mr-1 inline-block h-2 w-2 rounded-full bg-gold-500"></span>'}${esc(m.name)} — ${esc(m.subject || '')}`,
    secondary: m => join(esc(m.phone), fmt.date(m.createdAt), esc(String(m.message || '').slice(0, 80)))
  }
};

/** Exam results of one student (sub-collection students/{id}/results) */
export function studentResultsConfig(studentId, studentName = '') {
  return {
    collection: `students/${studentId}/results`,
    title: `পরীক্ষার ফলাফল — ${esc(studentName || studentId)}`,
    subtitle: `শিক্ষার্থী আইডি: ${esc(studentId)}। "অভিভাবককে দেখান" চিহ্নিত ফলাফল অভিভাবক তাঁর অ্যাকাউন্টে দেখতে পাবেন।`,
    itemLabel: 'ফলাফল',
    sortField: 'publishedAt',
    searchFields: ['examName', 'year'],
    fields: [
      { name: 'examName', label: 'পরীক্ষা', type: 'select', required: true, default: 'বার্ষিক পরীক্ষা', options: [
        'প্রথম সাময়িক পরীক্ষা', 'অর্ধবার্ষিক পরীক্ষা', 'দ্বিতীয় সাময়িক পরীক্ষা', 'বার্ষিক পরীক্ষা',
        'প্রাক-নির্বাচনী পরীক্ষা', 'নির্বাচনী পরীক্ষা', 'মাসিক পরীক্ষা', 'বোর্ড পরীক্ষা'
      ].map(v => ({ value: v, label: v })) },
      { name: 'year', label: 'শিক্ষাবর্ষ', required: true, maxlength: 10, default: String(new Date().getFullYear()) },
      { name: 'className', label: 'শ্রেণি', maxlength: 60 },
      { name: 'publishedAt', label: 'প্রকাশের তারিখ', type: 'date', default: new Date() },
      { name: 'subjects', label: 'বিষয়ভিত্তিক নম্বর', type: 'rows', rows: 10,
        placeholder: 'কুরআন মাজিদ | 100 | 85 | A+\nআরবি ১ম পত্র | 100 | 78 | A\nবাংলা | 100 | 72 | A',
        columns: [
          { key: 'subject', label: 'বিষয়' },
          { key: 'fullMarks', label: 'পূর্ণমান', number: true },
          { key: 'obtained', label: 'প্রাপ্ত নম্বর', number: true },
          { key: 'grade', label: 'গ্রেড' }
        ] },
      { name: 'totalMarks', label: 'মোট প্রাপ্ত নম্বর', type: 'number', help: 'খালি রাখলে বিষয়গুলো যোগ করে বসবে' },
      { name: 'gpa', label: 'জিপিএ', maxlength: 10 },
      { name: 'grade', label: 'সামগ্রিক গ্রেড', maxlength: 10 },
      { name: 'position', label: 'মেধাক্রম', maxlength: 10 },
      { name: 'attendance', label: 'উপস্থিতি', maxlength: 30, placeholder: 'যেমন: ১৮০/২০০ দিন' },
      { name: 'remarks', label: 'শিক্ষকের মন্তব্য', type: 'textarea', rows: 2 },
      { name: 'isPublished', label: 'অভিভাবককে দেখান', type: 'checkbox', default: true }
    ],
    beforeSave: d => {
      if (!d.totalMarks && Array.isArray(d.subjects)) {
        d.totalMarks = d.subjects.reduce((sum, r) => sum + (Number(r.obtained) || 0), 0);
      }
      return d;
    },
    primary: r => `${esc(r.examName)} ${esc(r.year)}`,
    secondary: r => join(fmt.status(r.isPublished), `মোট ${toBengaliNumber(r.totalMarks ?? 0)}`, r.gpa ? `জিপিএ ${esc(r.gpa)}` : '', r.position ? `মেধাক্রম ${esc(r.position)}` : '')
  };
}
