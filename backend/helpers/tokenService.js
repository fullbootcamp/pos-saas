const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
  static generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, process.env.JWT_SECRET || 'mySuperSuperSecretKey123!@$', { expiresIn });
  }

  static async verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'mySuperSuperSecretKey123!@$');
  }
}

module.exports = TokenService;