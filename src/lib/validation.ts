// UYFSR Strict Validation Utilities (Bangladesh Standards & Formatting)

/**
 * Normalizes a Bangladeshi phone number:
 * Strips whitespace, hyphens, parentheses, and leading +88 or 88 country codes.
 */
export function normalizeBdPhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('+880')) {
    cleaned = '0' + cleaned.slice(4)
  } else if (cleaned.startsWith('880')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('+88')) {
    cleaned = cleaned.slice(3)
  }
  // Keep only digits
  return cleaned.replace(/\D/g, '')
}

/**
 * Validates Bangladeshi mobile phone number:
 * Must be exactly 11 digits and start with 013, 014, 015, 016, 017, 018, or 019.
 */
export function isValidBdPhone(phone: string): {
  valid: boolean
  normalized: string
  error?: string
} {
  const normalized = normalizeBdPhone(phone)

  if (!normalized) {
    return { valid: false, normalized: '', error: 'Mobile number cannot be empty.' }
  }

  if (normalized.length < 11) {
    const missing = 11 - normalized.length
    return {
      valid: false,
      normalized,
      error: `Phone number is incomplete. Missing ${missing} digit${missing > 1 ? 's' : ''} (must be 11 digits).`
    }
  }

  if (normalized.length > 11) {
    return {
      valid: false,
      normalized,
      error: `Phone number has too many digits (${normalized.length}). Must be exactly 11 digits.`
    }
  }

  // Regex for valid BD mobile prefixes: 013-019
  const bdPhoneRegex = /^01[3-9]\d{8}$/
  if (!bdPhoneRegex.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: 'Invalid operator prefix. Must start with 013, 014, 015, 016, 017, 018, or 019.'
    }
  }

  return { valid: true, normalized }
}

/**
 * Validates email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates full name (min 2 characters, not just symbols)
 */
export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 2 && /[a-zA-Z\u0980-\u09FF]/.test(trimmed)
}

/**
 * Validates MFS Transaction ID (TrxID) for bKash/Nagad:
 * Must be strictly mandatory, minimum 6 characters (typically 8-10 alphanumeric characters), no spaces.
 */
export function isValidTrxId(trxId: string): {
  valid: boolean
  cleaned: string
  error?: string
} {
  const cleaned = (trxId || '').trim().toUpperCase()
  if (!cleaned) {
    return {
      valid: false,
      cleaned: '',
      error: 'Transaction ID (TrxID) is required.'
    }
  }
  if (cleaned.length < 6) {
    return {
      valid: false,
      cleaned,
      error: 'Transaction ID (TrxID) must be 6 to 12 alphanumeric characters (e.g. BL72KX91PA).'
    }
  }
  if (!/^[A-Z0-9]+$/.test(cleaned)) {
    return {
      valid: false,
      cleaned,
      error: 'Transaction ID (TrxID) must contain uppercase letters and numbers only.'
    }
  }
  return { valid: true, cleaned }
}
