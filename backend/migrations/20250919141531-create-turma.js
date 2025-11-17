'use strict';
import { Sequelize } from 'sequelize';

export default {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('Turmas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      código: {
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
    }, {
      timestamps: false,
      tableName: 'Turmas',
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Turmas');
  }
};
