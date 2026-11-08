/**
 * Cloudinary: image uploads + optimised delivery
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Uses an UNSIGNED upload preset, which is designed to be used directly from
 * the browser (the cloud name and preset name are not secrets; no API secret
 * is ever placed in this code).
 *
 * Policy: only IMAGES (and PDF documents for notices/downloads) are uploaded.
 * Videos are never uploaded — add a YouTube or Facebook link instead.
 */

export const CLOUDINARY = {
  cloudName: 'ouertwph',
  uploadPreset: 'kbsjafm1182026'
};

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
const MAX_IMAGE_SIDE = 2000;      // px, larger photos are resized in the browser first
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const isCloudinaryUrl = (url) =>
  typeof url === 'string' && url.startsWith(`https://res.cloudinary.com/${CLOUDINARY.cloudName}/`);

/** Shrinks big photos before upload (saves time and Cloudinary quota). */
async function shrinkImage(file, maxSide = MAX_IMAGE_SIDE) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.85));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Uploads a file to Cloudinary and returns its https URL.
 * @param {File|Blob} file
 * @param {{kind?: 'image'|'document', folder?: string, maxSide?: number}} [opts]
 */
export async function uploadToCloudinary(file, { kind = 'image', folder = 'website', maxSide } = {}) {
  if (!file) throw new Error('কোনো ফাইল নির্বাচন করা হয়নি');
  if (file.type?.startsWith('video/')) {
    throw new Error('ভিডিও আপলোড বন্ধ আছে। ভিডিওর জন্য YouTube বা Facebook লিংক দিন।');
  }
  const isImage = IMAGE_TYPES.includes(file.type);
  const isPdf = file.type === 'application/pdf';
  if (kind === 'image' && !isImage) throw new Error('শুধু ছবি (JPG, PNG, WEBP) আপলোড করা যাবে');
  if (kind === 'document' && !isImage && !isPdf) throw new Error('শুধু ছবি বা PDF আপলোড করা যাবে');

  const upload = isImage ? await shrinkImage(file, maxSide) : file;
  if (upload.size > MAX_UPLOAD_BYTES) throw new Error('ফাইলের আকার ১০ MB-এর বেশি');

  const body = new FormData();
  body.append('file', upload);
  body.append('upload_preset', CLOUDINARY.uploadPreset);
  body.append('folder', `madrasa/${folder}`);

  const resource = isImage ? 'image' : 'auto';
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/${resource}/upload`, { method: 'POST', body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.secure_url) throw new Error(json?.error?.message || 'Cloudinary-তে আপলোড ব্যর্থ হয়েছে');
  return json.secure_url;
}

/**
 * Returns a resized, auto-format/quality version of a Cloudinary image URL.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function cdnImage(url, { width = 800, height, crop = 'limit' } = {}) {
  if (!isCloudinaryUrl(url) || !url.includes('/image/upload/')) return url;
  const t = ['f_auto', 'q_auto', `c_${crop}`, width && `w_${width}`, height && `h_${height}`].filter(Boolean).join(',');
  return url.replace('/image/upload/', `/image/upload/${t}/`);
}

/** Opens a file picker and resolves with the chosen file (or null). */
export function pickFile(accept = 'image/*', multiple = false) {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = () => resolve(multiple ? [...(input.files || [])] : input.files?.[0] || null);
    input.click();
  });
}
