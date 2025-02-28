const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = process.env.JWT_SECRET || 'mySuperSuperSecretKey123!@$';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;

    const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = userRows[0];

    const allowedSetupRoutes = ['/api/status/status', '/stores', '/subscriptions', '/update-subscription-end'];
    if (allowedSetupRoutes.includes(req.originalUrl)) {
      console.log(`Allowing access to ${req.originalUrl} for user: ${req.user.id}`);
      return next();
    }

    if (req.user.plan_id !== null && req.user.plan_id !== 1) {
      const subscriptionEnd = req.user.subscription_ends_at ? new Date(req.user.subscription_ends_at) : null;
      if (!subscriptionEnd || subscriptionEnd < new Date()) {
        console.log('Subscription expired for user:', req.user.id);
        return res.status(403).json({ message: 'Subscription expired' });
      }
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired, please log in again' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;