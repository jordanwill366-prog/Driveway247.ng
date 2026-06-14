// =======================================================================
// POSTGRESQL POOL connection config
// Filename: backend/db/index.js
// =======================================================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cardealer'
});

// Log connections or failures for diagnostic tracing
pool.on('connect', () => {
  console.log('[PostgreSQL] New secure client checked out from pool.');
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected database pool client failure:', err);
});

module.exports = pool;
