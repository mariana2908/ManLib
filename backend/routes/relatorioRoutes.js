const express = require('express');
const { RelatorioController } = require('../controllers');
const { authMiddleware, bibliotecarioAuth } = require('../middleware/auth');
const router = express.Router();

// Protege todas as rotas com autenticação e restrição para bibliotecários
router.use(authMiddleware);
router.use(bibliotecarioAuth);

// Estatísticas gerais
router.get('/estatisticas', RelatorioController.getEstatisticas);

// Livros mais emprestados
router.get('/livros-mais-emprestados', RelatorioController.getLivrosMaisEmprestados);

// Empréstimos atrasados
router.get('/emprestimos-atrasados', RelatorioController.getEmprestimosAtrasados);

// Histórico de empréstimos por período
router.get('/historico-emprestimos', RelatorioController.getHistoricoEmprestimos);

// Histórico por estudante
router.get('/historico-estudante/:id', RelatorioController.getHistoricoEstudante);

// Estatísticas por turma
router.get('/estatisticas-turma', RelatorioController.getEstatisticasPorTurma);

module.exports = router;