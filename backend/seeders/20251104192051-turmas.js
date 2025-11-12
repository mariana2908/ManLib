'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Turmas', [
      {
        id: 1,
        nome: 'Turma A',
        codigo: 'INFVESP1',
        turno: 'matutino',
        serie: '1ª serie',
        ano: 2024
      },
      {
        id: 2,
        nome: 'Turma B',
        codigo: 'INFVESP2',
        turno: 'vespertino',
        serie: '2ª serie',
        ano: 2024
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Turmas', null, {});
  }
};
