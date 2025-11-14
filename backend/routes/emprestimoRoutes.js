const express = require('express');
const { EmprestimoController } = require('../controllers');
const router = express.Router();
const auth = require('../middleware/auth.js');

// Listar todos os empréstimos
router.get('/', auth.bibliotecarioAuth, EmprestimoController.listarEmprestimos);

// Listar empréstimos ativos
router.get('/ativos', auth.bibliotecarioAuth, EmprestimoController.listarEmprestimosAtivos);

// Listar empréstimos atrasados
router.get('/atrasados', auth.bibliotecarioAuth, EmprestimoController.listarEmprestimosAtrasados);

// Listar empréstimos por estudante
router.get('/estudante/:estudanteId', auth.authMiddleware, EmprestimoController.listarEmprestimosPorEstudante);

// Obter um empréstimo específico
router.get('/:id', EmprestimoController.obterEmprestimo);

// Criar um novo empréstimo
router.post('/', auth.bibliotecarioAuth, EmprestimoController.criarEmprestimo);

// Registrar devolução
router.post('/:id/devolucao', auth.bibliotecarioAuth, EmprestimoController.registrarDevolucao);

module.exports = router;