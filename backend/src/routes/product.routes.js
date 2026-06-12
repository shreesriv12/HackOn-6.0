import { Router } from "express";
import multer from "multer";
import {
  createListing,
  createProduct,
  getProduct,
  listActiveListings,
  listMyListings,
  listProducts,
} from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

export const productRouter = Router();

productRouter.get("/products", listProducts);
productRouter.post("/products", requireAuth, upload.array("images", 6), createProduct);
productRouter.get("/products/:id", getProduct);
productRouter.post("/products/:id/list", requireAuth, createListing);
productRouter.get("/listings", listActiveListings);
productRouter.get("/listings/my", requireAuth, listMyListings);
