'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Estoques extends Model {
    static associate(models) {
        Estoques.belongsTo(models.Livros, { foreignKey: 'livro_id', as: 'livro' });
    }
  }
  Estoques.init({
    livro_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantidade_disponivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantidade_emprestada: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Estoques',
    tableName: 'estoques',
    timestamps: false,
  });
  return Estoques;
};