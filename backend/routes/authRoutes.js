// File: backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { sendVerificationEmail } = require('../config/email');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateToken({ email }, '1h');
    await db.query(
      'INSERT INTO users (name, email, password, verification_token, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, verificationToken, 'user', new Date()]
    );

    const verificationLink = `http://localhost:5173/confirm-email?token=${verificationToken}&email=${email}`;
    await sendVerificationEmail(email, 'Verify Your RetailPoz Account', `Click here: ${verificationLink}`);

    res.json({ message: 'Registration successful. Check your email to verify.', verificationToken });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await comparePassword(password, user[0].password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });
    if (!user[0].email_verified_at) return res.status(400).json({ message: 'Email not verified' });

    const [storeUsers] = await db.query('SELECT store_location_id, role FROM store_users WHERE user_id = ?', [user[0].id]);
    const token = generateToken({ id: user[0].id, role: user[0].role || 'user', locationRoles: storeUsers });

    res.json({
      token,
      user: { id: user[0].id, email: user[0].email, name: user[0].name },
      redirectTo: '/status-dashboard' // Always to StatusDashboard
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/verify-email', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key');
    const { email } = decoded;
    const [user] = await db.query('SELECT * FROM users WHERE email = ? AND verification_token = ?', [email, token]);
    if (user.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

    await db.query('UPDATE users SET email_verified_at = ?, verification_token = NULL WHERE email = ?', [new Date(), email]);
    res.json({ message: 'Email verified successfully!', email });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

router.post('/resend-verification-email', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key');
    const { email } = decoded;
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ message: 'User not found' });
    if (user[0].email_verified_at) return res.status(400).json({ message: 'Email already verified' });

    const verificationToken = generateToken({ email }, '1h');
    await db.query('UPDATE users SET verification_token = ? WHERE email = ?', [verificationToken, email]);

    const verificationLink = `http://localhost:5173/confirm-email?token=${verificationToken}&email=${email}`;
    await sendVerificationEmail(email, 'Verify Your RetailPoz Account', `Click here: ${verificationLink}`);

    res.json({ message: 'Verification email resent successfully.' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

router.post('/update-email', async (req, res) => {
  const { email: newEmail, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key');
    const { email: oldEmail } = decoded;
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [oldEmail]);
    if (user.length === 0) return res.status(400).json({ message: 'User not found' });

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [newEmail]);
    if (existing.length > 0) return res.status(400).json({ message: 'New email already in use' });

    const verificationToken = generateToken({ email: newEmail }, '1h');
    await db.query('UPDATE users SET email = ?, verification_token = ? WHERE email = ?', [newEmail, verificationToken, oldEmail]);

    const verificationLink = `http://localhost:5173/confirm-email?token=${verificationToken}&email=${newEmail}`;
    await sendVerificationEmail(newEmail, 'Verify Your New RetailPoz Email', `Click here: ${verificationLink}`);

    res.json({ message: 'Email updated. Check your new email to verify.', token: verificationToken });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;