import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { logUserLogin } from "@/lib/userLogger";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 5 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials || {};
        const now = new Date().toLocaleString("th-TH", {
          timeZone: "Asia/Bangkok",
        });
        const ipAddress =
          req?.headers?.["x-forwarded-for"] ||
          req?.socket?.remoteAddress ||
          null;
        const userAgent = req?.headers?.["user-agent"] || null;

        console.log("🔐 [LOGIN ATTEMPT @ " + now + "]:", { username });

        const fail = async (msg, emoji) => {
          console.log(`${emoji} ${msg}`);
          await logUserLogin({
            username: username || "unknown",
            ipAddress,
            userAgent,
            success: false,
            message: msg,
          });
          throw new Error(msg);
        };

        if (!username || !password) return fail("Missing credentials", "❌");

        const userAuth = await prisma.userAuth.findFirst({
          where: { userAuthUsername: username },
          include: {
            userAccount: {
              include: {
                job: {
                  include: {
                    division: true,
                    department: true,
                    role: true,
                    position: true,
                  },
                },
              },
            },
          },
        });

        if (!userAuth) return fail("Username not found.", "❌");

        const user = userAuth.userAccount;
        if (!user) return fail("User data not linked to account.", "❌");
        if (user.userStatus !== "Enable")
          return fail("Your account has been disabled.", "🚫");

        const isPasswordValid = await bcrypt.compare(
          password,
          userAuth.userAuthPassword
        );
        if (!isPasswordValid) return fail("Incorrect password.", "❌");

        await logUserLogin({
          userId: user.userId,
          username,
          ipAddress,
          userAgent,
          success: true,
          message: "Login success",
        });

        const job = user.job;

        const userPayload = {
          id: user.userId.toString(),
          nameTH: `${user.userFirstName} ${user.userLastName}`,
          email: user.userEmail,
          phone: user.userPhone,
          picture: user.userPicture,
          roleName: job?.role?.roleName,
          divisionName: job?.division?.divisionName,
          departmentName: job?.department?.departmentName,
          positionName: job?.position?.positionName,
          contractType: job?.useJobContractType,
          startDate: job?.useJobStartDate,
          forceReset: userAuth.userAuthForceReset,
        };
        console.log("✅ Full User Payload:", userPayload);
        return userPayload;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const TIMEOUT = 60 * 60;
      const nowTH = new Date().toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
      });
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (user) {
        token.user = user;
        token.exp = currentTimestamp + TIMEOUT;
        token.user.forceReset = user.forceReset || false;
        console.log("💾 JWT created @", nowTH);
        console.log(
          "⏳ Session will expire @",
          new Date(token.exp * 1000).toLocaleString("th-TH", {
            timeZone: "Asia/Bangkok",
          })
        );
      } else if (token?.user) {
        token.exp = currentTimestamp + TIMEOUT;
        console.log("🔁 JWT extended @", nowTH);
        console.log(
          "⏳ Session extended to @",
          new Date(token.exp * 1000).toLocaleString("th-TH", {
            timeZone: "Asia/Bangkok",
          })
        );
      }
      return token;
    },

    async session({ session, token }) {
      const nowTH = new Date().toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
      });
      const expireDate = new Date(token.exp * 1000).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
      });

      session.user = {
        ...token.user,
      };
      session.expires = new Date(token.exp * 1000).toISOString();

      console.log("📤 Session sent to client @", nowTH);
      console.log("⏳ Session will expire @", expireDate);
      return session;
    },
  },
};
