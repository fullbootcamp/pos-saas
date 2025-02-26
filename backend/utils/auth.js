// File: backend/utils/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

const generateToken = (payload, expiresIn = '1h') => 
  jwt.sign(payload, SECRET_KEY, { expiresIn });

const verifyToken = (token) => jwt.verify(token, SECRET_KEY);

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };