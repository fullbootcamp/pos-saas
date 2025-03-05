const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure this is at the top

class EmailService {
  static async sendVerificationEmail(to, subject, content, options = {}) {
    if (!process.env.MAIL_HOST || !process.env.MAIL_PORT || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
      throw new Error('Email configuration is missing in .env');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_ENCRYPTION === 'ssl',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      from: {
        address: process.env.MAIL_FROM_ADDRESS,
        name: process.env.MAIL_FROM_NAME,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS,
      to,
      subject,
      ...(options.contentType === 'text/html' ? { html: content } : { text: content }),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent to:', to);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send verification email: ' + error.message);
    }
  }
}

module.exports = EmailService;