import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpiresAt: Date,
    profile: {
      photoUrl: String,
      location: {
        label: String,
        lat: Number,
        lng: Number,
      },
      clothingSize: String,
      shoeSize: String,
      preferences: String,
      sustainabilityInterests: [String],
      onboardingCompleted: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
