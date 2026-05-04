// Arquivo: index.js (na raiz do projeto)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos a conexão e os modelos do nosso arquivo central (isso faz as amarrações do banco)
const { sequelize } = require('./src/models'); 

// Importamos as nossas rotas
const profileRoutes = require('./src/routes/profileRoutes');
const experienceRoutes = require('./src/routes/experienceRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// REGISTRO DE ROTAS
// ==========================================
// Aqui dizemos: "Toda vez que a URL começar com /api/profiles, use este arquivo de rotas"
app.use('/api/profiles', profileRoutes);
app.use('/api/experiences', experienceRoutes);


// ==========================================
// INICIALIZAÇÃO DO SERVIDOR E BANCO DE DADOS
// ==========================================
const PORT = process.env.PORT || 3000;

// Sincroniza o banco de dados e DEPOIS liga o servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Tabelas sincronizadas no NeonDB!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro fatal ao sincronizar o banco:', error);
  });