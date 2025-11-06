const express = require('express');
const { EstoqueController } = require('../controllers');
const router = express.Router();

// Listar todos os estoques
router.get('/', EstoqueController.listarEstoques);

// Verificar disponibilidade de um livro
router.get('/livro/:livroId/disponibilidade', EstoqueController.verificarDisponibilidade);

// Obter um estoque específico
router.get('/:id', EstoqueController.obterEstoque);

// Criar um novo estoque
router.post('/', EstoqueController.criarEstoque);

// Atualizar um estoque
router.put('/:id', EstoqueController.atualizarEstoque);

// Deletar um estoque
router.delete('/:id', EstoqueController.deletarEstoque);

// Incrementar quantidade em estoque
router.post('/:id/incrementar', EstoqueController.incrementarQuantidade);

// Decrementar quantidade em estoque
router.post('/:id/decrementar', EstoqueController.decrementarQuantidade);

module.exports = router;