const { Estoque, Livro } = require('../models');

class EstoqueController {
    async listarEstoques(req, res) {
        try {
            const estoques = await Estoque.findAll({
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });
            return res.status(200).json(estoques);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar estoques' });
        }
    }

    async obterEstoque(req, res) {
        try {
            const { id } = req.params;
            const estoque = await Estoque.findByPk(id, {
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });
            
            if (!estoque) {
                return res.status(404).json({ error: 'Estoque não encontrado' });
            }

            return res.status(200).json(estoque);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar estoque' });
        }
    }

    async criarEstoque(req, res) {
        try {
            const { livroId, livro_id, quantidade, localizacao } = req.body;
            const livroIdValue = livroId || livro_id;

            // Verifica se o livro existe
            const livro = await Livro.findByPk(livroIdValue);
            if (!livro) {
                return res.status(400).json({ error: 'Livro não encontrado' });
            }

            // Verifica se já existe um estoque para este livro
            const estoqueExistente = await Estoque.findOne({ where: { livro_id: livroIdValue } });
            if (estoqueExistente) {
                return res.status(400).json({ error: 'Já existe um estoque para este livro' });
            }
            const estoque = await Estoque.create({
                livro_id: livroIdValue,
                quantidade,
                quantidade_disponivel: quantidade,
                quantidade_emprestada: 0
            });

            // Retorna o estoque com os dados do livro
            const estoqueCompleto = await Estoque.findByPk(estoque.id, {
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });

            return res.status(201).json(estoqueCompleto);
        } catch (error) {
            console.error('Erro criarEstoque:', error);
            return res.status(500).json({ error: 'Erro ao criar estoque' });
        }
    }

    async atualizarEstoque(req, res) {
        try {
            const { id } = req.params;
            const { quantidade, localizacao } = req.body;

            const estoque = await Estoque.findByPk(id);
            if (!estoque) {
                return res.status(404).json({ error: 'Estoque não encontrado' });
            }

            await estoque.update({
                quantidade,
                localizacao
            });

            // Retorna o estoque atualizado com os dados do livro
            const estoqueCompleto = await Estoque.findByPk(id, {
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });

            return res.status(200).json(estoqueCompleto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar estoque' });
        }
    }

    async deletarEstoque(req, res) {
        try {
            const { id } = req.params;
            const estoque = await Estoque.findByPk(id);
            
            if (!estoque) {
                return res.status(404).json({ error: 'Estoque não encontrado' });
            }

            await estoque.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar estoque' });
        }
    }

    async incrementarQuantidade(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            const estoque = await Estoque.findByPk(id);
            if (!estoque) {
                return res.status(404).json({ error: 'Estoque não encontrado' });
            }

            if (!quantidade || quantidade <= 0) {
                return res.status(400).json({ error: 'Quantidade inválida' });
            }

            await estoque.increment('quantidade', { by: quantidade });
            await estoque.reload();

            // Retorna o estoque atualizado com os dados do livro
            const estoqueCompleto = await Estoque.findByPk(id, {
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });

            return res.status(200).json(estoqueCompleto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao incrementar quantidade' });
        }
    }

    async decrementarQuantidade(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;

            const estoque = await Estoque.findByPk(id);
            if (!estoque) {
                return res.status(404).json({ error: 'Estoque não encontrado' });
            }

            if (!quantidade || quantidade <= 0) {
                return res.status(400).json({ error: 'Quantidade inválida' });
            }

            if (estoque.quantidade < quantidade) {
                return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
            }

            await estoque.decrement('quantidade', { by: quantidade });
            await estoque.reload();

            // Retorna o estoque atualizado com os dados do livro
            const estoqueCompleto = await Estoque.findByPk(id, {
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });

            return res.status(200).json(estoqueCompleto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao decrementar quantidade' });
        }
    }

    async verificarDisponibilidade(req, res) {
        try {
            const { livroId } = req.params;

            const estoque = await Estoque.findOne({
                where: { livro_id: livroId },
                include: [{
                    model: Livro,
                    as: 'livro'
                }]
            });

            if (!estoque) {
                return res.status(404).json({ error: 'Estoque não encontrado para este livro' });
            }

            return res.status(200).json({
                disponivel: estoque.quantidade > 0,
                quantidade: estoque.quantidade,
                livro: estoque.livro
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao verificar disponibilidade' });
        }
    }
}

module.exports = new EstoqueController();