const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
  try {
    console.log('🚀 Running database migrations...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.query(sql);
    console.log('✅ Migrations feita com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migração falhou:', err.message);
    process.exit(1);
  }
}

runMigrations();
