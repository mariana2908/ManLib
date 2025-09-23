'use strict';

export default (sequelize, DataTypes) => {
  Bibliotecarios.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Bibliotecarios',
    tableName: 'bibliotecarios',
    timestamps: false,
  });
  return Bibliotecarios;
};