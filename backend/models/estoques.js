'use strict';

module.exports = (sequelize, DataTypes) => {
  const Estoques = sequelize.define('Estoques', {
    livro_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade_disponivel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade_emprestada: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'estoques',
    timestamps: false
  });

  Estoques.associate = (models) => {
    Estoques.belongsTo(models.Livros, { foreignKey: 'livro_id', as: 'livro' });
  };

  return Estoques;
};