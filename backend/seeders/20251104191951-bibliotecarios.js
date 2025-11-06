'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Bibliotecarios', [
      {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Admin',
        email: 'admin@example.com',
        senha: 'alpine',
        telefone: '123456789',
        status: 'ativo',
        role: 'admin'
      },
      {
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        nome: 'Bibliotecario1',
        email: 'bibliotecario1@example.com',
        senha: 'mudar123',
        telefone: '987654321',
        status: 'ativo',
        role: 'bibliotecario'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bibliotecarios', null, {});
  }
};
