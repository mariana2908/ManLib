const jwt = require('jsonwebtoken');
const { Estudantes } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoMuitoSeguro';

const authMiddleware = async (req, res, next) => {
  try {
    // Obtém o token do cabeçalho Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verifica se o token está no formato correto (Bearer <token>)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const token = parts[1];
    
    // Verifica o token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verifica se o token é para um estudante
    if (decoded.tipo === 'estudante') {
      const estudante = await Estudantes.findByPk(decoded.id);
      
      if (!estudante || estudante.status !== 'ativo') {
        return res.status(401).json({ error: 'Estudante não encontrado ou inativo' });
      }
      
      // Adiciona o estudante à requisição
      req.user = {
        id: estudante.uuid,
        tipo: 'estudante',
        primeiroAcesso: estudante.primeiroAcesso
      };
    } 
    // Aqui você pode adicionar verificação para outros tipos de usuário (ex: admin)
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

// Middleware para verificar se o usuário é um estudante
const isEstudante = (req, res, next) => {
  if (req.user && req.user.tipo === 'estudante') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas estudantes podem acessar esta rota.' });
  }
};

// Middleware para verificar se é o primeiro acesso
const isPrimeiroAcesso = (req, res, next) => {
  if (req.user && req.user.primeiroAcesso === true) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Esta rota é apenas para primeiro acesso.' });
  }
};

// Middleware para verificar se NÃO é o primeiro acesso
const isNotPrimeiroAcesso = (req, res, next) => {
  if (req.user && req.user.primeiroAcesso === false) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Esta rota requer que você altere sua senha no primeiro acesso.' });
  }
};

module.exports = {
  authMiddleware,
  isEstudante,
  isPrimeiroAcesso,
  isNotPrimeiroAcesso
};
