const { Livro } = require('../models');

class LivroController {
    async listarLivros(req, res) {
        try {
            const livros = await Livro.findAll();
            return res.status(200).json(livros);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar livros' });
        }
    }

    async obterLivro(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);
            
            if (!livro) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            return res.status(200).json(livro);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar livro' });
        }
    }

    async criarLivro(req, res) {
        try {
            const {
                uuid,
                titulo,
                autor,
                genero,
                editora,
                isbn,
                status
            } = req.body;

            // Verifica se já existe um livro com este ISBN
            const existingLivro = await Livro.findOne({ where: { isbn } });
            if (existingLivro) {
                return res.status(400).json({ error: 'ISBN já cadastrado' });
            }

            const livro = await Livro.create({
                uuid: uuid || undefined,
                titulo,
                autor,
                genero,
                editora,
                isbn,
                status
            });

            return res.status(201).json(livro);
        } catch (error) {
            console.error('Erro criarLivro:', error);
            return res.status(500).json({ error: 'Erro ao criar livro' });
        }
    }

    async atualizarLivro(req, res) {
        try {
            const { id } = req.params;
            const {
                titulo,
                autor,
                editora,
                anoPublicacao,
                isbn,
                categoria
            } = req.body;
            
            const livro = await Livro.findByPk(id);
            if (!livro) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            // Se estiver atualizando o ISBN, verifica se já existe
            if (isbn && isbn !== livro.isbn) {
                const existingLivro = await Livro.findOne({ where: { isbn } });
                if (existingLivro) {
                    return res.status(400).json({ error: 'ISBN já cadastrado' });
                }
            }

            await livro.update({
                titulo,
                autor,
                editora,
                anoPublicacao,
                isbn,
                categoria
            });

            return res.status(200).json(livro);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar livro' });
        }
    }

    async deletarLivro(req, res) {
        try {
            const { id } = req.params;
            const livro = await Livro.findByPk(id);
            
            if (!livro) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            await livro.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar livro' });
        }
    }

    async buscarLivros(req, res) {
        try {
            const { termo } = req.query;
            
            if (!termo) {
                return res.status(400).json({ error: 'Termo de busca é necessário' });
            }

            const livros = await Livro.findAll({
                where: {
                    [Op.or]: [
                        { titulo: { [Op.iLike]: `%${termo}%` } },
                        { autor: { [Op.iLike]: `%${termo}%` } },
                        { editora: { [Op.iLike]: `%${termo}%` } },
                        { isbn: { [Op.iLike]: `%${termo}%` } },
                        { categoria: { [Op.iLike]: `%${termo}%` } }
                    ]
                }
            });

            return res.status(200).json(livros);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar livros' });
        }
    }
}

module.exports = new LivroController();