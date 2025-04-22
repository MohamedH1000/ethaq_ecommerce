import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber) {
          throw new Error("رقم الهاتف مطلوب");
        }

        // Find or create user based on phone number
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phoneNumber },
        });

        if (!user) {
          throw new Error("فشل تسجيل الدخول");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.phone) {
        session.user.phone = token.phone;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
