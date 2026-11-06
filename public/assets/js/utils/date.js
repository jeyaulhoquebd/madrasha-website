/**
 * Bengali Date & Number Utilities
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রী) মাদ্রাসা
 */

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const bengaliMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

/**
 * Converts English digits (0-9) to Bengali numerals (০-৯)
 * @param {string|number} input 
 * @returns {string}
 */
export function toBengaliNumber(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, digit => bengaliDigits[Number(digit)]);
}

/**
 * Formats a Date or Timestamp into standard Bengali format
 * e.g. "০৫ নভেম্বর ২০২৬"
 * @param {Date|string|number|object} dateInput 
 * @param {boolean} includeTime 
 * @returns {string}
 */
export function formatBengaliDate(dateInput, includeTime = false) {
  if (!dateInput) return 'তারিখ অনুপলব্ধ';

  let d;
  if (dateInput?.toDate && typeof dateInput.toDate === 'function') {
    d = dateInput.toDate();
  } else if (dateInput?.seconds) {
    d = new Date(dateInput.seconds * 1000);
  } else {
    d = new Date(dateInput);
  }

  if (isNaN(d.getTime())) return 'অকার্যকর তারিখ';

  const day = toBengaliNumber(String(d.getDate()).padStart(2, '0'));
  const month = bengaliMonths[d.getMonth()];
  const year = toBengaliNumber(d.getFullYear());

  let formatted = `${day} ${month}, ${year}`;

  if (includeTime) {
    let hours = d.getHours();
    const minutes = toBengaliNumber(String(d.getMinutes()).padStart(2, '0'));
    const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
    hours = hours % 12 || 12;
    formatted += ` (${ampm} ${toBengaliNumber(hours)}:${minutes})`;
  }

  return formatted;
}
