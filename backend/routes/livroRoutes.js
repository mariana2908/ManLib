const express = require('express');
const { LivroController } = require('../controllers');
const router = express.Router();
const auth = require('../middleware/auth');

// Listar todos os livros
router.get('/', auth.authMiddleware, LivroController.listarLivros);

// Buscar livros por termo
router.get('/buscar', auth.authMiddleware, LivroController.buscarLivros);

// Obter um livro específico
router.get('/:id', auth.authMiddleware, LivroController.obterLivro);

// Criar um novo livro
router.post('/', auth.bibliotecarioAuth, LivroController.criarLivro);

// Atualizar um livro
router.put('/:id', auth.bibliotecarioAuth, LivroController.atualizarLivro);

// Deletar um livro
router.delete('/:id', auth.bibliotecarioAuth, LivroController.deletarLivro);

module.exports = router;