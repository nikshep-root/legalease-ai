import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { createUser, validateUser } from '@/lib/auth-storage'
import { createOrUpdateUserProfile } from '@/lib/user-service'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
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
    async signIn({ user, account, profile }: any) {
      // Create/update user profile in Firestore when signing in with Google
      if (account?.provider === 'google' && user) {
        try {
          await createOrUpdateUserProfile({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          });
        } catch (error) {
          console.error('Error creating/updating user profile:', error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id
      }
      // Store provider info
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
        session.user.provider = token.provider
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