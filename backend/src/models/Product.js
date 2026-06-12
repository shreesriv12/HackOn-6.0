import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    description: { type: String, trim: true },
    images: [{ type: String }],
    condition: {
      type: String,
      enum: ["unknown", "unused", "like_new", "worn", "damaged"],
      default: "unknown",
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
