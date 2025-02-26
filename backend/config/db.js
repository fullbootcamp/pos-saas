// File: backend/config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Centralized pool config with all env vars
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1); // Crash if DB fails (fail-fast for dev)
  } else {
    console.log('MySQL connected successfully!');
    connection.release();
  }
});

// Handle connection errors and reconnect
pool.on('error', (err) => {
  console.error('MySQL pool error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect...');
    // Pool auto-reconnects, no manual retry needed
  } else {
    throw err; // Other errors crash the app
  }
});

// Export promise-based pool for async/await
module.exports = pool.promise();