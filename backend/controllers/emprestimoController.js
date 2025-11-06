const { Emprestimo, Livro, Estudante } = require('../models');

class EmprestimoController {
    async listarEmprestimos(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll({
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });
            return res.status(200).json(emprestimos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar empréstimos' });
        }
    }

    async obterEmprestimo(req, res) {
        try {
            const { id } = req.params;
            const emprestimo = await Emprestimo.findByPk(id, {
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });
            
            if (!emprestimo) {
                return res.status(404).json({ error: 'Empréstimo não encontrado' });
            }

            return res.status(200).json(emprestimo);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar empréstimo' });
        }
    }

    async criarEmprestimo(req, res) {
        try {
            const { estudanteId, livroId, dataEmprestimo, dataPrevistaDevolucao } = req.body;

            // Verifica se o estudante existe
            const estudante = await Estudante.findByPk(estudanteId);
            if (!estudante) {
                return res.status(400).json({ error: 'Estudante não encontrado' });
            }

            // Verifica se o livro existe
            const livro = await Livro.findByPk(livroId);
            if (!livro) {
                return res.status(400).json({ error: 'Livro não encontrado' });
            }

            // Verifica se o livro já está emprestado
            const emprestimoAtivo = await Emprestimo.findOne({
                where: {
                    livroId,
                    dataDevolucao: null
                }
            });

            if (emprestimoAtivo) {
                return res.status(400).json({ error: 'Livro já está emprestado' });
            }

            const emprestimo = await Emprestimo.create({
                estudanteId,
                livroId,
                dataEmprestimo,
                dataPrevistaDevolucao
            });

            // Retorna o empréstimo com os dados do livro e estudante
            const emprestimoCompleto = await Emprestimo.findByPk(emprestimo.id, {
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });

            return res.status(201).json(emprestimoCompleto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar empréstimo' });
        }
    }

    async registrarDevolucao(req, res) {
        try {
            const { id } = req.params;
            const { dataDevolucao } = req.body;

            const emprestimo = await Emprestimo.findByPk(id);
            if (!emprestimo) {
                return res.status(404).json({ error: 'Empréstimo não encontrado' });
            }

            if (emprestimo.dataDevolucao) {
                return res.status(400).json({ error: 'Este empréstimo já foi devolvido' });
            }

            await emprestimo.update({ dataDevolucao });

            // Retorna o empréstimo atualizado com os dados do livro e estudante
            const emprestimoCompleto = await Emprestimo.findByPk(id, {
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });

            return res.status(200).json(emprestimoCompleto);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao registrar devolução' });
        }
    }

    async listarEmprestimosAtivos(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll({
                where: {
                    dataDevolucao: null
                },
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });
            return res.status(200).json(emprestimos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar empréstimos ativos' });
        }
    }

    async listarEmprestimosAtrasados(req, res) {
        try {
            const hoje = new Date();
            const emprestimos = await Emprestimo.findAll({
                where: {
                    dataDevolucao: null,
                    dataPrevistaDevolucao: {
                        [Op.lt]: hoje
                    }
                },
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });
            return res.status(200).json(emprestimos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar empréstimos atrasados' });
        }
    }

    async listarEmprestimosPorEstudante(req, res) {
        try {
            const { estudanteId } = req.params;
            
            const estudante = await Estudante.findByPk(estudanteId);
            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            const emprestimos = await Emprestimo.findAll({
                where: { estudanteId },
                include: [
                    {
                        model: Livro,
                        as: 'livro'
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { exclude: ['senha'] }
                    }
                ]
            });
            return res.status(200).json(emprestimos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar empréstimos do estudante' });
        }
    }
}

module.exports = new EmprestimoController();