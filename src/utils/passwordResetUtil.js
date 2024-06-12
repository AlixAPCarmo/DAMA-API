import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (to, token) => {
  const subject = "Password Reset Request";
  const resetUrl = `https://86ff-2001-8a0-dd94-bf01-da3a-ddff-fee0-61fa.ngrok-free.app/api/reset-password/${token}`;
  const html = `
    <h1>Password Reset Request</h1>
    <p>You have requested to reset your password. Click the link below to proceed:</p>
    <a href="${resetUrl}">Reset Password</a>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });

    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export { sendPasswordResetEmail };