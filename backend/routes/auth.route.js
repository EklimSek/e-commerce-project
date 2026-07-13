import express from "express";
import { signUp, signIn, logout, refreshToken, getMe } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post("/signup", authLimiter, signUp);
router.post("/signin", authLimiter, signIn);

router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", protect, getMe)

export default router;