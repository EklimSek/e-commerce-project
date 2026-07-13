import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js"
import cartRoutes from "./routes/cart.route.js"
import paymentRoutes from "./routes/payment.route.js"

import { generalLimiter } from "./middleware/rateLimiter.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Render sits behind a single reverse proxy hop — needed for req.ip to
// reflect the real client IP instead of Render's internal proxy IP,
// which is what the rate limiter keys requests by.
app.set("trust proxy", 1);

app.use(express.json()); // allow us to accept json data in the req body
app.use(cookieParser());

app.use("/api", generalLimiter);
// Products
app.use("/api/products", productRoutes)
// Auth 
app.use("/api/auth", authRoutes)
// Cart
app.use("/api/cart", cartRoutes)

// Payment
app.use("/api/payment", paymentRoutes)



app.get("/", (req, res) => {
    res.send("Welcome to the Product API");
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port 5000`);
    console.log(`http://localhost:` + PORT);
});
