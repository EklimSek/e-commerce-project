import express from "express";

import { checkout, checkPaymentStatus, cancelPayment} from "../controller/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/checkout", protect, checkout);
router.post("/cancel/:orderId", protect, cancelPayment);
router.get("/status/:orderId", protect, checkPaymentStatus);



export default router;