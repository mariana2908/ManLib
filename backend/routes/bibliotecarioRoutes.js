const express = require('express');
const { BibliotecarioController } = require('../controllers');
const router = express.Router();

// Autenticação
router.post('/login', BibliotecarioController.login);

// Listar todos os bibliotecários
router.get('/', BibliotecarioController.listarBibliotecarios);

// Obter um bibliotecário específico
router.get('/:id', BibliotecarioController.obterBibliotecario);

// Criar um novo bibliotecário
router.post('/', BibliotecarioController.criarBibliotecario);

// Atualizar um bibliotecário
router.put('/:id', BibliotecarioController.atualizarBibliotecario);

// Deletar um bibliotecário
router.delete('/:id', BibliotecarioController.deletarBibliotecario);

module.exports = router;