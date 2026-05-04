// Arquivo: src/routes/profileRoutes.js

const express = require('express');
const router = express.Router();

// Importa o controlador que criamos
const profileController = require('../controllers/profileController');

// Rota para criar um novo perfil (POST /api/profiles)
router.post('/', profileController.create);

// Rota para buscar um perfil e seu currículo completo pelo ID (GET /api/profiles/:id)
router.get('/:id', profileController.getById);

module.exports = router;