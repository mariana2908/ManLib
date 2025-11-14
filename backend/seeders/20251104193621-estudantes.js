'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estudantes', [
      // Turma de ADM
      {
        nome: 'ALEXANDRE RANGEL DOS SANTOS',
        senha: 'mudar123',
        
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Estudantes', null, {});
  }
};
