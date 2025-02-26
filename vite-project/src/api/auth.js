import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js'; // Import the CommonJS module using .js extension

const router = express.Router();

// Nodemailer transporter setup (SECURELY store credentials - env variables!)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email service
  auth: {
    user: process.env.EMAIL_USER, // From environment variables
    pass: process.env.EMAIL_PASSWORD, // From environment variables
  },
});

interface LoginResponse {
  message: string;
  token?: string;
  user?: { id: number; email: string; /* ... other user properties (NO PASSWORD) */ };
}

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    await db.query(
      'INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)',
      [email, hashedPassword, verificationToken]
    );

    const verificationLink = `http://localhost:5000/api/auth/verify?token=${verificationToken}`; // Or your frontend URL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    });

    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Verify email
router.get('/verify', async (req, res) => {
  const { token } = req.query;

  try {
    const [user] = await db.query('SELECT * FROM users WHERE verification_token = ?', [token]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    await db.query(
      'UPDATE users SET email_verified_at = NOW(), verification_token = NULL WHERE id = ?',
      [user[0].id]
    );

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
});

// Log in a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user[0].email_verified_at) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use env variable!

    const response: LoginResponse = { message: 'Login successful', token, user: { id: user[0].id, email: user[0].email } }; // Create the typed response
    res.status(200).json(response);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;