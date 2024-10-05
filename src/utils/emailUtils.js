/*
disclaimer!!! the content of this file are GPT generated, having issue finding open source tool to send mails 

*/

const nodemailer = require('nodemailer');
// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password
  },
});

// Function to send the OTP
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Verification OTP',
    text: `Your verification code is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `To reset your password, click the following link: ${resetLink}`,
  };

  return transporter.sendMail(mailOptions);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

module.exports = { 
  sendVerificationEmail, 
  generateOTP, 
  sendPasswordResetEmail 
};
