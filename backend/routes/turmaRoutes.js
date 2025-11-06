const express = require('express');
const { TurmaController } = require('../controllers');
const router = express.Router();

// Listar todas as turmas
router.get('/', TurmaController.listarTurmas);

// Obter uma turma específica
router.get('/:id', TurmaController.obterTurma);

// Criar uma nova turma
router.post('/', TurmaController.criarTurma);

// Atualizar uma turma
router.put('/:id', TurmaController.atualizarTurma);

// Deletar uma turma
router.delete('/:id', TurmaController.deletarTurma);

module.exports = router;