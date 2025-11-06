const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        // Verifica se o header de autorização existe
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Verifica se o formato do token está correto
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Token mal formatado' });
        }

        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Token mal formatado' });
        }

        // Verifica se o token é válido
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            // Adiciona as informações do usuário decodificadas na requisição
            req.userId = decoded.id;
            req.userType = decoded.type; // 'bibliotecario' ou 'estudante'
            return next();
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro na autenticação' });
    }
};

const bibliotecarioAuth = (req, res, next) => {
    if (req.userType !== 'bibliotecario') {
        return res.status(403).json({ error: 'Acesso permitido apenas para bibliotecários' });
    }
    return next();
};

const estudanteAuth = (req, res, next) => {
    if (req.userType !== 'estudante') {
        return res.status(403).json({ error: 'Acesso permitido apenas para estudantes' });
    }
    return next();
};

const adminAuth = (req, res, next) => {
    if (req.userType !== 'admin') {
        return res.status(403).json({ error: 'Acesso permitido apenas para administradores' });
    }
    return next();
};

module.exports = {
    authMiddleware,
    bibliotecarioAuth,
    estudanteAuth,
    adminAuth
};