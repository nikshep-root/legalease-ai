import bcrypt from 'bcryptjs'
import { db } from '@/lib/firebase-admin'

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

const USERS_COLLECTION = 'users'

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const emailLowercase = email.toLowerCase()
    
    // Check if user already exists
    const existingUserSnapshot = await db
      .collection(USERS_COLLECTION)
      .where('email', '==', emailLowercase)
      .limit(1)
      .get()
    
    if (!existingUserSnapshot.empty) {
      console.log(`[Auth Storage] ❌ User already exists: ${email}`)
      throw new Error('User already exists with this email')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser: User = {
      id: userId,
      name,
      email: emailLowercase,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    // Save to Firestore
    await db.collection(USERS_COLLECTION).doc(userId).set(newUser)
    
    console.log(`[Auth Storage] ✅ User created in Firestore: ${email}`)
    return { ...newUser, password: '' } // Don't return password
    
  } catch (error) {
    console.error('[Auth Storage] Error creating user:', error)
    throw error
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const emailLowercase = email.toLowerCase()
    const userSnapshot = await db
      .collection(USERS_COLLECTION)
      .where('email', '==', emailLowercase)
      .limit(1)
      .get()
    
    if (userSnapshot.empty) {
      return null
    }

    const userData = userSnapshot.docs[0].data() as User
    return userData
    
  } catch (error) {
    console.error('[Auth Storage] Error finding user:', error)
    return null
  }
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await findUserByEmail(email)
    if (!user) {
      console.log(`[Auth Storage] ❌ No user found with email: ${email}`)
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      console.log(`[Auth Storage] ❌ Invalid password for user: ${email}`)
      return null
    }

    console.log(`[Auth Storage] ✅ User validated: ${email}`)
    return { ...user, password: '' } // Don't return password
    
  } catch (error) {
    console.error('[Auth Storage] Error validating user:', error)
    return null
  }
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  try {
    const usersSnapshot = await db.collection(USERS_COLLECTION).get()
    return usersSnapshot.docs.map(doc => {
      const { password, ...user } = doc.data() as User
      return user
    })
  } catch (error) {
    console.error('[Auth Storage] Error getting all users:', error)
    return []
  }
}