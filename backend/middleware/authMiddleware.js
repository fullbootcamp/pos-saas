const tokenService = require('../helpers/tokenService');
const authDao = require('../dao/authDao');
const rateLimit = require('express-rate-limit');
const otplib = require('otplib');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const authenticate = async (req, res, next) => {
  await limiter(req, res, async () => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

    try {
      const decoded = await tokenService.verifyToken(token);
      req.userId = decoded.id;

      const user = await authDao.findUserById(decoded.id);
      if (!user) {
        console.log('User not found for id:', decoded.id);
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;

      if (user.two_factor_enabled) {
        const totp = otplib.authenticator.generate(user.two_factor_secret);
        const mfaToken = req.headers['x-mfa-token'];
        if (!mfaToken || !otplib.authenticator.check(mfaToken, user.two_factor_secret)) {
          return res.status(401).json({ message: 'MFA required or invalid MFA token' });
        }
      }

      const allowedSetupRoutes = ['/api/status/status', '/stores', '/subscriptions', '/update-subscription-end', '/api/status'];
      if (allowedSetupRoutes.includes(req.originalUrl)) {
        console.log(`Allowing access to ${req.originalUrl} for user: ${req.user.user_id}`);
        return next();
      }

      if (req.user.plan_id !== null && req.user.plan_id !== 1) {
        const subscriptionEnd = req.user.end_date ? new Date(req.user.end_date) : null;
        if (!subscriptionEnd || subscriptionEnd < new Date()) {
          console.log('Subscription expired for user:', req.user.user_id);
          return res.status(403).json({ message: 'Subscription expired' });
        }
      }

      const lockout = await authDao.checkAccountLockout(req.user.user_id);
      if (lockout.login_attempts >= 5) {
        await authDao.lockAccount(req.user.user_id, 15 * 60);
        return res.status(403).json({ message: 'Account locked. Try again later.' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token expired, please log in again' });
      }
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  });
};

module.exports = authenticate;