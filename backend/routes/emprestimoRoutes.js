const express = require('express');
const { EmprestimoController } = require('../controllers');
const router = express.Router();

// Listar todos os empréstimos
router.get('/', EmprestimoController.listarEmprestimos);

// Listar empréstimos ativos
router.get('/ativos', EmprestimoController.listarEmprestimosAtivos);

// Listar empréstimos atrasados
router.get('/atrasados', EmprestimoController.listarEmprestimosAtrasados);

// Listar empréstimos por estudante
router.get('/estudante/:estudanteId', EmprestimoController.listarEmprestimosPorEstudante);

// Obter um empréstimo específico
router.get('/:id', EmprestimoController.obterEmprestimo);

// Criar um novo empréstimo
router.post('/', EmprestimoController.criarEmprestimo);

// Registrar devolução
router.post('/:id/devolucao', EmprestimoController.registrarDevolucao);

module.exports = router;