import prisma from "@/lib/prisma";
import { getLocalNow } from "@/lib/getLocalNow";

export async function logUserLogin({
  userId,
  ipAddress,
  userAgent,
  success,
  message,
}) {
  try {
    if (!userId) return;
    await prisma.userLog.create({
      data: {
        userLogUserId: userId,
        userLogIpAddress: ipAddress || "unknown",
        userLogUserAgent: userAgent || "unknown",
        userLogSuccess: !!success,
        userLogMessage: message || "",
        userLogLoginAt: getLocalNow(),
      },
    });
  } catch (error) {
    console.error("❌ Failed to log login", error);
  }
}
