const { Estudantes, Turmas } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

class EstudanteController {
    async listarEstudantes(req, res) {
        try {
            const estudantes = await Estudantes.findAll({
                attributes: { exclude: ['senha'] },
                include: [{
                    model: Turmas,
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
            const estudante = await Estudantes.findByPk(id, {
                attributes: { exclude: ['senha'] },
                include: [{
                    model: Turmas,
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
            console.log('Iniciando criação de estudante...');
            const { nome, email, senha, matricula, turma_id } = req.body;
            console.log('Dados recebidos:', { nome, email, matricula, turma_id });
            
            // Verifica se já existe um estudante com este email ou matrícula
            console.log('Verificando se o estudante já existe...');
            const existingEstudante = await Estudantes.findOne({
                where: {
                    [Op.or]: [{ email }, { matricula }]
                }
            });
            
            if (existingEstudante) {
                console.log('Estudante já existe:', existingEstudante.email || existingEstudante.matricula);
                return res.status(400).json({ error: 'Email ou matrícula já cadastrados' });
            }

            // Verifica se a turma existe
            if (turma_id) {
                console.log('Verificando se a turma existe...');
                const turma = await Turmas.findByPk(turma_id);
                if (!turma) {
                    console.log('Turma não encontrada:', turma_id);
                    return res.status(400).json({ error: 'Turma não encontrada' });
                }
                console.log('Turma encontrada:', turma.nome);
            }

            // Hash da senha
            console.log('Gerando hash da senha...');
            const senhaHash = await bcrypt.hash(senha, 10);

            console.log('Criando novo estudante...');
            const novoEstudante = await Estudantes.create({
                nome,
                email,
                senha: senhaHash,
                matricula,
                turma_id: turma_id
            });

            console.log('Estudante criado com sucesso:', novoEstudante.uuid);
            
            // Remove a senha do objeto retornado
            const { senha: _, ...estudanteSemSenha } = novoEstudante.toJSON();
            return res.status(201).json(estudanteSemSenha);
        } catch (error) {
            console.error('Erro ao criar estudante:', error);
            return res.status(500).json({ 
                error: 'Erro ao criar estudante',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async atualizarEstudante(req, res) {
        try {
            console.log('Iniciando atualização de estudante...');
            const { id } = req.params;
            const uuid = id;
            console.log('ID do estudante a ser atualizado:', uuid);
            const { nome, email, senha, matricula, turma_id } = req.body;
            
            const estudante = await Estudantes.findByPk(id);
            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            // Se estiver atualizando o email ou matrícula, verifica se já existem
            if ((email && email !== estudante.email) || (matricula && matricula !== estudante.matricula)) {
                console.log('Verificando email/matrícula para atualização...');
                const existingEstudante = await Estudantes.findOne({
                    where: {
                        [Op.or]: [
                            { email: email || estudante.email },
                            { matricula: matricula || estudante.matricula }
                        ],
                        uuid: { [Op.ne]: uuid } // Exclui o próprio estudante da verificação
                    }
                });
                
                if (existingEstudante) {
                    return res.status(400).json({ error: 'Email ou matrícula já cadastrados' });
                }
            }

            // Se estiver atualizando a turma, verifica se existe
            if (turma_id && turma_id !== estudante.turma_id) {
                console.log('Verificando turma para atualização...');
                const turma = await Turmas.findByPk(turma_id);
                if (!turma) {
                    return res.status(400).json({ error: 'Turma não encontrada' });
                }
            }

            // Se estiver atualizando a senha, faz o hash
            const dadosAtualizacao = {
                nome,
                email,
                matricula,
                turma_id
            };
            console.log('Atualizando dados do estudante... ', dadosAtualizacao);
            
            if (senha) {
                console.log('Atualizando senha...');
                dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
            }

            const [updated] = await Estudantes.update(dadosAtualizacao, { where: { uuid } }); // Corrigindo a atualização
            
            // Remove a senha do objeto retornado
            const { senha: _, ...estudanteAtualizado } = estudante.toJSON();
            return res.status(200).json(estudanteAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar estudante:', error);
            return res.status(500).json({ error: 'Erro ao atualizar estudante' });
        }
    }

    async deletarEstudante(req, res) {
        try {
            const { id } = req.params;
            const uuid = id;
            const estudante = await Estudantes.findByPk(uuid);
            
            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            await Estudantes.destroy({ where: { uuid } });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar estudante' });
        }
    }

    async login(req, res) {
        try {
            console.log('Iniciando processo de login...');
            const { email, senha } = req.body;
            console.log('Dados recebidos:', { email, senha: senha ? '***' : 'não fornecida' });

            console.log('Buscando estudante com email:', email);
            const estudante = await Estudantes.findOne({
                where: { email },
                include: [{
                    model: Turmas,
                    as: 'turma',
                    required: false
                }]
            });
            
            console.log('Resultado da busca:', estudante ? 'Estudante encontrado' : 'Estudante não encontrado');
            if (!estudante) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            console.log('Comparando senhas...');
            console.log('Senha fornecida:', senha);
            console.log('Hash armazenado:', estudante.senha);
            
            const senhaValida = await bcrypt.compare(senha, estudante.senha);
            console.log('Resultado da comparação:', senhaValida);
            
            if (!senhaValida) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Remove a senha do objeto retornado
            const { senha: _, ...estudanteSemSenha } = estudante.toJSON();
            return res.status(200).json(estudanteSemSenha);
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ 
                error: 'Erro ao realizar login',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = new EstudanteController();