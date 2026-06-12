import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "sold"],
      default: "active",
    },
    location: {
      label: String,
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true },
);

export const Listing = mongoose.model("Listing", listingSchema);
