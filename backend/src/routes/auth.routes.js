import { Router } from "express";
import multer from "multer";
import {
  login,
  me,
  register,
  resendOtp,
  updateProfile,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/profile", requireAuth, upload.single("profilePhoto"), updateProfile);
