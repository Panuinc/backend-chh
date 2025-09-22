import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60, updateAge: 5 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        const fail = (msg) => {
          throw new Error(msg);
        };

        if (!email || !password) return fail("Missing credentials");

        const user = await prisma.user.findUnique({
          where: { userEmail: email },
        });
        if (!user) return fail("Email not found.");
        if (user.userStatus !== "Enable")
          return fail("Your account has been disabled.");

        const ok = await bcrypt.compare(password, user.userPassword);
        if (!ok) return fail("Incorrect password.");

        return {
          id: user.userId,
          name: `${user.userFirstName} ${user.userLastName}`,
          email: user.userEmail,
          status: user.userStatus,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const TIMEOUT = 60 * 60;
      const current = Math.floor(Date.now() / 1000);
      if (user) {
        token.user = user;
        token.exp = current + TIMEOUT;
      } else if (token?.user) {
        token.exp = current + TIMEOUT;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
        session.expires = new Date(token.exp * 1000).toISOString();
      }
      return session;
    },
  },
};
