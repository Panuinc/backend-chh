import prisma from "@/lib/prisma";
import { getLocalNow } from "@/lib/getLocalNow";

export async function logUserLogin({
  userId,
  username,
  ipAddress,
  userAgent,
  success,
  message,
}) {
  try {
    await prisma.userLog.create({
      data: {
        username,
        ipAddress,
        userAgent,
        success,
        message,
        loginAt: getLocalNow(),
        ...(userId && userId > 0 ? { userId } : {}),
      },
    });
  } catch (error) {
    console.error("❌ Failed to log login", error);
  }
}

export async function logUserLogout({
  userId,
  username,
  ipAddress,
  userAgent,
}) {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({
        userId,
        username,
        ipAddress,
        userAgent,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("🔥 Failed to log user logout", err);
  }
}
