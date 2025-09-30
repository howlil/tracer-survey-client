import { hashPIN, validatePIN } from '@/utils/encryption'

// Database PIN yang terenkripsi (dalam production, ini harus disimpan di database server)
export interface PINRecord {
  pin: string
  hashedPIN: string
  userID: string
  name: string
  email: string
  surveyType: 'tracer-study' | 'user-survey'
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

// Daftar PIN yang valid untuk Tracer Study
const TRACER_STUDY_PINS = ['123456', 'ABC123']

// Daftar PIN yang valid untuk User Survey
const USER_SURVEY_PINS = ['DEMO01', 'TEST99']

// Generate database PIN
export const generatePINDatabase = (): PINRecord[] => {
  const tracerStudyRecords = TRACER_STUDY_PINS.map((pin) => ({
    pin,
    hashedPIN: hashPIN(pin),
    userID: `tracer_${hashPIN(pin).substring(0, 16)}`,
    name: `Tracer User ${pin}`,
    email: `tracer${pin.toLowerCase()}@example.com`,
    surveyType: 'tracer-study' as const,
    isActive: true,
    createdAt: new Date().toISOString(),
  }))

  const userSurveyRecords = USER_SURVEY_PINS.map((pin) => ({
    pin,
    hashedPIN: hashPIN(pin),
    userID: `user_${hashPIN(pin).substring(0, 16)}`,
    name: `User Survey ${pin}`,
    email: `user${pin.toLowerCase()}@example.com`,
    surveyType: 'user-survey' as const,
    isActive: true,
    createdAt: new Date().toISOString(),
  }))

  return [...tracerStudyRecords, ...userSurveyRecords]
}

// Database PIN
export const pinDatabase: PINRecord[] = generatePINDatabase()

/**
 * Validasi PIN dan return user data berdasarkan survey type
 */
export const validatePINAndGetUser = (inputPIN: string, surveyType: 'tracer-study' | 'user-survey'): PINRecord | null => {
  try {
    // Cari PIN yang cocok dengan survey type yang sesuai
    const pinRecord = pinDatabase.find(record => 
      record.isActive && 
      record.surveyType === surveyType &&
      validatePIN(inputPIN, record.hashedPIN)
    )
    
    if (pinRecord) {
      // Update last login
      pinRecord.lastLogin = new Date().toISOString()
      return pinRecord
    } else {
      return null
    }
  } catch (error) {
    console.error('Error in PIN validation:', error)
    return null
  }
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
 * Get users by survey type
 */
export const getUsersBySurveyType = (surveyType: 'tracer-study' | 'user-survey'): PINRecord[] => {
  return pinDatabase.filter(record => record.isActive && record.surveyType === surveyType)
}

/**
 * Get valid PINs for survey type
 */
export const getValidPINsForSurvey = (surveyType: 'tracer-study' | 'user-survey'): string[] => {
  return surveyType === 'tracer-study' ? TRACER_STUDY_PINS : USER_SURVEY_PINS
}

/**
 * Test function untuk debug PIN validation
 */
export const testPINValidation = () => {
  console.log('🧪 Testing PIN Validation...')
  
  // Test tracer study PINs
  console.log('\n📋 Testing Tracer Study PINs:')
  TRACER_STUDY_PINS.forEach(pin => {
    const result = validatePINAndGetUser(pin, 'tracer-study')
    console.log(`PIN ${pin}: ${result ? '✅ Valid' : '❌ Invalid'}`)
  })
  
  // Test user survey PINs
  console.log('\n📋 Testing User Survey PINs:')
  USER_SURVEY_PINS.forEach(pin => {
    const result = validatePINAndGetUser(pin, 'user-survey')
    console.log(`PIN ${pin}: ${result ? '✅ Valid' : '❌ Invalid'}`)
  })
  
  // Test cross-validation (should fail)
  console.log('\n🚫 Testing Cross-Validation (should fail):')
  const tracerPIN = TRACER_STUDY_PINS[0]
  const userPIN = USER_SURVEY_PINS[0]
  
  console.log(`Tracer PIN ${tracerPIN} for user survey: ${validatePINAndGetUser(tracerPIN, 'user-survey') ? '❌ Should fail!' : '✅ Correctly failed'}`)
  console.log(`User PIN ${userPIN} for tracer study: ${validatePINAndGetUser(userPIN, 'tracer-study') ? '❌ Should fail!' : '✅ Correctly failed'}`)
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
