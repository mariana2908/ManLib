'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Bibliotecarios', 'role', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'bibliotecario'
});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Bibliotecarios', 'role');
  }
};
