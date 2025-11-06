const { Estudante, Turma } = require('../models');
const bcrypt = require('bcrypt');

class EstudanteController {
    async listarEstudantes(req, res) {
        try {
            const estudantes = await Estudante.findAll({
                attributes: { exclude: ['senha'] },
                include: [{
                    model: Turma,
                    as: 'turma'
                }]
            });
            return res.status(200).json(estudantes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar estudantes' });
        }
    }

    async obterEstudante(req, res) {
        try {
            const { id } = req.params;
            const estudante = await Estudante.findByPk(id, {
                attributes: { exclude: ['senha'] },
                include: [{
                    model: Turma,
                    as: 'turma'
                }]
            });
            
            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            return res.status(200).json(estudante);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar estudante' });
        }
    }

    async criarEstudante(req, res) {
        try {
            const { nome, email, senha, matricula, turmaId } = req.body;
            
            // Verifica se já existe um estudante com este email ou matrícula
            const existingEstudante = await Estudante.findOne({
                where: {
                    [Op.or]: [{ email }, { matricula }]
                }
            });
            
            if (existingEstudante) {
                return res.status(400).json({ error: 'Email ou matrícula já cadastrados' });
            }

            // Verifica se a turma existe
            if (turmaId) {
                const turma = await Turma.findByPk(turmaId);
                if (!turma) {
                    return res.status(400).json({ error: 'Turma não encontrada' });
                }
            }

            // Hash da senha
            const senhaHash = await bcrypt.hash(senha, 10);

            const estudante = await Estudante.create({
                nome,
                email,
                senha: senhaHash,
                matricula,
                turmaId
            });

            // Remove a senha do objeto retornado
            const { senha: _, ...estudanteSemSenha } = estudante.toJSON();
            return res.status(201).json(estudanteSemSenha);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar estudante' });
        }
    }

    async atualizarEstudante(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, matricula, turmaId } = req.body;
            
            const estudante = await Estudante.findByPk(id);
            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            // Se estiver atualizando o email ou matrícula, verifica se já existem
            if ((email && email !== estudante.email) || (matricula && matricula !== estudante.matricula)) {
                const existingEstudante = await Estudante.findOne({
                    where: {
                        [Op.or]: [
                            { email: email || estudante.email },
                            { matricula: matricula || estudante.matricula }
                        ],
                        id: { [Op.ne]: id }
                    }
                });
                
                if (existingEstudante) {
                    return res.status(400).json({ error: 'Email ou matrícula já cadastrados' });
                }
            }

            // Se estiver atualizando a turma, verifica se existe
            if (turmaId && turmaId !== estudante.turmaId) {
                const turma = await Turma.findByPk(turmaId);
                if (!turma) {
                    return res.status(400).json({ error: 'Turma não encontrada' });
                }
            }

            // Se estiver atualizando a senha, faz o hash
            const dadosAtualizacao = {
                nome,
                email,
                matricula,
                turmaId
            };
            
            if (senha) {
                dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
            }

            await estudante.update(dadosAtualizacao);
            
            // Remove a senha do objeto retornado
            const { senha: _, ...estudanteAtualizado } = estudante.toJSON();
            return res.status(200).json(estudanteAtualizado);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar estudante' });
        }
    }

    async deletarEstudante(req, res) {
        try {
            const { id } = req.params;
            const estudante = await Estudante.findByPk(id);
            
            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            await estudante.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar estudante' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const estudante = await Estudante.findOne({
                where: { email },
                include: [{
                    model: Turma,
                    as: 'turma'
                }]
            });
            
            if (!estudante) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const senhaValida = await bcrypt.hash(senha, estudante.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Remove a senha do objeto retornado
            const { senha: _, ...estudanteSemSenha } = estudante.toJSON();
            return res.status(200).json(estudanteSemSenha);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao realizar login' });
        }
    }
}

module.exports = new EstudanteController();