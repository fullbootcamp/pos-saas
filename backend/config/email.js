

// File: backend/config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `RetailPoz <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
