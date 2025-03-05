const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();
const path = require('path');
const authenticate = require('./middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(helmet()); // Adds security headers

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-mfa-token'],
  credentials: true,
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const superadminRoutes = require('./routes/superadminRoutes');
const statusRoutes = require('./routes/statusRoutes');

// Serve static files and fallback route
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Mount routes with authentication
app.use('/api/auth', authRoutes);
app.use('/api/stores', authenticate, storeRoutes);
app.use('/api/subscriptions', authenticate, subscriptionRoutes);
app.use('/api/superadmin', authenticate, superadminRoutes);
app.use('/api/status', authenticate, statusRoutes);

const PORT = process.env.PORT || 5000;
// HTTPS setup (optional, requires SSL certificate)
const https = require('https');
const fs = require('fs');
if (process.env.NODE_ENV === 'production' && fs.existsSync('./ssl/key.pem') && fs.existsSync('./ssl/cert.pem')) {
  const privateKey = fs.readFileSync('./ssl/key.pem', 'utf8');
  const certificate = fs.readFileSync('./ssl/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, async () => {
    try {
      await pool.getConnection();
      console.log('MySQL connected successfully!');
      console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
      console.error('MySQL connection error:', error);
    }
  });
}

module.exports = app; // Export for testing