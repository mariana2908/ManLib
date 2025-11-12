const { Turmas } = require('../models');

class TurmaController {
    async listarTurmas(req, res) {
        try {
            const turmas = await Turmas.findAll();
            return res.status(200).json(turmas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar turmas' });
        }
    }

    async obterTurma(req, res) {
        try {
            const { id } = req.params;
            const turma = await Turmas.findByPk(id);
            
            if (!turma) {
                return res.status(404).json({ error: 'Turma não encontrada' });
            }

            return res.status(200).json(turma);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar turma' });
        }
    }

    async criarTurma(req, res) {
        try {
            console.log('Corpo da requisição:', req.body);
            const { nome, codigo, turno, serie, ano } = req.body;
            
            // Validação dos campos obrigatórios
            if (!nome || !codigo || !turno || !serie || !ano) {
                return res.status(400).json({ 
                    error: 'Todos os campos são obrigatórios',
                    camposObrigatorios: { nome, codigo, turno, serie, ano }
                });
            }
            
            console.log('Tentando criar turma com:', { nome, codigo, turno, serie, ano });
            const turma = await Turmas.create({ 
                nome, 
                codigo, 
                turno, 
                serie, 
                ano: parseInt(ano, 10) // Garante que o ano seja um número
            });
            
            console.log('Turma criada com sucesso:', turma);
            return res.status(201).json(turma);
        } catch (error) {
            console.error('Erro ao criar turma:', {
                mensagem: error.message,
                nome: error.name,
                stack: error.stack,
                erros: error.errors ? error.errors.map(e => e.message) : null
            });
            return res.status(500).json({ 
                error: 'Erro ao criar turma',
                detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async atualizarTurma(req, res) {
        try {
            const { id } = req.params;
            const { nome, codigo, turno, serie, ano } = req.body;
            
            const turma = await Turmas.findByPk(id);
            if (!turma) {
                return res.status(404).json({ error: 'Turma não encontrada' });
            }

            await turma.update({ nome, codigo, turno, serie, ano });
            return res.status(200).json(turma);
        } catch (error) {
            console.error('Erro atualizarTurma:', error);
            return res.status(500).json({ error: 'Erro ao atualizar turma' });
        }
    }

    async deletarTurma(req, res) {
        try {
            const { id } = req.params;
            const turma = await Turmas.findByPk(id);
            
            if (!turma) {
                return res.status(404).json({ error: 'Turma não encontrada' });
            }

            await turma.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar turma' });
        }
    }
}

module.exports = new TurmaController();