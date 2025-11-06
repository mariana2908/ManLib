'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Estoques', {
      livro_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantidade_disponivel: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantidade_emprestada: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Estoques');
  }
};