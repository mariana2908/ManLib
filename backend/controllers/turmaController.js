const { Turma } = require('../models');

class TurmaController {
    async listarTurmas(req, res) {
        try {
            const turmas = await Turma.findAll();
            return res.status(200).json(turmas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar turmas' });
        }
    }

    async obterTurma(req, res) {
        try {
            const { id } = req.params;
            const turma = await Turma.findByPk(id);
            
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
            const { nome, codigo, turno, serie, ano } = req.body;
            const turma = await Turma.create({ nome, codigo, turno, serie, ano });
            return res.status(201).json(turma);
        } catch (error) {
            console.error('Erro criarTurma:', error);
            return res.status(500).json({ error: 'Erro ao criar turma' });
        }
    }

    async atualizarTurma(req, res) {
        try {
            const { id } = req.params;
            const { nome, codigo, turno, serie, ano } = req.body;
            
            const turma = await Turma.findByPk(id);
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
            const turma = await Turma.findByPk(id);
            
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