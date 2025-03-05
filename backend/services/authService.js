const authDao = require('../dao/authDao');
const tokenService = require('../helpers/tokenService');
const passwordService = require('../helpers/passwordService');
const emailService = require('../helpers/emailService');

class AuthService {
  static async register(email, password, role = 'owner') {
    const userExists = await authDao.findUserByEmail(email);
    if (userExists) throw new Error('User already exists');

    const hashedPassword = await passwordService.hashPassword(password);
    const verificationToken = await tokenService.generateToken({ email, role }, '1h');
    const userId = await authDao.createUser(email, hashedPassword, verificationToken, role);

    const verificationLink = `http://localhost:5173/confirm-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    await emailService.sendVerificationEmail(email, 'Verify Your RetailPoz Account', `Click here to verify your account: ${verificationLink}`);

    console.log('Registration successful with email sent');
    return { message: 'Registration successful. Check your email to verify.', verificationToken };
  }

  // Other methods remain unchanged
}

module.exports = AuthService;