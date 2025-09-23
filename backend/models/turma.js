'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  Turmas.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    turno: {
      type: DataTypes.ENUM('matutino', 'verpertino', 'noturno'),
      allowNull: false,
    },
    serie : {
      type: DataTypes.ENUM('1ª serie', '2ª serie', '3ª serie', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'),
      allowNull: false,
    },
    ano: {
      type: DataTypes.INTEGER,
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
    sequelize,
    modelName: 'Turmas',
    tableName: 'turmas',
    timestamps: false,
  });
  return Turmas;
};