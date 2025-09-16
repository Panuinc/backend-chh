const isDev = process.env.NODE_ENV !== "production";

export const edgeLogger = {
  info: (msg, meta = {}) => isDev && console.log("ℹ️ [EDGE]", msg, meta),
  warn: (msg, meta = {}) => isDev && console.warn("⚠️ [EDGE]", msg, meta),
  error: (msg, meta = {}) => isDev && console.error("❌ [EDGE]", msg, meta),
};
