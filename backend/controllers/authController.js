const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    console.log('Entering register controller with body:', JSON.stringify(req.body, null, 2));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Controller validation errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array(), message: 'Validation failed [Version 2025-03-05]' });
    }
    try {
      console.log('Calling authService.register');
      const result = await authService.register(req.body.email, req.body.password, req.body.role);
      console.log('Registration successful, returning:', JSON.stringify(result, null, 2));
      res.json({ ...result, redirectTo: '/onboarding' });
    } catch (error) {
      console.error('Registration error:', error.stack); // Added stack trace
      res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(500).json({ errors: errors.array() }); // Changed to 500 for testing stack trace
    }
    const { email, password } = req.body;
    try {
      const result = await authService.login(email, password, req);
      res.json(result);
    } catch (error) {
      console.error('Login error:', error.stack); // Added stack trace
      if (error.message === 'Invalid password') {
        await authDao.incrementLoginAttempts(email);
        const lockout = await authDao.checkAccountLockout(email);
        if (lockout.login_attempts >= 5) {
          await authDao.lockAccount(email, 15 * 60);
        }
      }
      res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
  }

  static async verifyEmail(req, res) {
    const { token } = req.body;
    try {
      const result = await authService.verifyEmail(token);
      res.json({ ...result, redirectTo: '/onboarding' });
    } catch (error) {
      console.error('Verification error:', error.stack); // Added stack trace
      res.status(400).json({ message: 'Invalid or expired token', stack: error.stack });
    }
  }

  static async resendVerificationEmail(req, res) {
    const { token } = req.body;
    try {
      const result = await authService.resendVerificationEmail(token);
      res.json(result);
    } catch (error) {
      console.error('Resend error:', error.stack); // Added stack trace
      res.status(400).json({ message: 'Invalid or expired token', stack: error.stack });
    }
  }

  static async updateEmail(req, res) {
    const { email: newEmail, token } = req.body;
    try {
      const result = await authService.updateEmail(newEmail, token);
      res.json(result);
    } catch (error) {
      console.error('Update email error:', error.stack); // Added stack trace
      res.status(400).json({ message: 'Invalid or expired token', stack: error.stack });
    }
  }
}

module.exports = AuthController;