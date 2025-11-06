const redisService = require('../services/redisService');

// Middleware para cache de consultas
const queryCache = (duration = 300) => async (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = `${req.originalUrl || req.url}`;
    try {
        const cachedData = await redisService.getCachedQuery(key);
        if (cachedData) {
            return res.json(cachedData);
        }
        
        // Monkey patch res.json para interceptar e cachear a resposta
        const originalJson = res.json.bind(res);
        res.json = async (data) => {
            if (res.statusCode === 200) {
                await redisService.cacheQuery(key, data, duration);
            }
            return originalJson(data);
        };
        
        next();
    } catch (error) {
        console.error('Cache error:', error);
        next();
    }
};

// Middleware para cache de autenticação
const authCache = () => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next();
    }

    try {
        const userId = req.user?.id; // Assumindo que já existe um middleware de JWT
        if (userId) {
            const cachedToken = await redisService.getToken(userId);
            if (cachedToken === token) {
                req.tokenCached = true;
            } else {
                await redisService.cacheToken(userId, token);
            }
        }
        next();
    } catch (error) {
        console.error('Auth cache error:', error);
        next();
    }
};

// Middleware para cache de relatórios
const reportCache = (reportType, duration = 1800) => async (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const params = {
        ...req.query,
        ...req.params
    };

    try {
        const cachedReport = await redisService.getCachedReport(reportType, params);
        if (cachedReport) {
            return res.json(cachedReport);
        }

        const originalJson = res.json.bind(res);
        res.json = async (data) => {
            if (res.statusCode === 200) {
                await redisService.cacheReport(reportType, params, data, duration);
            }
            return originalJson(data);
        };

        next();
    } catch (error) {
        console.error('Report cache error:', error);
        next();
    }
};

module.exports = {
    queryCache,
    authCache,
    reportCache
};