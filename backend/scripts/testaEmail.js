require('dotenv').config();
const emailService = require('../services/emailService');

(async () => {
  // Troque para um email real seu para testar
  const destinatario = process.env.EMAIL_USER;
  const sucesso = await emailService.sendEmail(
    destinatario,
    'Teste de Email ManLib',
    'overdue',
    {
      nomeEstudante: 'Usuário Teste',
      tituloLivro: 'Livro de Teste',
      dataPrevista: new Date().toLocaleDateString(),
      diasAtraso: 1
    }
  );
  if (sucesso) {
    console.log('Email de teste enviado com sucesso!');
  } else {
    console.log('Falha ao enviar email de teste.');
  }
})();
