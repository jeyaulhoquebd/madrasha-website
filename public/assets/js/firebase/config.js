/**
 * Firebase Modular Web SDK (Pinned v10.14.1)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * HOW TO CONNECT:
 * Firebase Console → Project settings → Your apps → Web app → copy the config
 * object and paste the values below. Until real values are provided, the site
 * runs in "standby" mode: Firebase is NOT initialised, no network requests are
 * sent to Google, and every page shows its graceful empty state instead of
 * console errors.
 */

export const firebaseConfig = {
  apiKey: 'AIzaSyDsAKi3WN4wcYg6VlqKTezFdZ2MiGXF8nI',
  authDomain: 'kbsjafm.firebaseapp.com',
  databaseURL: 'https://kbsjafm-default-rtdb.firebaseio.com',
  projectId: 'kbsjafm',
  storageBucket: 'kbsjafm.firebasestorage.app',
  messagingSenderId: '1098656776179',
  appId: '1:1098656776179:web:fef7c35e90812b1232dc86',
  measurementId: 'G-YFZSRWPDBX'
};

/**
 * Firebase Authentication UIDs of administrators.
 * Keep in sync with isAdmin() in firestore.rules (the rules are what actually
 * protect the data; this list only controls access to the admin pages).
 */
export const ADMIN_UIDS = ['8ALeLYl29me8iozWeTVFoe0FIJ63'];

/** True only when real credentials have been filled in above. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !/placeholder|your[-_]?/i.test(firebaseConfig.apiKey + firebaseConfig.projectId)
);

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';
const notReady = () => { throw new Error('Firebase is not configured'); };

let appMod = {};
let authMod = {};
let fsMod = {};
let appInstance = null;
let authInstance = null;
let dbInstance = null;

if (isFirebaseConfigured) {
  try {
    // SDK is only downloaded when real credentials exist (no Google requests in standby mode)
    [appMod, authMod, fsMod] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`)
    ]);
    appInstance = appMod.initializeApp(firebaseConfig);
    authInstance = authMod.getAuth(appInstance);
    dbInstance = fsMod.getFirestore(appInstance);
  } catch (error) {
    console.error('[Firebase] Initialisation failed:', error.message);
  }
} else {
  console.info('[Firebase] Standby mode: add project credentials in /assets/js/firebase/config.js');
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

export const onAuthStateChanged = authMod.onAuthStateChanged || ((_a, cb) => { cb(null); return () => {}; });
export const signInWithEmailAndPassword = authMod.signInWithEmailAndPassword || notReady;
export const signOut = authMod.signOut || (async () => {});

export const collection = fsMod.collection || notReady;
export const doc = fsMod.doc || notReady;
export const getDocs = fsMod.getDocs || notReady;
export const getDoc = fsMod.getDoc || notReady;
export const addDoc = fsMod.addDoc || notReady;
export const setDoc = fsMod.setDoc || notReady;
export const updateDoc = fsMod.updateDoc || notReady;
export const deleteDoc = fsMod.deleteDoc || notReady;
export const query = fsMod.query || notReady;
export const where = fsMod.where || notReady;
export const orderBy = fsMod.orderBy || notReady;
export const limit = fsMod.limit || notReady;
export const serverTimestamp = fsMod.serverTimestamp || (() => new Date().toISOString());
export const getCountFromServer = fsMod.getCountFromServer || notReady;

/**
 * Returns true if the signed-in user is an administrator:
 * listed in ADMIN_UIDS, or has a document at admins/{uid}.
 */
export async function isAdminUser(user) {
  if (!user) return false;
  if (ADMIN_UIDS.includes(user.uid)) return true;
  if (!dbInstance) return false;
  try {
    const snap = await fsMod.getDoc(fsMod.doc(dbInstance, 'admins', user.uid));
    return snap.exists();
  } catch {
    return false;
  }
}
