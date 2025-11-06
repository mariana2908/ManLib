const winston = require('winston');
const { format } = winston;
const path = require('path');

// Configuração base do logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'manlib' },
    transports: [
        // Logs de erro
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Todos os logs
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Logs de auditoria
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/audit.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

// Adiciona logs no console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

// Função para logs de auditoria
const audit = (userId, userType, action, details) => {
    logger.info('AUDIT', {
        userId,
        userType,
        action,
        details,
        timestamp: new Date().toISOString()
    });
};

// Função para logs de erro
const logError = (error, context = {}) => {
    logger.error('ERROR', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
    });
};

// Função para logs de performance
const logPerformance = (action, duration, metadata = {}) => {
    logger.info('PERFORMANCE', {
        action,
        duration,
        ...metadata,
        timestamp: new Date().toISOString()
    });
};

// Função para logs de segurança
const logSecurity = (event, details) => {
    logger.warn('SECURITY', {
        event,
        details,
        timestamp: new Date().toISOString()
    });
};

// Middleware para logging de requisições
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Logging após a resposta ser enviada
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        if (req.user) {
            log.userId = req.user.id;
            log.userType = req.user.type;
        }

        if (res.statusCode >= 400) {
            logger.warn('HTTP_ERROR', log);
        } else {
            logger.info('HTTP_REQUEST', log);
        }
    });

    next();
};

module.exports = {
    logger,
    audit,
    logError,
    logPerformance,
    logSecurity,
    requestLogger
};