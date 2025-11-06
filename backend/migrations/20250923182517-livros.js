'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Livros', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      autor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genero: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      editora: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isbn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('disponivel', 'indisponivel'),
        allowNull: false,
      },
    });

    // Adiciona índices para buscas frequentes
    await queryInterface.addIndex('Livros', ['status'], {
      name: 'idx_livros_status'
    });
    await queryInterface.addIndex('Livros', ['isbn'], {
      name: 'idx_livros_isbn'
    });
    await queryInterface.addIndex('Livros', ['titulo'], {
      name: 'idx_livros_titulo'
    });
    await queryInterface.addIndex('Livros', ['autor'], {
      name: 'idx_livros_autor'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Livros');
  }
};