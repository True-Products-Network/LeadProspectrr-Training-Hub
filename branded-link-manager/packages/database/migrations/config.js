require('dotenv').config({ path: '../.env.database' });

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  migrationsTable: 'pgmigrations',
  dir: '.',
  direction: 'up',
  count: Infinity,
  timestamp: true,
};
