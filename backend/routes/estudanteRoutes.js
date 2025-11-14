const express = require('express');
const { EstudanteController } = require('../controllers');
const router = express.Router();
const auth = require('../middleware/auth');

// Autenticação
router.post('/login', EstudanteController.login);

// Listar todos os estudantes
router.get('/',auth.bibliotecarioAuth, EstudanteController.listarEstudantes);

// Obter um estudante específico
router.get('/:id',auth.authMiddleware, EstudanteController.obterEstudante);

// Criar um novo estudante
router.post('/',auth.bibliotecarioAuth, EstudanteController.criarEstudante);

// Atualizar um estudante
router.put('/:id',auth.bibliotecarioAuth, EstudanteController.atualizarEstudante);

// Deletar um estudante
router.delete('/:id',auth.bibliotecarioAuth, EstudanteController.deletarEstudante);

module.exports = router;