// Service for Personal Data Consent (Согласие на обработку ПДн)
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

const CONSENT_COLLECTION = 'pd_consents'
const CONSENT_COOKIE_KEY = 'arca_pd_consent_timestamp'
const CONSENT_DAYS = 30

export interface PdConsent {
  id: string
  userId: string
  consentedAt: string
  ipAddress?: string
  userAgent?: string
  version: string
}

// Check if consent is needed (based on localStorage)
export const isConsentNeeded = (): boolean => {
  const lastConsent = localStorage.getItem(CONSENT_COOKIE_KEY)
  if (!lastConsent) return true

  const consentDate = new Date(lastConsent)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24))

  return daysDiff >= CONSENT_DAYS
}

// Get consent from Firestore for a user
export const getUserConsent = async (userId: string): Promise<PdConsent | null> => {
  try {
    const consentRef = doc(db, CONSENT_COLLECTION, userId)
    const consentDoc = await getDoc(consentRef)

    if (consentDoc.exists()) {
      return consentDoc.data() as PdConsent
    }
    return null
  } catch (error) {
    console.error('Error getting user consent:', error)
    return null
  }
}

// Save consent to Firestore and localStorage
export const saveConsent = async (userId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString()
    
    const consent: PdConsent = {
      id: userId,
      userId,
      consentedAt: now,
      userAgent: navigator.userAgent,
      version: '1.0',
    }

    // Save to Firestore
    const consentRef = doc(db, CONSENT_COLLECTION, userId)
    await setDoc(consentRef, consent)

    // Save to localStorage for 30 days
    localStorage.setItem(CONSENT_COOKIE_KEY, now)

    console.log('✅ PD Consent saved for user:', userId)
    return true
  } catch (error) {
    console.error('Error saving consent:', error)
    // Still save to localStorage even if Firestore fails
    localStorage.setItem(CONSENT_COOKIE_KEY, new Date().toISOString())
    return false
  }
}

// Get all consents (for admin)
export const getAllConsents = async (): Promise<PdConsent[]> => {
  try {
    const consentsRef = collection(db, CONSENT_COLLECTION)
    const snapshot = await getDocs(consentsRef)
    return snapshot.docs.map((doc) => doc.data() as PdConsent)
  } catch (error) {
    console.error('Error getting all consents:', error)
    return []
  }
}

// Check if user has consented (for specific user)
export const hasUserConsented = async (userId: string): Promise<boolean> => {
  const consent = await getUserConsent(userId)
  return consent !== null
}
