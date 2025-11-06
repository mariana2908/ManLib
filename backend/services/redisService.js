const Redis = require('ioredis');
const { promisify } = require('util');

class RedisService {
    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            // Opções de retry e reconexão
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.on('connect', () => console.log('Redis Client Connected'));
    }

    // Cache de autenticação
    async cacheToken(userId, token, expiresIn = 3600) {
        const key = `auth:${userId}`;
        await this.client.set(key, token, 'EX', expiresIn);
    }

    async getToken(userId) {
        const key = `auth:${userId}`;
        return await this.client.get(key);
    }

    // Cache de consultas
    async cacheQuery(key, data, expiresIn = 300) { // 5 minutos por padrão
        await this.client.set(
            `query:${key}`,
            JSON.stringify(data),
            'EX',
            expiresIn
        );
    }

    async getCachedQuery(key) {
        const data = await this.client.get(`query:${key}`);
        return data ? JSON.parse(data) : null;
    }

    // Cache de relatórios
    async cacheReport(reportType, params, data, expiresIn = 1800) { // 30 minutos
        const key = `report:${reportType}:${JSON.stringify(params)}`;
        await this.client.set(
            key,
            JSON.stringify(data),
            'EX',
            expiresIn
        );
    }

    async getCachedReport(reportType, params) {
        const key = `report:${reportType}:${JSON.stringify(params)}`;
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    // Invalidação de cache
    async invalidateQuery(pattern) {
        const keys = await this.client.keys(`query:${pattern}`);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }

    async invalidateReport(reportType) {
        const keys = await this.client.keys(`report:${reportType}:*`);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }

    // Limpa todo o cache
    async clearAll() {
        await this.client.flushall();
    }
}

module.exports = new RedisService();