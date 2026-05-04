// Arquivo: src/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ==========================================
// IMPORTAÇÕES (Caminhos Corrigidos)
// Como estamos dentro da pasta 'src', procuramos os arquivos vizinhos usando './'
// ==========================================
const { sequelize } = require('./models'); 
const profileRoutes = require('./routes/profileRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // Permite o Express entender JSON

// ==========================================
// REGISTRO DE ROTAS
// ==========================================
app.use('/api/profiles', profileRoutes);
app.use('/api/experiences', experienceRoutes);

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR E BANCO DE DADOS
// ==========================================
const PORT = process.env.PORT || 3000;

// Sincroniza as tabelas com o NeonDB e, se der certo, liga o servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Tabelas sincronizadas no NeonDB!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro fatal ao sincronizar o banco de dados:', error);
  });