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

    const verificationLink = `http://localhost:5173/email-verified?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validate Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header img { max-width: 150px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4B0082; color: white; text-decoration: none; border-radius: 5px; }
          .footer { font-size: 0.9em; color: #777; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="text-align: center;">
            <img src="https://retailpoz.com/logo.png" alt="RetailPoz Logo" /> <!-- Replace with actual logo URL or base64 -->
          </div>
          <h2>Validate Your Email</h2>
          <p>Hi ${email.split('@')[0]},</p>
          <p>Thank you for creating a RetailPoz account. Please click the button below to validate your email address:</p>
          <p style="text-align: center;text-color:white;">
            <a href="${verificationLink}" class="button">Confirm Your Email Here</a>
          </p>
          <p>If the button doesn’t work, copy and paste this URL into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>If you didn’t create a new account, please ignore this email and don’t click the link above.</p>
          <div class="footer">
            <p>Cheers,<br>The RetailPoz Crew<br>Your POS HQ, Somewhere Awesome<br>© 2025 RetailPoz Inc.</p>
            <p>Questions? Hit us at <a href="mailto:support@retailpoz.com">support@retailpoz.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `.trim();

    await emailService.sendVerificationEmail(email, 'Validate Your Email', emailHtml, { contentType: 'text/html' });

    console.log('Registration successful with email sent');
    return { message: 'Registration successful. Check your email to verify.', verificationToken };
  }

  // Other methods remain unchanged
}

module.exports = AuthService;