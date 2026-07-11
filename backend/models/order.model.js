import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, min: 0, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      min: 0,
      required: true,
    },
    qr: {
      type: String,
      required: true,
    },
    md5: {
      type: String,
      required: true,
    },
    qrExpiresAt: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    shippingData: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phoneNum: { type: String },
      address: { type: String },
      city: { type: String },
    },
    currency: {
      type: String,
      enum: ["USD", "KHR"],
      default: "USD",
    },
  },
  { timestamps: true },
);

orderSchema.index(
  { user: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
