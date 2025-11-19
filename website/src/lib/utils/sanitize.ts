/**
 * Input Sanitization Utilities
 * Prevent XSS, SQL injection, and other attacks
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Strips all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, '') // Remove dangerous characters
    .trim();
}

/**
 * Sanitize email address
 * Ensures valid email format and removes potential exploits
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, ''); // Only allow alphanumeric, @, ., -
}

/**
 * Sanitize text input
 * Removes control characters and excessive whitespace
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Sanitize filename
 * Ensures safe filename without path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow safe characters
    .replace(/\.{2,}/g, '.') // Prevent path traversal (..)
    .substring(0, 255); // Limit length
}

/**
 * Validate and sanitize URL
 * Ensures URL is safe and uses allowed protocols
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Escape special characters for SQL-like strings
 * NOTE: This is a backup - ALWAYS use parameterized queries
 */
export function escapeSql(input: string): string {
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/"/g, '\\"'); // Escape double quotes
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+\-() ]/g, '').trim();
}

/**
 * Remove null bytes (common in injection attacks)
 */
export function removeNullBytes(input: string): string {
  return input.replace(/\0/g, '');
}

/**
 * Comprehensive sanitization for form inputs
 * Combines multiple sanitization methods
 */
export function sanitizeFormInput(input: string, type: 'text' | 'email' | 'html' = 'text'): string {
  let sanitized = removeNullBytes(input);

  switch (type) {
    case 'email':
      sanitized = sanitizeEmail(sanitized);
      break;
    case 'html':
      sanitized = sanitizeHtml(sanitized);
      break;
    case 'text':
    default:
      sanitized = sanitizeText(sanitized);
      break;
  }

  return sanitized;
}

/**
 * Check if input contains potential SQL injection patterns
 * Returns true if suspicious content detected
 */
export function detectSqlInjection(input: string): boolean {
  const suspiciousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b)/i,
    /(-{2}|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check if input contains potential XSS patterns
 * Returns true if suspicious content detected
 */
export function detectXss(input: string): boolean {
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /eval\s*\(/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Validate input safety before processing
 * Throws error if dangerous content detected
 */
export function validateInputSafety(input: string, fieldName: string): void {
  if (detectSqlInjection(input)) {
    throw new Error(`Suspicious content detected in ${fieldName}`);
  }

  if (detectXss(input)) {
    throw new Error(`Potentially unsafe content detected in ${fieldName}`);
  }
}
