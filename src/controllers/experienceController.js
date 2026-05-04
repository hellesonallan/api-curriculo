// Arquivo: src/controllers/experienceController.js

const Experience = require('../models/Experience');

module.exports = {
  // 1. CREATE - Adicionar uma nova experiência
  async create(req, res) {
    try {
      // O req.body já deve conter o "ProfileId" para vincular ao perfil correto
      const experience = await Experience.create(req.body);
      return res.status(201).json(experience);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar experiência", details: error.message });
    }
  },

  // 2. READ ALL - Listar todas as experiências (opcional, útil para painéis de admin)
  async getAll(req, res) {
    try {
      const experiences = await Experience.findAll();
      return res.json(experiences);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar experiências", details: error.message });
    }
  },

  // 3. READ ONE - Buscar uma experiência específica pelo ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const experience = await Experience.findByPk(id);
      
      if (!experience) {
        return res.status(404).json({ error: "Experiência não encontrada." });
      }
      
      return res.json(experience);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar experiência", details: error.message });
    }
  },

  // 4. UPDATE - Atualizar dados de uma experiência
  async update(req, res) {
    try {
      const { id } = req.params;
      const experience = await Experience.findByPk(id);
      
      if (!experience) {
        return res.status(404).json({ error: "Experiência não encontrada para atualizar." });
      }
      
      // Atualiza os dados no banco
      await experience.update(req.body);
      return res.json(experience);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar experiência", details: error.message });
    }
  },

  // 5. DELETE - Excluir uma experiência
  async delete(req, res) {
    try {
      const { id } = req.params;
      const experience = await Experience.findByPk(id);
      
      if (!experience) {
        return res.status(404).json({ error: "Experiência não encontrada para exclusão." });
      }

      await experience.destroy();
      return res.status(204).send(); // 204 = No Content (Deletado com sucesso, sem nada a retornar)
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar experiência", details: error.message });
    }
  }
};