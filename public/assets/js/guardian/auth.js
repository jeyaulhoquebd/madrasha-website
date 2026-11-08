/**
 * Guardian portal: sign up, login, password reset
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Flow: guardian signs up (email + password + student ID, Turnstile check)
 *   → guardians/{uid} is created with status "pending"
 *   → an admin verifies and approves it in Admin → অভিভাবক
 *   → the guardian can then log in and see only their own child's data
 *     (enforced by firestore.rules, not just by this page).
 */

import {
  auth, db, doc, getDoc, setDoc, serverTimestamp,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut
} from '../firebase/config.js';
import { showAlert } from '../components/alert.js';
import { mountTurnstile, verifyHuman } from '../components/turnstile.js';

const BN = '০১২৩৪৫৬৭৮৯';
const toEn = s => String(s || '').replace(/[০-৯]/g, d => BN.indexOf(d));

const AUTH_ERRORS = {
  'auth/invalid-credential': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
  'auth/wrong-password': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
  'auth/user-not-found': 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
  'auth/email-already-in-use': 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। লগইন করুন।',
  'auth/invalid-email': 'সঠিক ইমেইল ঠিকানা দিন।',
  'auth/weak-password': 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
  'auth/too-many-requests': 'অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
  'auth/network-request-failed': 'ইন্টারনেট সংযোগ পরীক্ষা করুন।',
  'auth/operation-not-allowed': 'Firebase-এ Email/Password সাইন-ইন চালু করা নেই।'
};
const authMessage = e => AUTH_ERRORS[e?.code] || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।';

const STATUS_MESSAGES = {
  pending: 'আপনার অ্যাকাউন্টটি এখনো মাদ্রাসা কর্তৃপক্ষের অনুমোদনের অপেক্ষায় আছে। অনুমোদনের পর লগইন করতে পারবেন।',
  rejected: 'আপনার অ্যাকাউন্টটি অনুমোদন পায়নি। বিস্তারিত জানতে মাদ্রাসা অফিসে যোগাযোগ করুন।',
  missing: 'এই অ্যাকাউন্টটি অভিভাবক হিসেবে নিবন্ধিত নয়। প্রথমে "নিবন্ধন" করুন।'
};

function notice(message, type = 'info') {
  const el = document.getElementById('guardian-notice');
  el.className = `mb-5 rounded-lg px-4 py-3 text-sm ${type === 'success' ? 'bg-brand-50 text-brand-800' : type === 'error' ? 'bg-rose-50 text-rose-800' : 'bg-gold-100/70 text-stone-700'}`;
  el.textContent = message;
}

function busy(btn, on, label) {
  btn.disabled = on;
  if (label) btn.textContent = label;
}

export function initGuardianAuth() {
  if (!auth) {
    notice('অনলাইন সেবা এই মুহূর্তে চালু নেই। পরে আবার চেষ্টা করুন।', 'error');
    document.querySelectorAll('form button[type="submit"]').forEach(b => { b.disabled = true; });
    return;
  }

  // Tabs
  const tabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('[data-panel]');
  const show = (name) => {
    tabs.forEach(t => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', String(on));
      t.className = `flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${on ? 'bg-brand-700 text-white' : 'text-stone-600 hover:text-brand-700'}`;
    });
    panels.forEach(p => { p.hidden = p.dataset.panel !== name; });
  };
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));
  show(location.hash === '#signup' ? 'signup' : 'login');

  const loginCaptcha = mountTurnstile(document.getElementById('login-turnstile'), { action: 'guardian-login' });
  const signupCaptcha = mountTurnstile(document.getElementById('signup-turnstile'), { action: 'guardian-signup' });

  // ---------- Login ----------
  const loginForm = document.getElementById('guardian-login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!loginForm.reportValidity()) return;
    const btn = loginForm.querySelector('button[type="submit"]');
    busy(btn, true, 'যাচাই করা হচ্ছে...');

    const human = await verifyHuman(loginCaptcha.getToken());
    if (!human.ok) {
      showAlert({ type: 'error', message: human.message });
      loginCaptcha.reset();
      return busy(btn, false, 'লগইন');
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, loginForm.email.value.trim(), loginForm.password.value);
      const snap = await getDoc(doc(db, 'guardians', user.uid));
      const status = snap.exists() ? snap.data().status : 'missing';
      if (status !== 'approved') {
        await signOut(auth);
        notice(STATUS_MESSAGES[status] || STATUS_MESSAGES.missing, status === 'rejected' || status === 'missing' ? 'error' : 'info');
        loginCaptcha.reset();
        return busy(btn, false, 'লগইন');
      }
      window.location.replace('/guardian/');
    } catch (err) {
      showAlert({ type: 'error', message: authMessage(err) });
      loginCaptcha.reset();
      busy(btn, false, 'লগইন');
    }
  });

  // ---------- Forgot password ----------
  document.getElementById('forgot-password')?.addEventListener('click', async () => {
    const email = loginForm.email.value.trim();
    if (!email) return showAlert({ type: 'warning', message: 'প্রথমে ইমেইল ঠিকানা লিখুন।' });
    try {
      await sendPasswordResetEmail(auth, email);
      notice('পাসওয়ার্ড পরিবর্তনের লিংক আপনার ইমেইলে পাঠানো হয়েছে (স্প্যাম ফোল্ডারও দেখুন)।', 'success');
    } catch (err) {
      showAlert({ type: 'error', message: authMessage(err) });
    }
  });

  // ---------- Sign up ----------
  const signupForm = document.getElementById('guardian-signup-form');
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!signupForm.reportValidity()) return;
    const f = signupForm;
    const phone = toEn(f.phone.value).replace(/[\s-]/g, '').replace(/^\+?88/, '');
    if (!/^01[3-9]\d{8}$/.test(phone)) return showAlert({ type: 'error', message: 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।' });
    if (f.password.value.length < 8) return showAlert({ type: 'error', message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।' });
    if (f.password.value !== f.password2.value) return showAlert({ type: 'error', message: 'দুটি পাসওয়ার্ড মেলেনি।' });

    const btn = f.querySelector('button[type="submit"]');
    busy(btn, true, 'যাচাই করা হচ্ছে...');
    const human = await verifyHuman(signupCaptcha.getToken());
    if (!human.ok) {
      showAlert({ type: 'error', message: human.message });
      signupCaptcha.reset();
      return busy(btn, false, 'নিবন্ধন করুন');
    }

    try {
      const email = f.email.value.trim().toLowerCase();
      const { user } = await createUserWithEmailAndPassword(auth, email, f.password.value);
      await setDoc(doc(db, 'guardians', user.uid), {
        name: f.name.value.trim(),
        relation: f.relation.value,
        phone,
        email,
        requestedStudentId: toEn(f.studentId.value).trim(),
        studentName: f.studentName.value.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      await signOut(auth);
      f.reset();
      show('login');
      notice('নিবন্ধন সম্পন্ন হয়েছে। মাদ্রাসা কর্তৃপক্ষ তথ্য যাচাই করে অনুমোদন দিলে আপনি লগইন করতে পারবেন।', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showAlert({ type: 'error', message: authMessage(err) });
      signupCaptcha.reset();
    } finally {
      busy(btn, false, 'নিবন্ধন করুন');
    }
  });
}
