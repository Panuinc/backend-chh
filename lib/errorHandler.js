import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export function handleRateLimitExceeded(ip) {
  logger.warn({ message: "⚠️ Too many requests", ip });
  return NextResponse.json(
    { error: "Too many requests, please try again later" },
    { status: 429 }
  );
}

export function handleZodError(error) {
  const details = error.flatten().fieldErrors;
  logger.warn({
    message: "📛 Validation error",
    details,
  });

  return NextResponse.json(
    {
      error: "Invalid input",
      details,
    },
    { status: 422 }
  );
}

export function handleUnauthorizedError() {
  logger.warn({ message: "🚫 Unauthorized access attempt" });
  return NextResponse.json({ error: "Access denied" }, { status: 401 });
}

export function handleGenericError(error, context = "An error occurred") {
  logger.error({
    message: `🔥 ${context}`,
    error: error.message,
    stack: error.stack,
  });
  return NextResponse.json({ error: context }, { status: 500 });
}

export function handleErrors(error, ip, context = "An error occurred") {
  if (error.message === "RateLimitExceeded") return handleRateLimitExceeded(ip);
  if (error.name === "ZodError") return handleZodError(error);
  if (error.status === 401) return handleUnauthorizedError();
  if (error.status === 422 && error.details)
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: 422 }
    );
  return handleGenericError(error, context);
}

export function handleGetErrors(error, ip, context = "An error occurred") {
  if (error.message === "RateLimitExceeded") return handleRateLimitExceeded(ip);
  if (error.status === 401) return handleUnauthorizedError();
  return handleGenericError(error, context);
}
