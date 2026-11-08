/**
 * Client-side image helpers
 * Resizes a photo in the browser and returns a small JPEG data URL, so an
 * applicant photo can be stored directly inside the Firestore document
 * (no separate file storage service is needed).
 */

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('ছবিটি পড়া যায়নি')); };
    img.src = url;
  });
}

/**
 * @param {File} file
 * @param {{maxWidth?:number,maxHeight?:number,maxBytes?:number}} [opts]
 * @returns {Promise<string>} data:image/jpeg;base64,...
 */
export async function photoToDataUrl(file, { maxWidth = 360, maxHeight = 450, maxBytes = 180000 } = {}) {
  if (!file || !file.type.startsWith('image/')) throw new Error('শুধু ছবি (JPG/PNG) নির্বাচন করুন');
  if (file.size > 15 * 1024 * 1024) throw new Error('ছবির আকার ১৫ MB-এর কম হতে হবে');

  const img = await loadImage(file);
  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (let q = 0.82; q >= 0.4; q -= 0.08) {
    const data = canvas.toDataURL('image/jpeg', q);
    if (data.length <= maxBytes) return data;
  }
  throw new Error('ছবিটি অনেক বড়, অন্য একটি ছবি দিন');
}
