const express = require('express');
const { LivroController } = require('../controllers');
const router = express.Router();

// Listar todos os livros
router.get('/', LivroController.listarLivros);

// Buscar livros por termo
router.get('/buscar', LivroController.buscarLivros);

// Obter um livro específico
router.get('/:id', LivroController.obterLivro);

// Criar um novo livro
router.post('/', LivroController.criarLivro);

// Atualizar um livro
router.put('/:id', LivroController.atualizarLivro);

// Deletar um livro
router.delete('/:id', LivroController.deletarLivro);

module.exports = router;