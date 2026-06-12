import bcrypt from "bcryptjs";
import { createOtp } from "../utils/otp.js";
import { createToken } from "../utils/tokens.js";
import { toUserDto } from "../utils/user.dto.js";
import { sendOtpEmail } from "../services/mail.service.js";
import { uploadProfilePhoto } from "../services/cloudinary.service.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

const allowedRoles = ["user", "seller", "admin"];

export async function register(req, res) {
  try {
    const { name, email, password, phone, role = "user", adminCode = "" } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Name, email, password, and phone are required" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (role === "admin" && env.adminRegistrationCode && adminCode !== env.adminRegistrationCode) {
      return res.status(403).json({ message: "Invalid admin registration code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const { code, expiresAt } = createOtp();
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      otpCode: code,
      otpExpiresAt: expiresAt,
    });

    await sendOtpEmail(user.email, code);

    res.status(201).json({
      message: `${roleLabel(role)} registration started. Verify the OTP sent to your email.`,
      email: user.email,
      role,
      nextStep: "verify-email-otp",
      demoOtp: process.env.NODE_ENV === "production" ? undefined : code,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = createToken(user);
    res.json({
      message: "Email verified",
      token,
      user: toUserDto(user),
      redirectTo: roleHome(user.role),
      dashboardTitle: roleTitle(user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
}

export async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { code, expiresAt } = createOtp();
    user.otpCode = code;
    user.otpExpiresAt = expiresAt;
    await user.save();
    await sendOtpEmail(user.email, code);

    res.json({
      message: "OTP resent",
      demoOtp: process.env.NODE_ENV === "production" ? undefined : code,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not resend OTP", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before login" });
    }

    const token = createToken(user);
    res.json({
      token,
      user: toUserDto(user),
      redirectTo: roleHome(user.role),
      dashboardTitle: roleTitle(user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}

export async function me(req, res) {
  res.json({ user: toUserDto(req.user) });
}

export async function updateProfile(req, res) {
  try {
    const photoUrl = await uploadProfilePhoto(req.file);
    const interests = parseList(req.body.sustainabilityInterests);

    req.user.profile = {
      ...req.user.profile,
      photoUrl: photoUrl || req.user.profile?.photoUrl,
      location: {
        label: req.body.location || req.user.profile?.location?.label || "",
        lat: req.body.lat ? Number(req.body.lat) : req.user.profile?.location?.lat,
        lng: req.body.lng ? Number(req.body.lng) : req.user.profile?.location?.lng,
      },
      clothingSize: req.body.clothingSize || "",
      shoeSize: req.body.shoeSize || "",
      preferences: req.body.preferences || "",
      sustainabilityInterests: interests,
      onboardingCompleted: true,
    };

    await req.user.save();

    res.json({
      message: "Profile setup complete",
      user: toUserDto(req.user),
      onboardingTour: [
        "Here's how to list a product",
        "Here's how returns work",
        "Here's how you earn rewards",
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
}

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function roleHome(role) {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/dashboard";
}

function roleTitle(role) {
  if (role === "admin") return "Admin Panel";
  if (role === "seller") return "Seller Dashboard";
  return "User Dashboard";
}

function roleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "seller") return "Seller";
  return "User";
}
