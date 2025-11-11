'use strict';

module.exports = (sequelize, DataTypes) => {
  const Bibliotecarios = sequelize.define('Bibliotecarios', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo'),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'bibliotecario'
    }
  }, {
    tableName: 'Bibliotecarios',
    timestamps: false
  });

  Bibliotecarios.associate = (models) => {
    // adicionar associações se necessário
  };

  return Bibliotecarios;
};