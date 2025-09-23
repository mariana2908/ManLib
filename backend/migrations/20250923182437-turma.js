'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('turmas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nome: {
         type: Sequelize.STRING,
         allowNull: false,
       },
       codigo: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
       },
       turno: {
         type: Sequelize.ENUM('matutino', 'verpertino', 'noturno'),
         allowNull: false,
       },
       serie : {
         type: Sequelize.ENUM('1ª serie', '2ª serie', '3ª serie', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'),
         allowNull: false,
       },
       ano: {
         type: Sequelize.INTEGER,
         allowNull: false,
         validate: {
           isFourDigits(value) {
             if (!/^\d{4}$/.test(value)) {
               throw new Error('O ano deve ser um número de quatro dígitos.');
             }
           }
         }
      },
   })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('turmas');
  }
};