const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

// Logger middleware using Winston
const loggerMiddleware = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;

  logger.info(
    `${method} request to ${url} from ${ip} [user_id: ${req.user.userId}]`,
  );
  next();
};

module.exports = { loggerMiddleware };
