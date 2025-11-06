const winston = require("../config/winston");

const auditLogger = (req, res, next) => {
  const user = req.user ? req.user.email : 'guest';

  winston.info(`AUDIT: ${user} - ${req.method} ${req.originalUrl}`);
  
  next();
};

module.exports = auditLogger;
