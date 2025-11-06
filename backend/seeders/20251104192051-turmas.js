'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Turmas', [
      {
        nome: 'Turma A',
        codigo: 'INFVESP1',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2024
      },
      {
        nome: 'Turma B',
        codigo: 'INFVESP2',
        turno: 'verpertino',
        serie: '2ª serie',
        ano: 2024
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Turmas', null, {});
  }
};
