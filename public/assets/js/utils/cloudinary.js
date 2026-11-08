/**
 * Cloudinary Media Helper
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 * Handles media optimization and secure asset delivery
 */

export const cloudinaryConfig = {
  cloudName: 'madrasa-media', // Configurable in settings
  uploadPreset: 'madrasa_uploads'
};

/**
 * Generates an optimized Cloudinary URL
 * @param {string} publicIdOrUrl 
 * @param {object} options 
 * @returns {string}
 */
export function getOptimizedImageUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return '';

  // If already a full URL
  if (publicIdOrUrl.startsWith('http')) {
    return publicIdOrUrl;
  }

  const {
    width = 'auto',
    height = '',
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  const transforms = [
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    crop ? `c_${crop}` : '',
    `q_${quality}`,
    `f_${format}`
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transforms}/${publicIdOrUrl}`;
}

/**
 * Generates a direct document download URL
 * @param {string} publicIdOrUrl 
 * @returns {string}
 */
export function getDocumentDownloadUrl(publicIdOrUrl) {
  if (!publicIdOrUrl) return '#';
  if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl;
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/fl_attachment/${publicIdOrUrl}`;
}
