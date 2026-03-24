import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

const ALLOWED_GITHUB_ID = process.env.ALLOWED_GITHUB_USER_ID

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // Single-user: nur Oliver (GitHub User ID aus env)
      if (!ALLOWED_GITHUB_ID) return false
      return String(profile?.id) === ALLOWED_GITHUB_ID
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string | undefined,
      }
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
})
