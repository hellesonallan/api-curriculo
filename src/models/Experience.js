// Arquivo: src/models/Experience.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa a mesma conexão

const Experience = sequelize.define('Experience', {
  company: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  startDate: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  endDate: { 
    type: DataTypes.DATE,
    allowNull: true // Permitimos nulo, pois significa que é o seu emprego atual
  },
  description: { 
    type: DataTypes.TEXT 
  }
});

module.exports = Experience;