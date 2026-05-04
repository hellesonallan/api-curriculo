// Arquivo: src/controllers/profileController.js

// Importamos os modelos que vamos precisar
const Profile = require('../models/Profile');
const Experience = require('../models/Experience');
// Se tivesse Education e Skill, importaria aqui também!

module.exports = {
  // Criar um novo perfil
  async create(req, res) {
    try {
      const profile = await Profile.create(req.body);
      return res.status(201).json(profile);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar perfil", details: error.message });
    }
  },

  // Buscar um perfil específico com todo o currículo atrelado (Eager Loading)
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const profile = await Profile.findByPk(id, {
        include: [
          { model: Experience } // Traz as experiências daquele perfil
          // { model: Education }, 
          // { model: Skill }
        ]
      });
      
      if (!profile) {
        return res.status(404).json({ error: "Perfil não encontrado." });
      }
      
      return res.json(profile);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar perfil", details: error.message });
    }
  }
};