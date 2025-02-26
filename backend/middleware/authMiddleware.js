const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = process.env.JWT_SECRET || 'mySuperSecretKey123!@$?';

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

    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user[0];

    // Allow setup routes without subscription check
    const allowedSetupRoutes = ['/api/status/status', '/stores', '/subscriptions', '/update-subscription-end'];
    if (allowedSetupRoutes.includes(req.originalUrl)) {
      console.log(`Allowing access to ${req.originalUrl} for user:`, user[0].id);
      return next();
    }

    // Check subscription only if a plan exists (plan_id is not null) and not Free Demo
    if (user[0].plan_id !== null && user[0].plan_id !== 1) {
      if (!user[0].subscription_ends_at || new Date(user[0].subscription_ends_at) < new Date()) {
        console.log('Subscription expired for user:', user[0].id);
        return res.status(403).json({ message: 'Subscription expired' });
      }
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;