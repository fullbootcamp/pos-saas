// File: backend/routes/dashboardRoutes.js
const express = require('express');
const db = require('../config/db');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Protected dashboard route
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;

    console.log('🏠 Fetching dashboard for user:', user.id);

    // Fetch store details (optional, for POS context)
    const [store] = await db.query('SELECT id, name, slug, type FROM stores WHERE user_id = ?', [user.id]);
    const storeData = store.length > 0 ? {
      id: store[0].id,
      name: store[0].name,
      slug: store[0].slug,
      type: store[0].type,
    } : null;

    const response = {
      message: 'Welcome to the RetailPoz Dashboard',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      store: storeData,
    };

    console.log('✅ Dashboard data sent:', { userId: user.id, store: storeData ? storeData.slug : 'none' });

    res.json(response);
  } catch (error) {
    console.error('❌ Error fetching dashboard:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
});

module.exports = router;