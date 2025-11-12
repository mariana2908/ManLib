'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estudantes', [
      {
        uuid: '550e8400-e29b-41d4-a716-446655440003',
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        senha: bcrypt.hashSync('joao123', bcrypt.genSaltSync(10)),
        matricula: '2024001',
        turma_id: 1,
        status: 'ativo'
      },
      {
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        senha: bcrypt.hashSync('maria123', bcrypt.genSaltSync(10)),
        matricula: '2024002',
        turma_id: 2,
        status: 'ativo'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Estudantes', null, {});
  }
};
