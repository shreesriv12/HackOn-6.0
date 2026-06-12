import crypto from "node:crypto";
import { env } from "../config/env.js";

export function createOtp() {
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  return { code, expiresAt };
}
