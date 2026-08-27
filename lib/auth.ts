import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const organization = await prisma.organization.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!organization) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          organization.passwordHash,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: organization.id,
          name: organization.name,
          email: organization.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.organizationId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.organizationId as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
