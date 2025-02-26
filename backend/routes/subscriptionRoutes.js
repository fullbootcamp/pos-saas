// File: backend/routes/subscriptionRoutes.js
const express = require('express');
const db = require('../config/db');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;
  try {
    const plans = {
      1: { name: 'Free Demo', price: 0, interval: '7 days', durationDays: 7 },
      2: { name: 'Monthly', price: 19.99, interval: '30 days', durationDays: 30 },
      3: { name: 'Yearly', price: 119.99, interval: '365 days', durationDays: 365 },
    };

    if (!plans[planId]) return res.status(400).json({ message: 'Invalid plan ID' });

    const [user] = await db.query('SELECT plan_id, trial_ends_at FROM users WHERE id = ?', [userId]);
    if (planId === 1 && user[0].plan_id === 1 && user[0].trial_ends_at) {
      return res.status(403).json({ message: 'Already on Free Demo trial.' });
    }

    const plan = plans[planId];
    const startsAt = new Date();
    const endsAt = new Date(startsAt);
    endsAt.setDate(startsAt.getDate() + plan.durationDays);

    await db.query('INSERT INTO subscriptions (user_id, plan_id, starts_at, ends_at) VALUES (?, ?, ?, ?)', 
      [userId, planId, startsAt, endsAt]);

    if (planId === 1) {
      await db.query('UPDATE users SET plan_id = ?, trial_ends_at = ?, subscription_ends_at = NULL WHERE id = ?', 
        [planId, endsAt, userId]);
    } else {
      await db.query('UPDATE users SET plan_id = ?, trial_ends_at = NULL WHERE id = ?', [planId, userId]);
    }

    res.status(201).json({ message: 'Plan selected successfully!' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/update-subscription-end', authenticate, async (req, res) => {
  const { endsAt } = req.body;
  const userId = req.user.id;
  try {
    await db.query('UPDATE users SET subscription_ends_at = ? WHERE id = ?', [endsAt, userId]);
    res.status(200).json({ message: 'Subscription end updated' });
  } catch (error) {
    console.error('Update subscription end error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;