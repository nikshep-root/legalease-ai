import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createUser, validateUser } from '@/lib/auth-storage'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isSignUp: { label: 'Is Sign Up', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          if (credentials.isSignUp === 'true') {
            // Sign up flow
            if (!credentials.name) {
              throw new Error('Name is required for sign up')
            }

            console.log(`[NextAuth] 🔄 Attempting to create user: ${credentials.email}`)
            const user = await createUser(credentials.name, credentials.email, credentials.password)
            
            if (!user) {
              throw new Error('Failed to create user account')
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          } else {
            // Sign in flow
            console.log(`[NextAuth] 🔄 Attempting to sign in user: ${credentials.email}`)
            const user = await validateUser(credentials.email, credentials.password)
            
            if (!user) {
              throw new Error('Invalid email or password')
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          }
        } catch (error) {
          console.error('[NextAuth] ❌ Authentication error:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/signin'
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }