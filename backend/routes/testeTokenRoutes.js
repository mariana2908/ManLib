const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Gera um token JWT para teste
router.post('/gerar-token', (req, res) => {
  const { id, type } = req.body;
  if (!id || !type) {
    return res.status(400).json({ error: 'Informe id e type ("estudante" ou "bibliotecario")' });
  }
  const token = jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Endpoint protegido para testar o middleware
const { authMiddleware } = require('../middleware/auth');
router.get('/protegido', authMiddleware, (req, res) => {
  res.json({ mensagem: 'Acesso autorizado!', userId: req.userId, userType: req.userType });
});

module.exports = router;
