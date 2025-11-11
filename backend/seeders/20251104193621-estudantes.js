'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estudantes', [
      {
        uuid: '550e8400-e29b-41d4-a716-446655440003',
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        senha: '$2b$10$vOZYly.YecuKKyqD5K328O/BBassorgoDtSVj2VB/LXMrbsWUfrAu', // senha: senha123
        matricula: '2024001',
        turma_id: 1,
        status: 'ativo'
      },
      {
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        senha: '$2b$10$IO/wS1p4fy.aylb2WMjLlePDCq5xYAO58Qu0e6i1rEUytyVNdqfWC', // senha: senha456
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
