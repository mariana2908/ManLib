const express = require('express');
const router = express.Router();
const { Estudantes } = require('../models');
const EstudanteAuthController = require('../controllers/estudanteAuthController');

// Middleware para verificar se o usuário é um administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.tipo === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
  }
};

// Rota para o admin gerar credenciais de acesso para um estudante
router.post('/gerar-credenciais/:estudanteId', isAdmin, async (req, res) => {
  try {
    const { estudanteId } = req.params;
    
    const estudante = await Estudantes.findByPk(estudanteId);
    if (!estudante) {
      return res.status(404).json({ error: 'Estudante não encontrado' });
    }

    // Gera uma senha temporária
    const senhaTemporaria = EstudanteAuthController.gerarSenhaTemporaria();
    const senhaCriptografada = await EstudanteAuthController.criptografarSenha(senhaTemporaria);
    
    // Define a data de expiração para 24 horas a partir de agora
    const dataExpiracao = new Date();
    dataExpiracao.setHours(dataExpiracao.getHours() + 24);

    // Atualiza o estudante com as novas credenciais
    await estudante.update({
      senha: senhaCriptografada,
      senhaTemporaria: senhaTemporaria,
      dataExpiracaoSenha: dataExpiracao,
      status: 'ativo',
      primeiroAcesso: true
    });

    // Em produção, aqui você enviaria um e-mail para o estudante com as credenciais
    // Por enquanto, vamos apenas retornar no response (apenas para desenvolvimento)
    res.json({
      message: 'Credenciais geradas com sucesso',
      credenciais: {
        email: estudante.email,
        senhaTemporaria: senhaTemporaria,
        expiraEm: dataExpiracao
      }
    });
  } catch (error) {
    console.error('Erro ao gerar credenciais:', error);
    res.status(500).json({ error: 'Erro ao gerar credenciais' });
  }
});

// Rota para o estudante fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Encontra o estudante pelo email
    const estudante = await Estudantes.findOne({ where: { email } });
    
    // Verifica se o estudante existe e está ativo
    if (!estudante || estudante.status !== 'ativo') {
      return res.status(401).json({ error: 'Credenciais inválidas ou conta inativa' });
    }

    // Verifica a senha
    const senhaValida = await EstudanteAuthController.verificarSenha(senha, estudante.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verifica se a senha expirou
    if (estudante.dataExpiracaoSenha && new Date() > estudante.dataExpiracaoSenha) {
      return res.status(401).json({ 
        error: 'Sua senha expirou. Por favor, solicite uma nova senha ao administrador.' 
      });
    }

    // Gera o token JWT
    const token = EstudanteAuthController.gerarToken(estudante);

    // Verifica se é o primeiro acesso
    const primeiroAcesso = estudante.primeiroAcesso === true;
    
    // Se for o primeiro acesso, marca como não é mais o primeiro acesso
    if (primeiroAcesso) {
      await EstudanteAuthController.atualizarPrimeiroAcesso(estudante.uuid);
    }

    // Retorna o token e informações do estudante
    res.json({
      token,
      estudante: {
        id: estudante.uuid,
        nome: estudante.nome,
        email: estudante.email,
        primeiroAcesso
      },
      message: primeiroAcesso 
        ? 'Bem-vindo! Por favor, altere sua senha no primeiro acesso.' 
        : 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

// Rota para o estudante alterar a senha (após o primeiro login)
router.post('/alterar-senha', async (req, res) => {
  try {
    const { token, senhaAtual, novaSenha } = req.body;
    
    // Verifica se o token é válido e obtém o ID do estudante
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.tipo !== 'estudante') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const estudante = await Estudantes.findByPk(decoded.id);
    if (!estudante) {
      return res.status(404).json({ error: 'Estudante não encontrado' });
    }

    // Se não for o primeiro acesso, verifica a senha atual
    if (!estudante.primeiroAcesso) {
      const senhaValida = await EstudanteAuthController.verificarSenha(senhaAtual, estudante.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
    }

    // Atualiza a senha
    const novaSenhaCriptografada = await EstudanteAuthController.criptografarSenha(novaSenha);
    
    await estudante.update({
      senha: novaSenhaCriptografada,
      senhaTemporaria: null,
      dataExpiracaoSenha: null,
      primeiroAcesso: false
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

module.exports = router;
