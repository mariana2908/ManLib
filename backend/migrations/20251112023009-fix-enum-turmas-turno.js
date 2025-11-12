'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primeiro, alteramos a coluna para um tipo temporário
    await queryInterface.sequelize.query(`
      ALTER TABLE "Turmas" 
      ALTER COLUMN "turno" TYPE TEXT;
    `);

    // Depois, removemos o tipo ENUM antigo
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Turmas_turno";
    `);

    // Criamos um novo tipo ENUM com os valores corretos
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Turmas_turno" AS ENUM ('matutino', 'vespertino', 'noturno');
    `);

    // E finalmente alteramos a coluna de volta para o tipo ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE "Turmas" 
      ALTER COLUMN "turno" TYPE "enum_Turmas_turno" 
      USING ("turno"::text::"enum_Turmas_turno");
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Em caso de rollback, mantemos o tipo ENUM corrigido
    // pois não queremos voltar para o estado incorreto
  }
};