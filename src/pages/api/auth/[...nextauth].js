import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user; // Make sure to return the user object
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 60 * 60 * 24, // Session expiry duration (1 days)
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your environment
  callbacks: {
    async jwt({ token, user }) {
      // When the user signs in, we add the email to the JWT token
      if (user) {
        token.email = user.email; // Add email to the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      // Add the email to the session object
      if (token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
