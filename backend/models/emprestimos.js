'use strict';
const { v7: uuidv7 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Emprestimos = sequelize.define('Emprestimos', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv7
    },
    livro_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    bibliotecario_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    estudante_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    data_emprestimo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_devolucao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_retorno: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ativo', 'atrasado', 'concluído'),
      allowNull: false
    }
  }, {
    tableName: 'Emprestimos',
    timestamps: false,
    freezeTableName: true
  });

  Emprestimos.associate = (models) => {
    Emprestimos.belongsTo(models.Livros, { foreignKey: 'livro_id', as: 'livro' });
    Emprestimos.belongsTo(models.Bibliotecarios, { foreignKey: 'bibliotecario_id', as: 'bibliotecario' });
    Emprestimos.belongsTo(models.Estudantes, { foreignKey: 'estudante_id', as: 'estudante' });
  };

  // Validação: antes de criar, checar limite de empréstimos ativos do estudante
  Emprestimos.addHook('beforeCreate', async (emprestimos, options) => {
    try {
      const EmprestimoModel = emprestimos.sequelize.models.Emprestimos;
      const limite = parseInt(process.env.LIMITE_EMPRESTIMOS_POR_ESTUDANTE, 10) || 5; // suposição: 5 por padrão
      if (EmprestimoModel) {
        const ativos = await EmprestimoModel.count({
          where: {
            estudante_id: emprestimos.estudante_id,
            status: ['ativo', 'atrasado']
          }
        });

        if (ativos >= limite) {
          const err = new Error('Limite de empréstimos ativos atingido para este estudante');
          err.name = 'LimiteEmprestimosError';
          throw err;
        }
      }
    } catch (err) {
      // Repassa o erro para que a criação seja abortada
      throw err;
    }
  });

  // Hooks para atualizar status do livro quando empréstimo é criado ou devolvido
  Emprestimos.addHook('afterCreate', async (Emprestimos, options) => {
    try {
      const Livro = Emprestimos.sequelize.models.Livros;
      if (Livro) {
        await Livro.update({ status: 'indisponivel' }, { where: { uuid: Emprestimos.livro_id } });

        // Atualiza o estoque: incrementa quantidade_emprestada e decrementa quantidade_disponivel
        try {
          const Estoque = Emprestimos.sequelize.models.Estoques;
          if (Estoque) {
            await Estoque.increment('quantidade_emprestada', { by: 1, where: { livro_id: Emprestimos.livro_id } });
            // decrementa quantidade_disponivel se a coluna existir
            try {
              await Estoque.decrement('quantidade_disponivel', { by: 1, where: { livro_id: Emprestimos.livro_id } });
            } catch (decErr) {
              console.warn('Não foi possível decrementar quantidade_disponivel:', decErr.message || decErr);
            }
          }
        } catch (incErr) {
          console.warn('Erro ao atualizar estoque no afterCreate:', incErr.message || incErr);
        }
      }
    } catch (err) {
      console.error('Erro no hook afterCreate Emprestimo:', err);
    }
  });

  Emprestimos.addHook('afterUpdate', async (Emprestimos, options) => {
    try {
      const Livro = Emprestimos.sequelize.models.Livro;
      if (Livro) {
        // Se o empréstimo foi concluído (data_retorno preenchida ou status concluído), marca o livro como disponível
        if (Emprestimos.data_retorno || Emprestimos.status === 'concluído') {
          await Livro.update({ status: 'disponivel' }, { where: { uuid: Emprestimos.livro_id } });

          // Atualiza o estoque
          try {
            const Estoque = Emprestimos.sequelize.models.Estoque;
            if (Estoque) {
              await Estoque.decrement('quantidade_emprestada', { by: 1, where: { livro_id: Emprestimos.livro_id } });
              try {
                await Estoque.increment('quantidade_disponivel', { by: 1, where: { livro_id: Emprestimos.livro_id } });
              } catch (incErr) {
                console.warn('Não foi possível incrementar quantidade_disponivel:', incErr.message || incErr);
              }
            }
          } catch (estoqueErr) {
            console.warn('Erro ao atualizar estoque no afterUpdate:', estoqueErr.message || estoqueErr);
          }

          // Atualiza estatísticas quando o empréstimo é concluído
          try {
            // Se houver atraso, registra na quantidade de empréstimos atrasados
            const dataRetorno = new Date(Emprestimos.data_retorno);
            const dataDevolucao = new Date(Emprestimos.data_devolucao);
            const atrasado = dataRetorno > dataDevolucao;

            // Atualiza o status do empréstimo se estiver atrasado
            if (atrasado && Emprestimos.status !== 'atrasado') {
              await Emprestimos.update({ status: 'atrasado' }, { transaction: options.transaction });
            }
          } catch (statsErr) {
            console.warn('Erro ao atualizar estatísticas:', statsErr.message || statsErr);
          }
        }
      }
    } catch (err) {
      console.error('Erro no hook afterUpdate Emprestimo:', err);
    }
  });

  return Emprestimos;
};