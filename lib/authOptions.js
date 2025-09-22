import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getNowTH() {
  return new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
}

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
      async authorize(credentials, req) {
        const { email, password } = credentials || {};
        const now = getNowTH();
        const ipAddress =
          req?.headers?.["x-forwarded-for"]
            ?.toString()
            ?.split(",")[0]
            ?.trim() ||
          req?.headers?.["x-real-ip"] ||
          "unknown";
        const userAgent = req?.headers?.["user-agent"] || "unknown";

        const log = async ({ userId, success, message }) => {
          if (!userId) return;
          await prisma.userLog.create({
            data: {
              userLogUserId: userId,
              userLogIpAddress: ipAddress,
              userLogUserAgent: userAgent,
              userLogSuccess: success,
              userLogMessage: message,
              userLogLoginAt: new Date(),
            },
          });
        };

        const fail = async (msg) => {
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
        if (!ok) {
          await log({
            userId: user.userId,
            success: false,
            message: "Incorrect password",
          });
          return fail("Incorrect password.");
        }

        await log({
          userId: user.userId,
          success: true,
          message: "Login success",
        });

        return {
          id: user.userId,
          nameTH: `${user.userFirstName} ${user.userLastName}`,
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
      session.user = { ...token.user };
      session.expires = new Date(token.exp * 1000).toISOString();
      return session;
    },
  },
};
