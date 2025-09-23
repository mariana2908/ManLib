'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Empretimos extends Model {
    static associate(models) {
        Empretimos.belongsTo(models.Livros, { foreignKey: 'livro_id', as: 'livro' });
        Empretimos.belongsTo(models.Bibliotecarios, { foreignKey: 'bibliotecario_id', as: 'bibliotecario' });
        Empretimos.belongsTo(models.Estudantes, { foreignKey: 'estudante_id', as: 'estudante' });
    }
  }
  Empretimos.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: uuidv7,
    },
    livro_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bibliotecario_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    estudante_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    data_emprestimo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_devolucao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_retorno: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ativo', 'atrasado', 'concluído'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Empretimos',
    tableName: 'empretimos',
    timestamps: false,
  });
  return Empretimos;
};