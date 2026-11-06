/**
 * Firebase Modular Web SDK (Pinned v10.14.1)
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 * Clean ES Modules, Zero Compat SDK
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Configuration: loaded dynamically or from environment
export const firebaseConfig = {
  apiKey: "AIzaSyMadrasaPlaceholderKey-OfficialWeb",
  authDomain: "khagrachhari-baitush-sharaf.firebaseapp.com",
  projectId: "khagrachhari-baitush-sharaf",
  storageBucket: "khagrachhari-baitush-sharaf.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let appInstance = null;
let authInstance = null;
let dbInstance = null;

try {
  appInstance = initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance);
} catch (error) {
  console.warn('Firebase initialization in standby mode until production credentials are provided:', error.message);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
};
