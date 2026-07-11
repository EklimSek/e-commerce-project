import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import Order from "../models/order.model.js";
import axios from "axios";

const QR_LIFETIME_MS = 2 * 60 * 1000; // 5 min
const POLL_INTERVAL_MS = 10000;
const MAX_POLL_ATTEMPTS = 15; // 15 × 10s = 150s — safety ceiling slightly past the 2 min QR expiry

const generateKHQR = (amount) => {
  const billNumber = `BILL-${Date.now()}`;

  const optionalData = {
    currency: khqrData.currency.usd,
    amount, 
    billNumber,
    storeLabel: process.env.BAKONG_MERCHANT_NAME,
    terminalLabel: "Web-01",
    expirationTimestamp: Date.now() + QR_LIFETIME_MS,
  };

  const individualInfo = new IndividualInfo(
    process.env.BAKONG_ACCOUNT_ID,
    process.env.BAKONG_MERCHANT_NAME,
    process.env.BAKONG_MERCHANT_CITY,
    optionalData,
  );

  const khqr = new BakongKHQR();
  return khqr.generateIndividual(individualInfo);
};

const startPaymentPolling = (orderId, md5) => {
  let attempts = 0;

  const poll = async () => {
    const order = await Order.findById(orderId).select("status qrExpiresAt");

    if (!order || order.status !== "pending") {
      return; // cancelled, deleted, or already resolved elsewhere — stop
    }

    if (order.qrExpiresAt <= new Date() || attempts >= MAX_POLL_ATTEMPTS) {
      await Order.findByIdAndDelete(orderId);
      return;
    }

    attempts++;

    try {
      console.log("Polling.....")
      const res = await axios.post(
        `${process.env.BAKONG_API_URL}/check_transaction_by_md5`,
        { md5 },
        { headers: { Authorization: `Bearer ${process.env.BAKONG_TOKEN}` } },
      );

      if (res.data.responseCode === 0) {
        // payment confirmed
        order.status = "paid";
        // NOTE: `order` here only has status/qrExpiresAt selected above,
        // so re-fetch the full doc before saving to avoid clobbering fields.
        const fullOrder = await Order.findById(orderId);
        if (!fullOrder) return; // deleted between the check and now
        fullOrder.status = "paid";
        await fullOrder.save();

        const User = (await import("../models/user.model.js")).default;
        const user = await User.findById(fullOrder.user);
        if (user) {
          user.cartItems = [];
          await user.save();
        }
        console.log("Polling completed....")
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    } catch (error) {
      console.log("Polling error:", error.message);
      setTimeout(poll, POLL_INTERVAL_MS);
    }
  };

  setTimeout(poll, POLL_INTERVAL_MS);
};

export const checkout = async (req, res) => {
  const user = req.user;
  const { shippingData, currency = "USD" } = req.body;

  try {
    const existingOrder = await Order.findOne({
      user: user._id,
      status: "pending",
    });

    if (existingOrder && existingOrder.qrExpiresAt > new Date()) {
      return res.status(200).json({
        success: true,
        data: {
          orderId: existingOrder._id,
          qr: existingOrder.qr,
          qrExpiresAt: existingOrder.qrExpiresAt,
          totalAmount: existingOrder.totalAmount,
        },
      });
    }

    if (existingOrder) {
      await Order.findByIdAndDelete(existingOrder._id);
    }

    if (user.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    await user.populate("cartItems.product");

    const totalAmount = user.cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const result = generateKHQR(totalAmount);
    if (result.status.code !== 0) {
      return res.status(500).json({ success: false, message: "Failed to generate KHQR" });
    }
    const { qr, md5 } = result.data;

    let newOrder;
    try {
      newOrder = await Order.create({
        user: user._id,
        products: user.cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount,
        qr,
        md5,
        qrExpiresAt: new Date(Date.now() + QR_LIFETIME_MS),
        status: "pending",
        shippingData,
        currency: "USD",
      });

    } catch (err) {
      if (err.code === 11000) {
        // a concurrent request beat us to creating the order — fetch
        // and return THAT one, not the failed `newOrder`
        const raceOrder = await Order.findOne({
          user: user._id,
          status: "pending",
        });
        if (raceOrder) {
          return res.status(200).json({
            success: true,
            data: {
              orderId: raceOrder._id,
              qr: raceOrder.qr,
              qrExpiresAt: raceOrder.qrExpiresAt,
              totalAmount: raceOrder.totalAmount,
            },
          });
        }
      }
      throw err;
    }

    startPaymentPolling(newOrder._id, md5);

    return res.status(200).json({
      success: true,
      data: {
        orderId: newOrder._id,
        qr: newOrder.qr,
        qrExpiresAt: newOrder.qrExpiresAt,
        totalAmount: newOrder.totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      status: order.status, // "pending" | "paid" | "failed"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Order cannot be cancelled" });
    }

    await Order.findByIdAndDelete(orderId);
    // the active poll loop (on whichever instance is running it) will see
    // order === null on its next tick, within POLL_INTERVAL_MS, and stop

    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
