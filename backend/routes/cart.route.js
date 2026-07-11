import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getSessionData, addToCart, removeFromCart, updateQuantity, removeAllFromCart } from "../controller/cart.controller.js";


const router = express.Router();

router.get("/", protect, getSessionData);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateQuantity)
router.delete("/", protect, removeAllFromCart)
router.delete("/:id", protect, removeFromCart);


export default router;