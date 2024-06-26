import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationUrl = `https://86ff-2001-8a0-dd94-bf01-da3a-ddff-fee0-61fa.ngrok-free.app/api/verify-email/${token}`;
  const html = `
    <h1>Email Verification</h1>
    <p>Please verify your email by clicking on the link below:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });

    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const sendPasswordResetEmail = async (to, token) => {
  const subject = 'Password Reset';
  const html = `
    <h1>Password Reset</h1>
    <p>To reset your password, use the following token:</p>
    <p><strong>${token}</strong></p>
    <p>This token is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };
