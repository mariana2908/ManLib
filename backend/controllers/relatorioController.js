const { Sequelize } = require('sequelize');
const { 
    Livro, 
    Emprestimo, 
    Estudante, 
    Bibliotecario,
    Turma 
} = require('../models');

class RelatorioController {
    // Estatísticas gerais
    async getEstatisticas(req, res) {
        try {
            const [
                totalLivros,
                livrosDisponiveis,
                totalBibliotecarios,
                totalEstudantes,
                totalEmprestimos,
                emprestimosAtivos
            ] = await Promise.all([
                Livro.count(),
                Livro.count({ where: { status: 'disponível' } }),
                Bibliotecario.count(),
                Estudante.count(),
                Emprestimo.count(),
                Emprestimo.count({ where: { dataDevolucao: null } })
            ]);

            return res.status(200).json({
                totalLivros,
                livrosDisponiveis,
                livrosEmprestados: totalLivros - livrosDisponiveis,
                totalBibliotecarios,
                totalEstudantes,
                totalEmprestimos,
                emprestimosAtivos
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao gerar estatísticas' });
        }
    }

    // Livros mais emprestados
    async getLivrosMaisEmprestados(req, res) {
        try {
            const livros = await Emprestimo.findAll({
                attributes: [
                    'livroId',
                    [Sequelize.fn('COUNT', Sequelize.col('livroId')), 'total_emprestimos']
                ],
                include: [{
                    model: Livro,
                    as: 'livro',
                    attributes: ['titulo', 'autor', 'isbn']
                }],
                group: ['livroId', 'livro.id'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('livroId')), 'DESC']],
                limit: 10
            });

            return res.status(200).json(livros);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar livros mais emprestados' });
        }
    }

    // Empréstimos atrasados
    async getEmprestimosAtrasados(req, res) {
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
                        attributes: { exclude: ['senha'] },
                        include: [{
                            model: Turma,
                            as: 'turma'
                        }]
                    }
                ],
                order: [['dataPrevistaDevolucao', 'ASC']]
            });

            return res.status(200).json(emprestimos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar empréstimos atrasados' });
        }
    }

    // Histórico de empréstimos por período
    async getHistoricoEmprestimos(req, res) {
        try {
            const { inicio, fim } = req.query;
            const where = {};
            
            if (inicio || fim) {
                where.dataEmprestimo = {};
                if (inicio) where.dataEmprestimo[Op.gte] = new Date(inicio);
                if (fim) where.dataEmprestimo[Op.lte] = new Date(fim);
            }

            const emprestimos = await Emprestimo.findAll({
                where,
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
                ],
                order: [['dataEmprestimo', 'DESC']]
            });

            return res.status(200).json(emprestimos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar histórico de empréstimos' });
        }
    }

    // Histórico por estudante
    async getHistoricoEstudante(req, res) {
        try {
            const { id } = req.params;
            
            const estudante = await Estudante.findByPk(id, {
                attributes: { exclude: ['senha'] },
                include: [{
                    model: Emprestimo,
                    as: 'emprestimos',
                    include: [{
                        model: Livro,
                        as: 'livro'
                    }]
                }]
            });

            if (!estudante) {
                return res.status(404).json({ error: 'Estudante não encontrado' });
            }

            return res.status(200).json(estudante);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar histórico do estudante' });
        }
    }

    // Estatísticas por turma
    async getEstatisticasPorTurma(req, res) {
        try {
            const turmas = await Turma.findAll({
                include: [{
                    model: Estudante,
                    as: 'estudantes',
                    attributes: ['id'],
                    include: [{
                        model: Emprestimo,
                        as: 'emprestimos',
                        attributes: ['id', 'dataEmprestimo', 'dataDevolucao']
                    }]
                }],
                order: [['nome', 'ASC']]
            });

            const estatisticas = turmas.map(turma => {
                const estudantes = turma.estudantes || [];
                const totalEstudantes = estudantes.length;
                const totalEmprestimos = estudantes.reduce((total, est) => 
                    total + (est.emprestimos ? est.emprestimos.length : 0), 0);
                
                return {
                    turmaId: turma.id,
                    nome: turma.nome,
                    totalEstudantes,
                    totalEmprestimos,
                    mediaEmprestimosPorAluno: totalEstudantes ? 
                        (totalEmprestimos / totalEstudantes).toFixed(2) : 0
                };
            });

            return res.status(200).json(estatisticas);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar estatísticas por turma' });
        }
    }
}

module.exports = new RelatorioController();