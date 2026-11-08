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
      { name: 'email', label: 'ইমেইল', type: 'email', maxlength: 120 },
      DISPLAY_ORDER,
      { name: 'photoUrl', label: 'ছবির লিংক', type: 'url', upload: 'image', full: true }
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
    subtitle: 'ছবি বা ইউটিউব ভিডিও যুক্ত করুন।',
    itemLabel: 'আইটেম',
    thumbField: 'imageUrl',
    fields: [
      { name: 'title', label: 'শিরোনাম', required: true, full: true, maxlength: 150 },
      { name: 'type', label: 'ধরন', type: 'select', required: true, default: 'image', options: [
        { value: 'image', label: 'ছবি' }, { value: 'video', label: 'ভিডিও' }
      ] },
      { name: 'category', label: 'ক্যাটাগরি', type: 'select', default: 'campus', options: [
        { value: 'campus', label: 'ক্যাম্পাস' }, { value: 'events', label: 'অনুষ্ঠান' }, { value: 'sports', label: 'ক্রীড়া ও সাংস্কৃতিক' }
      ] },
      { name: 'imageUrl', label: 'ছবির লিংক (ছবির জন্য)', type: 'url', upload: 'image', full: true },
      { name: 'videoUrl', label: 'ভিডিও লিংক (ইউটিউব)', type: 'url', full: true },
      { name: 'thumbnailUrl', label: 'ভিডিওর থাম্বনেইল লিংক', type: 'url', upload: 'image', full: true },
      { name: 'description', label: 'বিবরণ', full: true, maxlength: 300 }
    ],
    beforeSave: d => {
      // Auto thumbnail for YouTube links
      const yt = /(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/.exec(d.videoUrl || '');
      if (d.type === 'video' && yt && !d.thumbnailUrl) d.thumbnailUrl = `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`;
      if (d.type === 'video' && !d.imageUrl) d.imageUrl = d.thumbnailUrl || '';
      return d;
    },
    primary: g => esc(g.title),
    secondary: g => join(g.type === 'video' ? 'ভিডিও' : 'ছবি', esc(g.category))
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
