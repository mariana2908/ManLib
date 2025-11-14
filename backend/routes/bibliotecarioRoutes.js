const express = require('express');
const { BibliotecarioController } = require('../controllers');
const router = express.Router();
const auth = require('../middleware/auth.js')

// Autenticação
router.post('/login', BibliotecarioController.login);

// Listar todos os bibliotecários
router.get('/', auth.authMiddleware, BibliotecarioController.listarBibliotecarios);

// Obter um bibliotecário específico
router.get('/:id', auth.authMiddleware, BibliotecarioController.obterBibliotecario);

// Criar um novo bibliotecário
router.post('/', auth.adminAuth, BibliotecarioController.criarBibliotecario);

// Atualizar um bibliotecário
router.put('/:id', auth.adminAuth, BibliotecarioController.atualizarBibliotecario);

// Deletar um bibliotecário
router.delete('/:id', auth.adminAuth, BibliotecarioController.deletarBibliotecario);

module.exports = router;