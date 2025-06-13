import NextAuth, { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt with email:", credentials?.email)
        
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials")
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        console.log("User found:", user ? "Yes" : "No")
        
        if (!user || !user.password) {
          console.log("User not found or no password")
          return null
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        console.log("Password valid:", isPasswordValid)

        if (!isPasswordValid) {
          console.log("Invalid password")
          return null
        }

        console.log("Login successful for user:", user.email)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Pass user role
        }
      }
    })

  ],
  session: {
    strategy: "jwt" as const, // Use JWT for sessions
  },
  callbacks: {
    async jwt({ token, user }: any) {
      // Add user role to JWT token
      if (user) {
        token.role = user.role;
        token.id = user.id; // Add user id to token
      }
      return token;
    },
    async session({ session, token }: any) {
      // Add role from JWT token to session object
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string; // Add user id to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Path to your sign in page
    // error: '/auth/error', // Optional, if you want to customize the error page
    // signOut: '/auth/signout', // Optional, if you want to customize the sign out page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }