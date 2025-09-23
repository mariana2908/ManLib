'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bibliotecarios', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bibliotecarios');
  }
};