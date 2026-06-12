import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createToken(user, mode) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      mode,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
}
