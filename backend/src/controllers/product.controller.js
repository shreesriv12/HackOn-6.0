import { Listing } from "../models/Listing.js";
import { Product } from "../models/Product.js";
import { uploadProductImages } from "../services/cloudinary.service.js";

export async function createProduct(req, res) {
  try {
    if (!isSellerSession(req)) {
      return res.status(403).json({ message: "Sign in as seller to add catalog products" });
    }

    const { name, category, brand = "", description = "" } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Product name and category are required" });
    }

    const images = await uploadProductImages(req.files);
    const product = await Product.create({
      owner: req.user._id,
      name,
      category,
      brand,
      description,
      images,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Could not create product", error: error.message });
  }
}

export async function listProducts(_req, res) {
  try {
    const products = await Product.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Could not load products", error: error.message });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate("owner", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Could not load product", error: error.message });
  }
}

export async function createListing(req, res) {
  try {
    if (!isSellerSession(req)) {
      return res.status(403).json({ message: "Sign in as seller to publish listings" });
    }

    const { price, location = "" } = req.body;
    const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });

    if (!product) {
      return res.status(404).json({ message: "Product not found for this seller" });
    }

    if (!price || Number(price) < 0) {
      return res.status(400).json({ message: "Valid listing price is required" });
    }

    const listing = await Listing.create({
      product: product._id,
      seller: req.user._id,
      price: Number(price),
      location: {
        label: location || req.user.profile?.location?.label || "",
      },
    });

    await listing.populate("product");
    res.status(201).json({ listing });
  } catch (error) {
    res.status(500).json({ message: "Could not create listing", error: error.message });
  }
}

export async function listActiveListings(_req, res) {
  try {
    const listings = await Listing.find({ status: "active" })
      .populate("product")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (error) {
    res.status(500).json({ message: "Could not load listings", error: error.message });
  }
}

export async function listMyListings(req, res) {
  try {
    if (!isSellerSession(req)) {
      return res.status(403).json({ message: "Sign in as seller to view seller listings" });
    }

    const listings = await Listing.find({ seller: req.user._id })
      .populate("product")
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (error) {
    res.status(500).json({ message: "Could not load your listings", error: error.message });
  }
}

function isSellerSession(req) {
  return req.user.role !== "admin" && req.authMode === "seller";
}
