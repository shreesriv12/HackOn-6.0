import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function hasSmtpConfig() {
  return env.mail.host && env.mail.user && env.mail.pass;
}

export async function sendOtpEmail(email, code) {
  if (!hasSmtpConfig()) {
    console.log(`OTP for ${email}: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.port === 465,
    auth: {
      user: env.mail.user,
      pass: env.mail.pass,
    },
  });

  await transporter.sendMail({
    from: env.mail.from,
    to: email,
    subject: "Your Products Without a Second Chance OTP",
    text: `Your verification code is ${code}. It expires in ${env.otpExpiryMinutes} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Products Without a Second Chance</h2>
        <p>Your email verification code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
        <p>This code expires in ${env.otpExpiryMinutes} minutes.</p>
      </div>
    `,
  });

  console.log(`OTP email sent to ${email}`);
}
