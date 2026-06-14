// =======================================================================
// BACKEND ENTRY POINT & INTEGRATION DEMO
// Filename: backend/index.js
// =======================================================================

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware stack for processing request bodies and security elements
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- MOCK OR SYSTEM DATABASE CONTEXT SETUP ---
// Creates a default mock PostgreSQL database connection module if real DB isn't running yet.
// In production, this imports the 'pg' module pool connections.
const { Pool } = require('pg');

// Setup standard PG pool mapping
const poolInstance = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cardealer'
});

// Cache connection state globally for listings router import
module.exports = poolInstance;

// --- DYNAMIC SECURITY & SESSION VALIDATOR MIDDLEWARE ---
app.use((req, res, next) => {
  // Extract token from standard authentication bearer header or secure cookie
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'CARVELLO_SECURE_TRUST_SECRET_KEY_2026';
    const decoded = jwt.verify(token, JWT_SECRET);
    // Bind session parameters { id, role, email } to request pipeline
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };
  } catch (error) {
    console.warn('[AUTH MONITOR] Invalid or expired authentication token presented.');
    req.user = null;
  }
  next();
});

// --- REGISTER HIGH-LEVEL MODULES ---
const listingsRouter = require('./routes/listings');
app.use('/api/listings', listingsRouter);

const inspectionsRouter = require('./routes/inspections');
app.use('/api/inspections', inspectionsRouter);

// --- SIMULATED TOKEN SIGNER FOR COMPREHENSIVE MULTI-ROLE TESTING ---
app.post('/api/auth/token', (req, res) => {
  const { id, role, email } = req.body;
  if (!id || !role || !email) {
    return res.status(400).json({ error: 'Missing session parameters to sign JWT.' });
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'CARVELLO_SECURE_TRUST_SECRET_KEY_2026';
    const token = jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token });
  } catch (err) {
    console.error('Error signing test JWT:', err);
    return res.status(500).json({ error: 'Failing to sign test JWT.' });
  }
});

// Catch-all health diagnostics loop
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// App server engine initialization
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CAR DEALER SERVER] Listening on port ${PORT}...`);
  });
}
