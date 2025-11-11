'use strict';

module.exports = (sequelize, DataTypes) => {
  const Turmas = sequelize.define('Turmas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    turno: {
      type: DataTypes.ENUM('matutino', 'verpertino', 'noturno'),
      allowNull: false
    },
    serie: {
      type: DataTypes.ENUM('1ª serie', '2ª serie', '3ª serie', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4'),
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Turmas',
    timestamps: false
  });

  Turmas.associate = (models) => {
    Turmas.hasMany(models.Estudantes, { foreignKey: 'turma_id', as: 'estudantes' });
  };

  return Turmas;
};