const { Emprestimos: Emprestimo, Livros: Livro, Estudantes: Estudante } = require('../models');

class EmprestimoController {
    async listarEmprestimos(req, res) {
        try {
            console.log('Iniciando listagem de empréstimos...');
            
            const emprestimos = await Emprestimo.findAll({
                include: [
                    {
                        model: Livro,
                        as: 'livro',
                        attributes: ['uuid', 'titulo', 'autor']
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { 
                            exclude: ['senha'],
                            include: ['uuid', 'nome', 'matricula']
                        }
                    }
                ],
                order: [['data_emprestimo', 'DESC']]
            });
            
            console.log(`Encontrados ${emprestimos.length} empréstimos`);
            return res.status(200).json(emprestimos);
            
        } catch (error) {
            console.error('Erro detalhado ao listar empréstimos:', error);
            return res.status(500).json({ 
                error: 'Erro ao listar empréstimos',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                suggestion: 'Verifique se as tabelas relacionadas (Livros, Estudantes) existem no banco de dados.'
            });
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
            console.log('Iniciando criação de empréstimo...');
            console.log('Dados recebidos:', req.body);
            
            const { 
                estudante_id, 
                livro_id, 
                data_emprestimo, 
                data_devolucao,
                bibliotecario_id,
                status = 'ativo'
            } = req.body;

            // Verifica se o estudante existe
            console.log('Buscando estudante com ID:', estudante_id);
            const estudante = await Estudante.findByPk(estudante_id);
            if (!estudante) {
                console.error('Estudante não encontrado com ID:', estudante_id);
                return res.status(400).json({ 
                    error: 'Estudante não encontrado',
                    details: `Nenhum estudante encontrado com o ID: ${estudante_id}`
                });
            }

            // Verifica se o livro existe
            console.log('Buscando livro com ID:', livro_id);
            const livro = await Livro.findByPk(livro_id);
            if (!livro) {
                console.error('Livro não encontrado com ID:', livro_id);
                return res.status(400).json({ 
                    error: 'Livro não encontrado',
                    details: `Nenhum livro encontrado com o ID: ${livro_id}`
                });
            }

            // Verifica se o livro já está emprestado
            const emprestimoAtivo = await Emprestimo.findOne({
                where: {
                    livro_id,
                    status: 'ativo'
                }
            });

            if (emprestimoAtivo) {
                console.error('Livro já está emprestado. ID do livro:', livro_id);
                return res.status(400).json({ 
                    error: 'Livro já está emprestado',
                    details: 'Este livro já está emprestado para outro estudante.'
                });
            }

            console.log('Criando novo empréstimo...');
            
            // Validação dos campos obrigatórios
            const camposObrigatorios = [];
            if (!estudante_id) camposObrigatorios.push('estudante_id');
            if (!livro_id) camposObrigatorios.push('livro_id');
            if (!bibliotecario_id) camposObrigatorios.push('bibliotecario_id');
            
            if (camposObrigatorios.length > 0) {
                return res.status(400).json({
                    error: 'Campos obrigatórios não informados',
                    camposFaltantes: camposObrigatorios
                });
            }

            try {
                const emprestimo = await Emprestimo.create({
                    livro_id,
                    estudante_id,
                    bibliotecario_id,
                    data_emprestimo: data_emprestimo || new Date(),
                    data_devolucao: data_devolucao || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias depois
                    status: status || 'ativo'
                });

                console.log('Empréstimo criado com sucesso. ID:', emprestimo.id);
                
                // Retorna o empréstimo com os dados do livro e estudante
                const emprestimoCompleto = await Emprestimo.findByPk(emprestimo.id, {
                    include: [
                        {
                            model: Livro,
                            as: 'livro',
                            attributes: ['uuid', 'titulo', 'autor']
                        },
                        {
                            model: Estudante,
                            as: 'estudante',
                            attributes: { 
                                exclude: ['senha'],
                                include: ['uuid', 'nome', 'matricula']
                            }
                        }
                    ]
                });

                console.log('Dados completos do empréstimo:', JSON.stringify(emprestimoCompleto, null, 2));
                return res.status(201).json(emprestimoCompleto);
                
            } catch (dbError) {
                console.error('Erro ao salvar no banco de dados:', dbError);
                
                // Verifica se é um erro de chave estrangeira
                if (dbError.name === 'SequelizeForeignKeyConstraintError') {
                    const field = dbError.fields && dbError.fields[0];
                    let message = 'Erro de chave estrangeira';
                    
                    if (field === 'estudante_id') message = 'ID do estudante não encontrado';
                    else if (field === 'livro_id') message = 'ID do livro não encontrado';
                    else if (field === 'bibliotecario_id') message = 'ID do bibliotecário não encontrado';
                    
                    return res.status(400).json({
                        error: message,
                        details: dbError.parent ? dbError.parent.detail : undefined,
                        suggestion: 'Verifique se os IDs fornecidos existem no banco de dados.'
                    });
                }
                
                throw dbError; // Repassa o erro para o bloco catch externo
            }

        } catch (error) {
            console.error('Erro detalhado ao criar empréstimo:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                ...(error.parent && { parent: error.parent })
            });
            
            return res.status(500).json({ 
                error: 'Erro ao criar empréstimo',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                suggestion: 'Verifique os dados fornecidos e tente novamente.'
            });
        }
    }

    async registrarDevolucao(req, res) {
        try {
            console.log('Iniciando registro de devolução...');
            const { id } = req.params;
            const { data_retorno } = req.body;

            console.log(`Buscando empréstimo com ID: ${id}`);
            const emprestimo = await Emprestimo.findByPk(id);
            
            if (!emprestimo) {
                console.error('Empréstimo não encontrado com ID:', id);
                return res.status(404).json({ 
                    error: 'Empréstimo não encontrado',
                    details: `Nenhum empréstimo encontrado com o ID: ${id}`
                });
            }

            console.log('Status atual do empréstimo:', emprestimo.status);
            console.log('Data de retorno atual:', emprestimo.data_retorno);

            if (emprestimo.status === 'concluído') {
                console.error('Este empréstimo já foi devolvido anteriormente');
                return res.status(400).json({ 
                    error: 'Este empréstimo já foi devolvido',
                    details: `Data da devolução: ${emprestimo.data_retorno}`
                });
            }

            // Atualiza a data de retorno e o status
            const dataDevolucao = data_retorno || new Date();
            console.log('Atualizando empréstimo com data de retorno:', dataDevolucao);
            
            await emprestimo.update({ 
                data_retorno: dataDevolucao,
                status: 'concluído'
            });

            // Atualiza o status do livro para disponível
            console.log('Atualizando status do livro para disponível...');
            const livro = await Livro.findByPk(emprestimo.livro_id);
            if (livro) {
                await livro.update({ status: 'disponivel' });
            }

            // Retorna o empréstimo atualizado com os dados do livro e estudante
            console.log('Buscando dados completos do empréstimo...');
            const emprestimoCompleto = await Emprestimo.findByPk(id, {
                include: [
                    {
                        model: Livro,
                        as: 'livro',
                        attributes: ['uuid', 'titulo', 'autor', 'status']
                    },
                    {
                        model: Estudante,
                        as: 'estudante',
                        attributes: { 
                            exclude: ['senha'],
                            include: ['uuid', 'nome', 'matricula']
                        }
                    }
                ]
            });

            console.log('Devolução registrada com sucesso');
            return res.status(200).json({
                message: 'Livro devolvido com sucesso',
                emprestimo: emprestimoCompleto
            });
            
        } catch (error) {
            console.error('Erro ao registrar devolução:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                ...(error.parent && { parent: error.parent })
            });
            
            return res.status(500).json({ 
                error: 'Erro ao registrar devolução',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                suggestion: 'Verifique o ID do empréstimo e tente novamente.'
            });
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