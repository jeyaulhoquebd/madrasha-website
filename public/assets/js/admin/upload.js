/**
 * Optional Cloudinary uploads for the admin panel
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 *
 * Configure in Admin → Settings: Cloudinary "cloud name" and an UNSIGNED
 * upload preset. Without them, admins simply paste file/image links.
 */

import { db, doc, getDoc } from '../firebase/config.js';

let cached;

export async function getUploadConfig() {
  if (cached !== undefined) return cached;
  cached = null;
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    const d = snap.exists() ? snap.data() : {};
    if (d.cloudinaryCloudName && d.cloudinaryUploadPreset) {
      cached = { cloudName: d.cloudinaryCloudName, preset: d.cloudinaryUploadPreset };
    }
  } catch { /* ignore */ }
  return cached;
}

/** Uploads a file and returns its secure URL */
export async function uploadToCloudinary(file, kind, { cloudName, preset }) {
  if (file.size > 10 * 1024 * 1024) throw new Error('ফাইলের আকার ১০ MB-এর বেশি');
  const resource = kind === 'image' ? 'image' : 'auto';
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resource}/upload`, { method: 'POST', body });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || res.statusText);
  return json.secure_url;
}
