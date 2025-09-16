import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment-timezone";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestamp = () =>
  moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

const rotatingTransport = new DailyRotateFile({
  dirname: logDir,
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  symlinkName: "application.log",
  maxFiles: "14d",
  auditFile: path.join(logDir, ".audit.json"),
});

const format = winston.format.printf(
  ({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? JSON.stringify(meta, null, 2)
      : "";
    return `${timestamp} [${level}]: ${message}${
      stack ? `\n${stack}` : ""
    } ${metaStr}`;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: timestamp }),
    winston.format.errors({ stack: true }),
    format
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    rotatingTransport,
  ],
});

export default logger;
