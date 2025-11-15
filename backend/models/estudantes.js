"use strict";

module.exports = (sequelize, DataTypes) => {
  const Estudantes = sequelize.define(
    'Estudantes',
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      matricula: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      turma_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
        allowNull: false
      },
      senhaTemporaria: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dataExpiracaoSenha: {
        type: DataTypes.DATE,
        allowNull: true
      },
      primeiroAcesso: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: 'Estudantes',
      timestamps: false
    }
  );

  Estudantes.associate = (models) => {
    Estudantes.belongsTo(models.Turmas, { foreignKey: 'turma_id', as: 'turma' });
  };

  return Estudantes;
};