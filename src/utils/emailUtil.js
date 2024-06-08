import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  const verificationUrl = `${process.env.BASE_URL}/verify-email/${token}`;
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

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export { sendVerificationEmail };
