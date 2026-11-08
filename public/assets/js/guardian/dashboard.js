/**
 * Guardian dashboard: shows only the students linked to the signed-in,
 * approved guardian (guardians/{uid}.studentIds), with their exam results.
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 */

import {
  auth, db, doc, getDoc, getDocs, collection, query, where, onAuthStateChanged, signOut, sendPasswordResetEmail
} from '../firebase/config.js';
import { esc, safeUrl } from '../utils/escape.js';
import { formatBengaliDate, toBengaliNumber, sortByDateDesc } from '../utils/date.js';
import { SITE } from '../site.js';
import { cdnImage } from '../utils/cloudinary.js';

const n = v => (v === undefined || v === null || v === '' ? '—' : esc(typeof v === 'number' ? toBengaliNumber(v) : v));

function studentCard(st) {
  const info = [
    ['শিক্ষার্থী আইডি', st.id], ['শ্রেণি', st.className], ['শাখা', st.section], ['রোল', st.roll],
    ['শিক্ষাবর্ষ', st.session], ['জন্ম তারিখ', st.dateOfBirth], ['রক্তের গ্রুপ', st.bloodGroup],
    ['পিতার নাম', st.fatherName], ['মাতার নাম', st.motherName]
  ].filter(([, v]) => v);

  return `
    <section class="card overflow-hidden">
      <div class="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
        <img src="${safeUrl(cdnImage(st.photoUrl, { width: 320 }), SITE.logoUrl)}" alt="${esc(st.name)}" class="h-36 w-28 flex-shrink-0 rounded-lg border border-stone-200 object-cover" />
        <div class="min-w-0 flex-1">
          <span class="eyebrow">শিক্ষার্থীর তথ্য</span>
          <h2 class="mt-2 text-2xl font-bold text-brand-900">${esc(st.name)}</h2>
          ${st.nameEn ? `<p class="text-sm text-stone-500">${esc(st.nameEn)}</p>` : ''}
          <dl class="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            ${info.map(([k, v]) => `<div class="flex justify-between gap-4 border-b border-stone-100 py-1.5"><dt class="text-stone-500">${k}</dt><dd class="text-right font-medium text-stone-800">${esc(v)}</dd></div>`).join('')}
          </dl>
          ${st.remarks ? `<p class="mt-4 rounded-lg bg-gold-100/60 px-4 py-3 text-sm text-stone-700">${esc(st.remarks)}</p>` : ''}
        </div>
      </div>
      <div id="results-${esc(st.id)}" class="border-t border-stone-100 bg-stone-50/50 p-6 sm:p-8">
        <p class="text-sm text-stone-400">ফলাফল লোড হচ্ছে...</p>
      </div>
    </section>
  `;
}

function resultCard(r) {
  const rows = Array.isArray(r.subjects) ? r.subjects : [];
  const totalFull = rows.reduce((s, x) => s + (Number(x.fullMarks) || 0), 0);
  return `
    <article class="card overflow-hidden">
      <header class="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-100 px-5 py-4">
        <h4 class="font-semibold text-brand-900">${esc(r.examName)} ${esc(r.year)}</h4>
        <span class="text-xs text-stone-500">${r.publishedAt ? formatBengaliDate(r.publishedAt) : ''}</span>
      </header>
      ${rows.length ? `
        <div class="overflow-x-auto">
          <table class="w-full min-w-[420px] text-sm">
            <thead class="bg-stone-50 text-xs text-stone-500">
              <tr><th class="px-5 py-2 text-left font-medium">বিষয়</th><th class="px-3 py-2 text-right font-medium">পূর্ণমান</th><th class="px-3 py-2 text-right font-medium">প্রাপ্ত নম্বর</th><th class="px-5 py-2 text-right font-medium">গ্রেড</th></tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              ${rows.map(x => `<tr><td class="px-5 py-2 text-stone-800">${esc(x.subject)}</td><td class="px-3 py-2 text-right text-stone-500">${n(x.fullMarks)}</td><td class="px-3 py-2 text-right font-semibold text-stone-900">${n(x.obtained)}</td><td class="px-5 py-2 text-right text-brand-700">${n(x.grade)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}
      <dl class="grid grid-cols-2 gap-px border-t border-stone-100 bg-stone-100 text-center sm:grid-cols-4">
        <div class="bg-white px-3 py-3"><dt class="text-xs text-stone-500">মোট নম্বর</dt><dd class="mt-1 font-bold text-brand-900">${n(r.totalMarks)}${totalFull ? `<span class="text-xs font-normal text-stone-400"> / ${toBengaliNumber(totalFull)}</span>` : ''}</dd></div>
        <div class="bg-white px-3 py-3"><dt class="text-xs text-stone-500">জিপিএ</dt><dd class="mt-1 font-bold text-brand-900">${n(r.gpa)}</dd></div>
        <div class="bg-white px-3 py-3"><dt class="text-xs text-stone-500">গ্রেড</dt><dd class="mt-1 font-bold text-brand-900">${n(r.grade)}</dd></div>
        <div class="bg-white px-3 py-3"><dt class="text-xs text-stone-500">মেধাক্রম</dt><dd class="mt-1 font-bold text-brand-900">${n(r.position)}</dd></div>
      </dl>
      ${r.attendance || r.remarks ? `<div class="space-y-1 border-t border-stone-100 px-5 py-3 text-sm text-stone-600">
        ${r.attendance ? `<p><span class="text-stone-400">উপস্থিতি:</span> ${esc(r.attendance)}</p>` : ''}
        ${r.remarks ? `<p><span class="text-stone-400">শিক্ষকের মন্তব্য:</span> ${esc(r.remarks)}</p>` : ''}
      </div>` : ''}
    </article>
  `;
}

async function loadResults(studentId) {
  const slot = document.getElementById(`results-${studentId}`);
  try {
    const snap = await getDocs(query(collection(db, `students/${studentId}/results`), where('isPublished', '==', true)));
    const results = sortByDateDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'publishedAt');
    slot.innerHTML = `
      <h3 class="mb-4 text-lg font-semibold text-brand-900">পরীক্ষার ফলাফল</h3>
      ${results.length ? `<div class="space-y-5">${results.map(resultCard).join('')}</div>`
        : '<p class="text-sm text-stone-500">এখনো কোনো ফলাফল প্রকাশ করা হয়নি।</p>'}`;
  } catch (e) {
    slot.innerHTML = `<p class="text-sm text-rose-700">ফলাফল লোড করা যায়নি।</p>`;
  }
}

export function initGuardianDashboard() {
  const root = document.getElementById('guardian-root');
  const toLogin = () => window.location.replace('/guardian/login.html');
  if (!auth) return toLogin();

  onAuthStateChanged(auth, async (user) => {
    if (!user) return toLogin();

    let guardian;
    try {
      const snap = await getDoc(doc(db, 'guardians', user.uid));
      guardian = snap.exists() ? snap.data() : null;
    } catch { guardian = null; }

    if (!guardian || guardian.status !== 'approved') {
      await signOut(auth);
      return toLogin();
    }

    const ids = Array.isArray(guardian.studentIds) ? guardian.studentIds : [];
    const students = [];
    for (const id of ids) {
      try {
        const s = await getDoc(doc(db, 'students', id));
        if (s.exists()) students.push({ id: s.id, ...s.data() });
      } catch { /* not permitted or missing */ }
    }

    root.innerHTML = `
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="eyebrow">অভিভাবক কর্নার</span>
          <h1 class="mt-2 text-3xl font-bold text-brand-900">আসসালামু আলাইকুম, ${esc(guardian.name)}</h1>
          <p class="mt-1 text-sm text-stone-500">${esc(user.email)}</p>
        </div>
        <div class="no-print flex gap-2">
          <button type="button" onclick="window.print()" class="btn btn-outline">প্রিন্ট</button>
          <button type="button" id="guardian-reset-pw" class="btn btn-outline">পাসওয়ার্ড পরিবর্তন</button>
          <button type="button" id="guardian-logout" class="btn btn-outline text-rose-700">লগআউট</button>
        </div>
      </div>
      ${students.length
        ? `<div class="space-y-8">${students.map(studentCard).join('')}</div>`
        : `<div class="card p-8 text-center text-sm text-stone-600">আপনার অ্যাকাউন্টের সাথে এখনো কোনো শিক্ষার্থীর তথ্য যুক্ত করা হয়নি। মাদ্রাসা অফিসে (${SITE.phone}) যোগাযোগ করুন।</div>`}
    `;
    document.getElementById('guardian-reset-pw').addEventListener('click', async (e) => {
      e.target.disabled = true;
      try {
        await sendPasswordResetEmail(auth, user.email);
        e.target.textContent = 'ইমেইলে লিংক পাঠানো হয়েছে';
      } catch {
        e.target.disabled = false;
      }
    });
    document.getElementById('guardian-logout').addEventListener('click', async () => {
      await signOut(auth);
      toLogin();
    });
    document.body.classList.remove('invisible');
    students.forEach(st => loadResults(st.id));
  });
}
