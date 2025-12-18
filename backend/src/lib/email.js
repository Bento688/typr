import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: '"Typr Support" <' + process.env.EMAIL_USER + ">",
      to: email,
      subject: "Verify your Typr Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Typr!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
          <p>This code expires in 15 minutes.</p>
        </div>
      `,
    });
    console.log("Verification email sent to:", email);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};
