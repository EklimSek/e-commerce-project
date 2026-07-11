import express from "express";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { createProduct, deleteProduct, getProductbyId, getProducts, updateProduct } from "../controller/product.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected
router.post("/", protect, adminOnly, createProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.put("/:id", protect, adminOnly, updateProduct)

// Public
router.get("/", getProducts)
router.get("/:id", getProductbyId)

export default router;