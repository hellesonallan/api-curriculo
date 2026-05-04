const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carrega as variáveis do .env

if (!process.env.DATABASE_URL) {
  console.error("❌ ERRO: DATABASE_URL não encontrada no arquivo .env");
  process.exit(1);
}

// Cria a instância de conexão com o banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Mude para console.log se quiser ver as queries SQL no terminal
  
  // Esta configuração é OBRIGATÓRIA para bancos na nuvem como o NeonDB
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  }
});

// Testa a conexão apenas para garantir que está tudo certo
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((error) => {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  });

// Exporta a instância para ser usada pelos Models
module.exports = sequelize;