const cron = require('node-cron');
const { Op } = require('sequelize');
const { Emprestimo, Estudante, Livro } = require('../models');
const emailService = require('./emailService');

class JobService {
    constructor() {
        // Inicia os jobs assim que o serviço é instanciado
        this.initJobs();
    }

    // Inicializa todos os jobs agendados
    initJobs() {
        // Verifica empréstimos atrasados diariamente às 8h
        cron.schedule('0 8 * * *', this.checkOverdueLoans.bind(this));

        // Envia lembretes de devolução diariamente às 9h
        cron.schedule('0 9 * * *', this.sendReturnReminders.bind(this));

        // Atualiza estatísticas diariamente à meia-noite
        cron.schedule('0 0 * * *', this.updateStatistics.bind(this));

        // Gera backup do banco às 3h da manhã
        cron.schedule('0 3 * * *', this.backupDatabase.bind(this));

        // Limpa logs antigos semanalmente aos domingos à 1h
        cron.schedule('0 1 * * 0', this.cleanOldLogs.bind(this));

        console.log('Jobs agendados iniciados com sucesso');
    }

    // Verifica empréstimos atrasados e envia notificações
    async checkOverdueLoans() {
        try {
            const hoje = new Date();
            
            const emprestimosAtrasados = await Emprestimo.findAll({
                where: {
                    dataDevolucao: null,
                    dataPrevistaDevolucao: {
                        [Op.lt]: hoje
                    },
                    ultimaNotificacao: {
                        [Op.or]: [
                            { [Op.lt]: new Date(hoje - 24 * 60 * 60 * 1000) }, // Última notificação há mais de 24h
                            null // Ou nunca notificado
                        ]
                    }
                },
                include: [
                    {
                        model: Estudante,
                        as: 'estudante'
                    },
                    {
                        model: Livro,
                        as: 'livro'
                    }
                ]
            });

            for (const emprestimo of emprestimosAtrasados) {
                await emailService.sendOverdueNotification(emprestimo);
                await emprestimo.update({ ultimaNotificacao: new Date() });
            }

            console.log(`${emprestimosAtrasados.length} notificações de atraso enviadas`);
        } catch (error) {
            console.error('Erro ao verificar empréstimos atrasados:', error);
        }
    }

    // Envia lembretes de devolução para empréstimos próximos do vencimento
    async sendReturnReminders() {
        try {
            const hoje = new Date();
            const tresDiasFrente = new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000);
            
            const emprestimosProximosVencimento = await Emprestimo.findAll({
                where: {
                    dataDevolucao: null,
                    dataPrevistaDevolucao: {
                        [Op.between]: [hoje, tresDiasFrente]
                    },
                    ultimoLembrete: {
                        [Op.or]: [
                            { [Op.lt]: new Date(hoje - 24 * 60 * 60 * 1000) }, // Último lembrete há mais de 24h
                            null // Ou nunca lembrado
                        ]
                    }
                },
                include: [
                    {
                        model: Estudante,
                        as: 'estudante'
                    },
                    {
                        model: Livro,
                        as: 'livro'
                    }
                ]
            });

            for (const emprestimo of emprestimosProximosVencimento) {
                await emailService.sendReturnReminderNotification(emprestimo);
                await emprestimo.update({ ultimoLembrete: new Date() });
            }

            console.log(`${emprestimosProximosVencimento.length} lembretes de devolução enviados`);
        } catch (error) {
            console.error('Erro ao enviar lembretes de devolução:', error);
        }
    }

    // Atualiza estatísticas do sistema
    async updateStatistics() {
        try {
            const { sequelize } = require('../models');
            
            // Atualiza estatísticas de atrasos nos estoques
            await sequelize.query(`
                UPDATE estoques e
                SET quantidade_emprestada = (
                    SELECT COUNT(*)
                    FROM emprestimos em
                    WHERE em.livro_id = e.livro_id
                    AND em.status = 'ativo'
                ),
                quantidade_disponivel = quantidade - (
                    SELECT COUNT(*)
                    FROM emprestimos em
                    WHERE em.livro_id = e.livro_id
                    AND em.status = 'ativo'
                )
            `);

            console.log('Estatísticas atualizadas com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
        }
    }

    // Realiza backup do banco de dados
    async backupDatabase() {
        try {
            const { exec } = require('child_process');
            const path = require('path');
            const fs = require('fs');
            
            // Cria diretório de backup se não existir
            const backupDir = path.join(__dirname, '../backups');
            if (!fs.existsSync(backupDir)){
                fs.mkdirSync(backupDir, { recursive: true });
            }

            // Nome do arquivo de backup com data
            const date = new Date().toISOString().split('T')[0];
            const backupFile = path.join(backupDir, `backup-${date}.sql`);

            // Executa pg_dump
            const { DB_USER, DB_PASS, DB_NAME } = process.env;
            const command = `PGPASSWORD=${DB_PASS} pg_dump -U ${DB_USER} -d ${DB_NAME} > ${backupFile}`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    throw new Error(`Erro no backup: ${error.message}`);
                }
                // Remove backups mais antigos que 7 dias
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                
                fs.readdir(backupDir, (err, files) => {
                    if (err) throw err;
                    
                    files.forEach(file => {
                        const filePath = path.join(backupDir, file);
                        const stats = fs.statSync(filePath);
                        if (stats.mtime < sevenDaysAgo) {
                            fs.unlinkSync(filePath);
                        }
                    });
                });
            });

            console.log('Backup do banco de dados realizado com sucesso');
        } catch (error) {
            console.error('Erro ao realizar backup do banco:', error);
        }
    }

    // Limpa logs antigos
    async cleanOldLogs() {
        try {
            const fs = require('fs').promises;
            const path = require('path');
            
            const logsDir = path.join(__dirname, '../logs');
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const files = await fs.readdir(logsDir);
            
            for (const file of files) {
                const filePath = path.join(logsDir, file);
                const stats = await fs.stat(filePath);
                
                // Remove logs mais antigos que 30 dias
                if (stats.mtime < thirtyDaysAgo) {
                    await fs.unlink(filePath);
                    console.log(`Log removido: ${file}`);
                }
            }

            console.log('Logs antigos removidos com sucesso');
        } catch (error) {
            console.error('Erro ao limpar logs antigos:', error);
        }
    }
}

module.exports = new JobService();