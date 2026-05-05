/**
 * Format a price (e.g., 134000.00) as Iranian Toman with thousands separators, no .00
 * @param {number|string} price
 * @returns {string} e.g., "134,000 تومان"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '۰ تومان';
  
  // Convert to number
  let num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '۰ تومان';
  
  // If the value ends with .00 (or is very close to an integer), show as integer
  if (Math.abs(num - Math.round(num)) < 0.01) {
    num = Math.round(num);
  }
  
  const formattedNumber = num.toLocaleString('fa-IR'); // Persian digits, thousands separators
  return `${formattedNumber} تومان`;
};

/**
 * Generic number formatting (no currency)
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '۰';
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '۰';
  if (Math.abs(number - Math.round(number)) < 0.01) {
    return Math.round(number).toLocaleString('fa-IR');
  }
  return number.toLocaleString('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};