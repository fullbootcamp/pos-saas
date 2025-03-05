const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const otplib = require('otplib');
const authenticate = require('../middleware/authMiddleware');

router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url} [Version 2025-03-05]`);
  next();
});

router.post('/register', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
  body('role').equals('owner').withMessage('Role must be "owner"'),
], (req, res, next) => {
  console.log('Received request body:', JSON.stringify(req.body, null, 2));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({ errors: errors.array(), message: 'Validation failed [Version 2025-03-05]' });
  }
  console.log('Validation passed, proceeding to controller');
  next();
}, authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);

router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification-email', authController.resendVerificationEmail);
router.post('/update-email', authController.updateEmail);
router.post('/setup-mfa', authenticate, async (req, res) => {
  try {
    const secret = otplib.authenticator.generateSecret();
    await authDao.updateMfaSecret(req.user.user_id, secret);
    const otpauthUrl = otplib.authenticator.keyuri(req.user.email, 'RetailPoz', secret);
    res.json({ secret, otpauthUrl, message: 'Scan this QR code with your authenticator app' });
  } catch (error) {
    console.error('MFA setup error:', error.stack); // Added stack trace
    res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
});
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = await tokenService.verifyToken(refreshToken, '7d');
    const user = await authDao.findUserById(decoded.id);
    if (!user) throw new Error('Invalid refresh token');

    const newAccessToken = await tokenService.generateToken({ id: user.user_id, role: user.role || 'owner' });
    const newRefreshToken = await tokenService.generateToken({ id: user.user_id }, '7d');
    await authDao.storeRefreshToken(user.user_id, newRefreshToken);

    res.json({ accessToken: newAccessToken, redirectTo: user.role === 'owner' && !user.store_id ? '/onboarding' : '/status-dashboard' });
  } catch (error) {
    console.error('Refresh token error:', error.stack); // Added stack trace
    res.status(401).json({ message: 'Invalid refresh token', error: error.message, stack: error.stack });
  }
});

module.exports = router;