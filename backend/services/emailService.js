const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        this.templatesPath = path.join(__dirname, '..', 'templates', 'emails');
    }

    // Carrega um template de email
    async loadTemplate(templateName) {
        const filePath = path.join(this.templatesPath, `${templateName}.html`);
        return await fs.readFile(filePath, 'utf8');
    }

    // Preenche o template com os dados
    fillTemplate(template, data) {
        return template.replace(/\${(\w+)}/g, (match, key) => data[key] || match);
    }

    // Envia um email
    async sendEmail(to, subject, template, data) {
        try {
            const htmlTemplate = await this.loadTemplate(template);
            const html = this.fillTemplate(htmlTemplate, data);

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado:', info.messageId);
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return false;
        }
    }

    // Notificação de atraso
    async sendOverdueNotification(emprestimo) {
        const diasAtraso = Math.ceil(
            (new Date() - new Date(emprestimo.dataPrevistaDevolucao)) / (1000 * 60 * 60 * 24)
        );

        return await this.sendEmail(
            emprestimo.estudante.email,
            'Devolução de livro em atraso',
            'overdue',
            {
                nomeEstudante: emprestimo.estudante.nome,
                tituloLivro: emprestimo.livro.titulo,
                dataPrevista: new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString(),
                diasAtraso
            }
        );
    }

    // Notificação de devolução próxima
    async sendReturnReminderNotification(emprestimo) {
        const diasRestantes = Math.ceil(
            (new Date(emprestimo.dataPrevistaDevolucao) - new Date()) / (1000 * 60 * 60 * 24)
        );

        return await this.sendEmail(
            emprestimo.estudante.email,
            'Lembrete de devolução de livro',
            'returnReminder',
            {
                nomeEstudante: emprestimo.estudante.nome,
                tituloLivro: emprestimo.livro.titulo,
                dataPrevista: new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString(),
                diasRestantes
            }
        );
    }

    // Notificação de novo empréstimo
    async sendNewLoanNotification(emprestimo) {
        return await this.sendEmail(
            emprestimo.estudante.email,
            'Confirmação de empréstimo de livro',
            'newLoan',
            {
                nomeEstudante: emprestimo.estudante.nome,
                tituloLivro: emprestimo.livro.titulo,
                dataEmprestimo: new Date(emprestimo.dataEmprestimo).toLocaleDateString(),
                dataPrevista: new Date(emprestimo.dataPrevistaDevolucao).toLocaleDateString()
            }
        );
    }

    // Notificação de disponibilidade de livro
    async sendBookAvailableNotification(estudante, livro) {
        return await this.sendEmail(
            estudante.email,
            'Livro disponível para empréstimo',
            'bookAvailable',
            {
                nomeEstudante: estudante.nome,
                tituloLivro: livro.titulo,
                autorLivro: livro.autor
            }
        );
    }
}

module.exports = new EmailService();