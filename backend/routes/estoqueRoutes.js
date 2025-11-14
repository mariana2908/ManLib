const express = require('express');
const { EstoqueController } = require('../controllers');
const auth = require('../middleware/auth');
const router = express.Router();

// Listar todos os estoques
router.get('/', auth.authMiddleware, EstoqueController.listarEstoques);

// Verificar disponibilidade de um livro
router.get('/livro/:livroId/disponibilidade', auth.authMiddleware, EstoqueController.verificarDisponibilidade);

// Obter um estoque específico
router.get('/:id', auth.authMiddleware, EstoqueController.obterEstoque);

// Criar um novo estoque
router.post('/', auth.bibliotecarioAuth, EstoqueController.criarEstoque);

// Atualizar um estoque
router.put('/:id', auth.bibliotecarioAuth, EstoqueController.atualizarEstoque);

// Deletar um estoque
router.delete('/:id', auth.bibliotecarioAuth, EstoqueController.deletarEstoque);

// Incrementar quantidade em estoque
router.post('/:id/incrementar',auth.bibliotecarioAuth, EstoqueController.incrementarQuantidade);

// Decrementar quantidade em estoque
router.post('/:id/decrementar',auth.bibliotecarioAuth, EstoqueController.decrementarQuantidade);

module.exports = router;