import logger from "@/lib/logger";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 1000,
  duration: 60,
});

export function getRequestIP(request) {
  const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
  logger.info({ message: "📡 Incoming request", ip });
  return ip;
}

export function verifySecretToken(headers) {
  const token = headers.get("secret-token");
  if (!token || token !== process.env.SECRET_TOKEN) {
    logger.warn({
      message: "⛔ Unauthorized request: invalid or missing secret-token",
      token,
    });

    const error = new Error("Access Denied Due To Invalid or Missing Token");
    error.status = 401;
    throw error;
  }
  logger.info({ message: "✅ Secret token verified" });
}

export const checkRateLimit = async (ip) => {
  try {
    await rateLimiter.consume(ip);
    logger.info({ message: "✅ Rate limit OK", ip });
  } catch (error) {
    logger.warn({ message: "🚫 Rate limit exceeded", ip });
    const err = new Error("RateLimitExceeded");
    err.status = 429;
    throw err;
  }
};

export async function validateRequest(request) {
  const ip = getRequestIP(request);
  verifySecretToken(request.headers);
  await checkRateLimit(ip);
  return ip;
}
