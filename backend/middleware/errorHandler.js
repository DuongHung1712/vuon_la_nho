import logger from "../config/logger.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === "production";

  logger.error(err.message, {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: req.body?.userId || req.userId || null,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode === 500
        ? "Internal server error"
        : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { notFound, errorHandler };
