// Arquivo: src/models/Profile.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa a nossa conexão com o NeonDB

const Profile = sequelize.define('Profile', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false // Nome é obrigatório
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false // Cargo atual é obrigatório
  },
  bio: { 
    type: DataTypes.TEXT // TEXT permite textos bem mais longos que STRING
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true // Não permite dois currículos com o mesmo email
  },
  github: { 
    type: DataTypes.STRING 
  },
  linkedin: { 
    type: DataTypes.STRING 
  }
});

module.exports = Profile;