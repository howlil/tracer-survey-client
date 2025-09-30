import { hashPIN } from '@/utils/encryption'

// Database PIN yang terenkripsi (dalam production, ini harus disimpan di database server)
export interface PINRecord {
  pin: string
  hashedPIN: string
  userID: string
  name: string
  email: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

// Daftar PIN yang valid (dalam production, ini harus disimpan di database)
const VALID_PINS = ['123456', 'ABC123', 'DEMO01', 'TEST99']

// Generate database PIN
export const generatePINDatabase = (): PINRecord[] => {
  return VALID_PINS.map((pin) => ({
    pin,
    hashedPIN: hashPIN(pin),
    userID: `user_${hashPIN(pin).substring(0, 16)}`,
    name: `User ${pin}`,
    email: `user${pin.toLowerCase()}@example.com`,
    isActive: true,
    createdAt: new Date().toISOString(),
  }))
}

// Database PIN
export const pinDatabase: PINRecord[] = generatePINDatabase()

/**
 * Validasi PIN dan return user data
 */
export const validatePINAndGetUser = (inputPIN: string): PINRecord | null => {
  try {
    // Cari PIN yang cocok
    const pinRecord = pinDatabase.find(record => 
      record.isActive && validatePIN(inputPIN, record.hashedPIN)
    )
    
    if (pinRecord) {
      // Update last login
      pinRecord.lastLogin = new Date().toISOString()
      return pinRecord
    } else {
      return null
    }
  } catch {
    return null
  }
}

/**
 * Validasi PIN sederhana (untuk fallback)
 */
const validatePIN = (inputPIN: string, storedHash: string): boolean => {
  const inputHash = hashPIN(inputPIN)
  return inputHash === storedHash
}

/**
 * Get user by user ID
 */
export const getUserByID = (userID: string): PINRecord | null => {
  try {
    const user = pinDatabase.find(record => record.userID === userID)
    return user || null
  } catch  {
    return null
  }
}

/**
 * Get all active users
 */
export const getAllActiveUsers = (): PINRecord[] => {
  return pinDatabase.filter(record => record.isActive)
}

/**
 * Deactivate user
 */
export const deactivateUser = (userID: string): boolean => {
  try {
    const user = pinDatabase.find(record => record.userID === userID)
    if (user) {
      user.isActive = false
      return true
    }
    return false
  } catch {
    return false
  }
}
