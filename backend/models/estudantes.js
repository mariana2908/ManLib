'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Estudantes extends Model {
    static associate(models) {
        Estudantes.belongsTo(models.Turmas, { foreignKey: 'turma_id', as: 'turma' });
    }
  }
  Estudantes.init({
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
        unique: true,
      },
      matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      turma_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Estudantes',
    tableName: 'estudantes',
    timestamps: false,
  });
  return Estudantes;
};