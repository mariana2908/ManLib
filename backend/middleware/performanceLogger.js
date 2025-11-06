const winston = require("../config/winston");

const performanceLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    winston.info(`PERFORMANCE: ${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
};

module.exports = performanceLogger;
