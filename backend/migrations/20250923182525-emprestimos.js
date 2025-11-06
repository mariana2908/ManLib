import { v7 as uuidv7 } from 'uuid';
'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Emprestimos', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv7,
    },
    livro_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    bibliotecario_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    estudante_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    data_emprestimo: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    data_devolucao: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    data_retorno: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM('ativo', 'atrasado', 'concluído'),
      allowNull: false,
    },
  });

  // Adiciona índices para consultas frequentes
  await queryInterface.addIndex('Emprestimos', ['status'], {
    name: 'idx_emprestimos_status'
  });
  await queryInterface.addIndex('Emprestimos', ['data_emprestimo'], {
    name: 'idx_emprestimos_data_emp'
  });
  await queryInterface.addIndex('Emprestimos', ['data_devolucao'], {
    name: 'idx_emprestimos_data_dev'
  });
  await queryInterface.addIndex('Emprestimos', ['estudante_id', 'status'], {
    name: 'idx_emprestimos_estudante_status'
  });
  await queryInterface.addIndex('Emprestimos', ['livro_id', 'status'], {
    name: 'idx_emprestimos_livro_status'
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Emprestimos');
}