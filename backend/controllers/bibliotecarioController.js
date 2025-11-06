const { Bibliotecarios } = require('../models');
const bcrypt = require('bcrypt');

class BibliotecarioController {
    async listarBibliotecarios(req, res) {
        try {
            const bibliotecarios = await Bibliotecarios.findAll({
                attributes: { exclude: ['senha'] }
            });
            return res.status(200).json(bibliotecarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar bibliotecários' });
        }
    }

    async obterBibliotecario(req, res) {
        try {
            const { id } = req.params;
            const bibliotecario = await Bibliotecarios.findByPk(id, {
                attributes: { exclude: ['senha'] }
            });
            
            if (!bibliotecario) {
                return res.status(404).json({ error: 'Bibliotecário não encontrado' });
            }

            return res.status(200).json(bibliotecario);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar bibliotecário' });
        }
    }

    async criarBibliotecario(req, res) {
        try {
            const { nome, email, senha } = req.body;
            
            // Verifica se já existe um bibliotecário com este email
            const existingBibliotecario = await Bibliotecarios.findOne({ where: { email } });
            if (existingBibliotecario) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Hash da senha
            const senhaHash = await bcrypt.hash(senha, 10);

            const bibliotecario = await Bibliotecarios.create({
                uuid: req.body.uuid || undefined,
                nome,
                email,
                senha: senhaHash,
                telefone: req.body.telefone,
                status: req.body.status
            });

            // Remove a senha do objeto retornado
            const { senha: _, ...bibliotecarioSemSenha } = bibliotecario.toJSON();
            return res.status(201).json(bibliotecarioSemSenha);
        } catch (error) {
            console.error('Erro criarBibliotecario:', error);
            return res.status(500).json({ error: 'Erro ao criar bibliotecário' });
        }
    }

    async atualizarBibliotecario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha } = req.body;
            
            const bibliotecario = await Bibliotecarios.findByPk(id);
            if (!bibliotecario) {
                return res.status(404).json({ error: 'Bibliotecário não encontrado' });
            }

            // Se estiver atualizando o email, verifica se já existe
            if (email && email !== bibliotecario.email) {
                const existingBibliotecario = await Bibliotecarios.findOne({ where: { email } });
                if (existingBibliotecario) {
                    return res.status(400).json({ error: 'Email já cadastrado' });
                }
            }

            // Se estiver atualizando a senha, faz o hash
            const dadosAtualizacao = {
                nome,
                email
            };
            
            if (senha) {
                dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
            }

            await bibliotecario.update(dadosAtualizacao);
            
            // Remove a senha do objeto retornado
            const { senha: _, ...bibliotecarioAtualizado } = bibliotecario.toJSON();
            return res.status(200).json(bibliotecarioAtualizado);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar bibliotecário' });
        }
    }

    async deletarBibliotecario(req, res) {
        try {
            const { id } = req.params;
            const bibliotecario = await Bibliotecarios.findByPk(id);
            
            if (!bibliotecario) {
                return res.status(404).json({ error: 'Bibliotecário não encontrado' });
            }

            await bibliotecario.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar bibliotecário' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const bibliotecario = await Bibliotecarios.findOne({ where: { email } });
            if (!bibliotecario) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const senhaValida = await bcrypt.compare(senha, bibliotecario.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Remove a senha do objeto retornado
            const { senha: _, ...bibliotecarioSemSenha } = bibliotecario.toJSON();
            return res.status(200).json(bibliotecarioSemSenha);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao realizar login' });
        }
    }
}

module.exports = new BibliotecarioController();