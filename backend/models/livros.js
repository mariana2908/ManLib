'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  Livros.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      autor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genero: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      editora: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('disponivel', 'indisponivel'),
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Livros',
    tableName: 'livros',
    timestamps: false,
  });
  return Livros;
};