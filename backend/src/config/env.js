import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.SECRET || process.env.JWT_SECRET || "dev-jwt-secret",
  adminRegistrationCode: process.env.ADMIN_REGISTRATION_CODE || "",
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 10),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  mail: {
    host: process.env.EMAIL_HOST || process.env.SMTP_HOST || (process.env.EMAIL_USER ? "smtp.gmail.com" : ""),
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.EMAIL_USER || process.env.SMTP_USER || "",
    pass: process.env.EMAIL_PASS || process.env.EMAIL_SECRET || process.env.SMTP_PASS || "",
    from:
      process.env.MAIL_FROM ||
      process.env.EMAIL_USER ||
      "Products Without a Second Chance <no-reply@pwsc.local>",
  },
};
