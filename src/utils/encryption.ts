import CryptoJS from 'crypto-js'

// Secret key untuk enkripsi (dalam production, ini harus disimpan di environment variable)
const SECRET_KEY = 'tracer-survey-secret-key-2025'

/**
 * Enkripsi PIN menggunakan AES
 */
export const encryptPIN = (pin: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(pin, SECRET_KEY).toString()
    return encrypted
  } catch (error) {
    return pin // Fallback to original PIN if encryption fails
  }
}

/**
 * Dekripsi PIN menggunakan AES
 */
export const decryptPIN = (encryptedPIN: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedPIN, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (error) {
    return encryptedPIN // Fallback to encrypted PIN if decryption fails
  }
}

/**
 * Generate hash dari PIN untuk validasi
 */
export const hashPIN = (pin: string): string => {
  try {
    const hash = CryptoJS.SHA256(pin + SECRET_KEY).toString()
    return hash
  } catch (error) {
    return pin
  }
}

/**
 * Validasi PIN dengan membandingkan hash
 */
export const validatePIN = (inputPIN: string, storedHash: string): boolean => {
  try {
    const inputHash = hashPIN(inputPIN)
    const isValid = inputHash === storedHash
    return isValid
  } catch (error) {
    return false
  }
}

/**
 * Generate user ID yang aman dari PIN
 */
export const generateSecureUserID = (pin: string): string => {
  try {
    // Hash PIN untuk user ID yang konsisten tapi aman
    const hashedPIN = CryptoJS.SHA256(pin).toString().substring(0, 16)
    const userID = `user_${hashedPIN}`
    return userID
  } catch (error) {
    // Fallback to simple hash
    return `user_${pin}`
  }
}

/**
 * Enkripsi data survey
 */
export const encryptSurveyData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString()
    return encrypted
  } catch (error) {
    return JSON.stringify(data) // Fallback to JSON string
  }
}

/**
 * Dekripsi data survey
 */
export const decryptSurveyData = (encryptedData: string): any => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    const data = JSON.parse(decrypted)
    return data
  } catch (error) {
    try {
      // Fallback to direct JSON parse
      return JSON.parse(encryptedData)
    } catch (fallbackError) {
      return null
    }
  }
}
