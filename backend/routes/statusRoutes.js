// File: backend/routes/statusRoutes.js
const express = require('express');
const db = require('../config/db');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Get user status
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;

    console.log('📊 Fetching status for user:', user.id); // Adding your logging style

    // Fetch subscription details
    let subscription = null;
    if (user.plan_id) {
      const [subscriptionData] = await db.query(
        `SELECT s.*, p.name AS plan_name, p.price, p.interval 
         FROM subscriptions s
         JOIN plans p ON s.plan_id = p.id
         WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 1`,
        [user.id]
      );
      if (subscriptionData.length > 0) {
        subscription = {
          planId: subscriptionData[0].plan_id,
          planName: subscriptionData[0].plan_name,
          price: subscriptionData[0].price,
          interval: subscriptionData[0].interval,
          startsAt: subscriptionData[0].starts_at,
          endsAt: subscriptionData[0].ends_at,
          isAutoRenew: subscriptionData[0].is_auto_renew || false,
        };
      }
    }

    // Build status object
    const status = {
      userName: user.name || 'User',
      registration: true,
      emailVerified: !!user.email_verified_at,
      storeSetup: !!user.store_id,
      planSelected: !!user.plan_id,
      dashboardCreated: !!user.store_id,
      subscription,
      planId: user.plan_id,
      trialEndsAt: user.trial_ends_at || null, // CamelCase for consistency
      subscriptionEndsAt: user.subscription_ends_at || null,
    };

    console.log('✅ Status fetched:', status);

    res.json({ status });
  } catch (error) {
    console.error('❌ Error fetching status:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined, // Matching storeRoutes
    });
  }
});

module.exports = router;