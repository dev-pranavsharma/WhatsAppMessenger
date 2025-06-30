/**
 * Validate email format
 * @param {unknown} value - Value to validate
 * @returns {string} Valid email string
 * @throws {Error} If email format is invalid
 */
export function isEmail(value) {
  if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("❌ Invalid email format");
  }
  return value;
}

/**
 * Validate phone number format
 * @param {unknown} value - Value to validate
 * @returns {string} Valid phone number string
 * @throws {Error} If phone number format is invalid
 */
export function isPhoneNumber(value) {
  if (typeof value !== 'string' || !/^\d{7,15}$/.test(value)) {
    throw new Error("❌ Invalid phone number format");
  }
  return value;
}