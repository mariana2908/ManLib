const express = require('express');
const router = express.Router();

const { authMiddleware, bibliotecarioAuth } = require('../middleware/auth');

const turmaRoutes = require('./turmaRoutes');
const bibliotecarioRoutes = require('./bibliotecarioRoutes');
const estudanteRoutes = require('./estudanteRoutes');
const livroRoutes = require('./livroRoutes');
const emprestimoRoutes = require('./emprestimoRoutes');
const estoqueRoutes = require('./estoqueRoutes');
const relatorioRoutes = require('./relatorioRoutes');

// Rotas públicas (exemplo: login, registro)
router.use('/estudantes', estudanteRoutes);
router.use('/bibliotecarios', bibliotecarioRoutes);

// Rota de teste de token
const testeTokenRoutes = require('./testeTokenRoutes');
router.use('/teste-token', testeTokenRoutes);

// Rotas protegidas (precisam de autenticação)
router.use('/turmas', authMiddleware, turmaRoutes);
router.use('/livros', authMiddleware, livroRoutes);
router.use('/emprestimos', authMiddleware, emprestimoRoutes);
router.use('/estoques', authMiddleware, estoqueRoutes);
router.use('/relatorios', authMiddleware, bibliotecarioAuth, relatorioRoutes);

module.exports = router;