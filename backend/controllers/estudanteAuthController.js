const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Estudantes } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoMuitoSeguro';
const TEMPO_EXPIRACAO = '24h';

class EstudanteAuthController {
  // Gera uma senha temporária aleatória
  static gerarSenhaTemporaria() {
    return Math.random().toString(36).slice(-8); // Gera uma string aleatória de 8 caracteres
  }

  // Gera um token JWT para o estudante
  static gerarToken(estudante) {
    return jwt.sign(
      { id: estudante.uuid, tipo: 'estudante' },
      JWT_SECRET,
      { expiresIn: TEMPO_EXPIRACAO }
    );
  }

  // Criptografa a senha
  static async criptografarSenha(senha) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
  }

  // Verifica se a senha está correta
  static async verificarSenha(senha, hash) {
    return bcrypt.compare(senha, hash);
  }

  // Atualiza o status de primeiro acesso
  static async atualizarPrimeiroAcesso(estudanteId) {
    return Estudantes.update(
      { primeiroAcesso: false },
      { where: { uuid: estudanteId } }
    );
  }
}

module.exports = EstudanteAuthController;
