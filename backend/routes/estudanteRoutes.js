const express = require('express');
const { EstudanteController } = require('../controllers');
const router = express.Router();

// Autenticação
router.post('/login', EstudanteController.login);

// Listar todos os estudantes
router.get('/', EstudanteController.listarEstudantes);

// Obter um estudante específico
router.get('/:id', EstudanteController.obterEstudante);

// Criar um novo estudante
router.post('/', EstudanteController.criarEstudante);

// Atualizar um estudante
router.put('/:id', EstudanteController.atualizarEstudante);

// Deletar um estudante
router.delete('/:id', EstudanteController.deletarEstudante);

module.exports = router;