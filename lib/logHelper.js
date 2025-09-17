import logger from "@/lib/logger";

let lastMsg = "";
let lastTime = 0;

function shouldLog(msg) {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  const now = Date.now();
  if (msg === lastMsg && now - lastTime < 50) {
    return false;
  }
  lastMsg = msg;
  lastTime = now;
  return true;
}

export const logInfo = (message, meta = {}) => {
  if (shouldLog(message)) logger.info({ message, ...meta });
};

export const logWarn = (message, meta = {}) => {
  if (shouldLog(message)) logger.warn({ message, ...meta });
};

export const logError = (message, meta = {}) => {
  if (shouldLog(message)) logger.error({ message, ...meta });
};
