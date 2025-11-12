const { Livros: Livro } = require('../models');
const { Op } = require('sequelize');

class LivroController {
    async listarLivros(req, res) {
        try {
            console.log('Iniciando listagem de livros...');
            const livros = await Livro.findAll();
            console.log('Livros encontrados:', livros.length);
            return res.status(200).json(livros);
        } catch (error) {
            console.error('Erro detalhado ao listar livros:', error);
            return res.status(500).json({ 
                error: 'Erro ao listar livros',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async obterLivro(req, res) {
        try {
            console.log('Buscando livro por ID...');
            let { id } = req.params;
            console.log('ID recebido:', id);
            
            if (!id) {
                console.error('ID não fornecido');
                return res.status(400).json({ error: 'ID do livro é obrigatório' });
            }

            // Busca direta por UUID (chave primária)
            console.log('Buscando livro por UUID:', id);
            const livro = await Livro.findByPk(id, {
                attributes: ['uuid', 'titulo', 'autor', 'genero', 'editora', 'isbn', 'status']
            });
            
            if (!livro) {
                console.error('Livro não encontrado para o ID/UUID:', id);
                return res.status(404).json({ 
                    error: 'Livro não encontrado',
                    details: `Nenhum livro encontrado com o ID/UUID: ${id}`,
                    suggestion: 'Verifique se o ID está correto ou tente listar todos os livros primeiro.'
                });
            }

            console.log('Livro encontrado:', livro.uuid);
            return res.status(200).json(livro);
        } catch (error) {
            console.error('Erro detalhado ao buscar livro:', error);
            return res.status(500).json({ 
                error: 'Erro ao buscar livro',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                suggestion: 'Verifique se o ID está no formato correto (UUID). Tente listar todos os livros primeiro para obter um ID válido.'
            });
        }
    }

    async criarLivro(req, res) {
        try {
            console.log('Iniciando criação de livro...');
            console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
            
            const { v4: uuidv4 } = require('uuid');
            
            const {
                titulo,
                autor,
                genero,
                editora = null, // Tornando opcional com valor padrão null
                isbn,
                status = 'disponivel', // Valor padrão 'disponivel' se não informado
                uuid = uuidv4() // Gera um UUID se não for fornecido
            } = req.body;

            // Validação dos campos obrigatórios
            const camposObrigatorios = [];
            if (!titulo) camposObrigatorios.push('titulo');
            if (!autor) camposObrigatorios.push('autor');
            if (!genero) camposObrigatorios.push('genero');
            if (!isbn) camposObrigatorios.push('isbn');
            
            if (camposObrigatorios.length > 0) {
                return res.status(400).json({
                    error: 'Campos obrigatórios não informados',
                    camposFaltantes: camposObrigatorios
                });
            }

            // Verifica se já existe um livro com este ISBN
            console.log('Verificando se o ISBN já existe...');
            const existingLivro = await Livro.findOne({ where: { isbn } });
            if (existingLivro) {
                console.error('ISBN já cadastrado:', isbn);
                return res.status(400).json({ 
                    error: 'ISBN já cadastrado',
                    details: 'Já existe um livro cadastrado com este ISBN.'
                });
            }

            // Valida o status
            const statusValidos = ['disponivel', 'indisponivel'];
            if (status && !statusValidos.includes(status)) {
                return res.status(400).json({
                    error: 'Status inválido',
                    details: `O status deve ser um dos seguintes: ${statusValidos.join(', ')}`
                });
            }

            console.log('Criando novo livro...');
            const livro = await Livro.create({
                titulo,
                autor,
                genero,
                editora,
                isbn,
                status
            });

            console.log('Livro criado com sucesso:', livro.uuid);
            return res.status(201).json(livro);
            
        } catch (error) {
            console.error('Erro detalhado ao criar livro:', error);
            return res.status(500).json({ 
                error: 'Erro ao criar livro',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                suggestion: 'Verifique se todos os campos obrigatórios foram fornecidos e se o ISBN é único.'
            });
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
            console.log('Iniciando busca de livros...');
            const { termo } = req.query;
            
            if (!termo) {
                return res.status(400).json({ error: 'Termo de busca é necessário' });
            }

            console.log('Termo de busca:', termo);
            
            const livros = await Livro.findAll({
                where: {
                    [Op.or]: [
                        { titulo: { [Op.iLike]: `%${termo}%` } },
                        { autor: { [Op.iLike]: `%${termo}%` } },
                        { editora: { [Op.iLike]: `%${termo}%` } },
                        { isbn: { [Op.iLike]: `%${termo}%` } },
                        { genero: { [Op.iLike]: `%${termo}%` } }
                    ]
                }
            });

            console.log('Livros encontrados:', livros.length);
            return res.status(200).json(livros);
        } catch (error) {
            console.error('Erro detalhado ao buscar livros:', error);
            return res.status(500).json({ 
                error: 'Erro ao buscar livros',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = new LivroController();