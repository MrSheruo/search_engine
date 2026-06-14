import fs from "node:fs";
import path from "node:path";
import winston from "winston";

const logsDir = path.join(process.cwd(), "logs");

fs.mkdirSync(logsDir, { recursive: true });

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(
            ({ timestamp, level, message, stack, ...meta }) => {
                const extra = Object.keys(meta).length
                    ? ` ${JSON.stringify(meta)}`
                    : "";

                return stack
                    ? `[${timestamp}] ${level}: ${stack}${extra}`
                    : `[${timestamp}] ${level}: ${message}${extra}`;
            }
        )
    ),
    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: path.join(logsDir, "app.log"),
        }),

        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
        }),
    ],
});

export default logger;