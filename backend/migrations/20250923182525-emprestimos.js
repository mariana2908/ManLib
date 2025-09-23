import { v7 as uuidv7 } from 'uuid';
'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('emprestimos', {
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('emprestimos');
}