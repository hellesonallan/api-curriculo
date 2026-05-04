// Arquivo: src/routes/experienceRoutes.js

const express = require('express');
const router = express.Router();

// Importa o controlador de experiências
const experienceController = require('../controllers/experienceController');

// Rota para criar uma nova experiência (POST /api/experiences)
router.post('/', experienceController.create);

// Rota para listar todas as experiências (GET /api/experiences)
router.get('/', experienceController.getAll);

// Rota para buscar uma experiência específica pelo ID (GET /api/experiences/:id)
router.get('/:id', experienceController.getById);

// Rota para atualizar uma experiência existente (PUT /api/experiences/:id)
router.put('/:id', experienceController.update);

// Rota para deletar uma experiência (DELETE /api/experiences/:id)
router.delete('/:id', experienceController.delete);

module.exports = router;