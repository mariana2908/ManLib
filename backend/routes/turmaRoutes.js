const express = require('express');
const { TurmaController } = require('../controllers');
const router = express.Router();
const auth = require('../middleware/auth');

// Listar todas as turmas
router.get('/', auth.bibliotecarioAuth, TurmaController.listarTurmas);

// Obter uma turma específica
router.get('/:id', auth.bibliotecarioAuth, TurmaController.obterTurma);

// Criar uma nova turma
router.post('/', auth.bibliotecarioAuth, TurmaController.criarTurma);

// Atualizar uma turma
router.put('/:id', auth.bibliotecarioAuth, TurmaController.atualizarTurma);

// Deletar uma turma
router.delete('/:id', auth.bibliotecarioAuth, TurmaController.deletarTurma);

module.exports = router;