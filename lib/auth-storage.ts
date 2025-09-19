import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read users from file
function readUsers(): User[] {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(USERS_FILE)) {
      return []
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[Auth Storage] Error reading users file:', error)
    return []
  }
}

// Write users to file
function writeUsers(users: User[]) {
  try {
    ensureDataDirectory()
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('[Auth Storage] Error writing users file:', error)
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const users = readUsers()
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    // Add to users array and save
    users.push(newUser)
    writeUsers(users)
    
    console.log(`[Auth Storage] ✅ User created: ${email}`)
    return { ...newUser, password: '' } // Don't return password
    
  } catch (error) {
    console.error('[Auth Storage] Error creating user:', error)
    return null
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = readUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    return user || null
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
    const users = readUsers()
    return users.map(({ password, ...user }) => user)
  } catch (error) {
    console.error('[Auth Storage] Error getting all users:', error)
    return []
  }
}