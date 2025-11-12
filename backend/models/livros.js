'use strict';

module.exports = (sequelize, DataTypes) => {
  const Livros = sequelize.define('Livros', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editora: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('disponivel', 'indisponivel'),
      allowNull: false
    }
  }, {
    tableName: 'Livros',
    timestamps: false,
    freezeTableName: true
  });

  Livros.associate = (models) => {
    Livros.hasOne(models.Estoques, { foreignKey: 'livro_id', as: 'estoque' }); 
  };

  return Livros;
};