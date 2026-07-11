import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import useCartStore from "../../store/cart.js";
import { fetchWithAuth } from "../../utils/fetchWithAuth.js";
import useAuthStore from "../../store/auth.js";
import TransactionModal from "./TransactionModal.jsx";

const STATUS_POLL_INTERVAL_MS = 10000;

export default function CheckoutSummary({ shippingData, paymentData }) {
  // Checkout / payment state — everything the modal needs lives here
  const [orderId, setOrderId] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrExpiresAt, setQrExpiresAt] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null); // backend-calculated — source of truth for what's charged
  const [paymentStatus, setPaymentStatus] = useState(null); // null | "pending" | "paid" | "expired" | "failed"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const { cart, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const resetPayment = () => {
    clearInterval(pollingRef.current);
    setOrderId(null);
    setQrCode(null);
    setQrExpiresAt(null);
    setTotalAmount(null);
    setPaymentStatus(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !shippingData.address ||
      !shippingData.city ||
      !shippingData.phoneNum ||
      !paymentData.currency ||
      !paymentData.paymentMethod
    ) {
      console.log(paymentData.currency, paymentData.paymentMethod)

      toast.error("Please input and select all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetchWithAuth("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingData: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNum: shippingData.phoneNum,
            address: shippingData.address,
            city: shippingData.city,
          },
          currency: "USD",
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setOrderId(data.data.orderId);
      setQrCode(data.data.qr);
      setQrExpiresAt(data.data.qrExpiresAt);
      setTotalAmount(data.data.totalAmount);
      setPaymentStatus("pending");

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      console.error("Checkout error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll for payment confirmation while pending
  useEffect(() => {
    if (!orderId || paymentStatus !== "pending") return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetchWithAuth(`/api/payment/status/${orderId}`);

        if (res.status === 404) {
          // order was deleted server-side — either it expired (backend's
          // own timeout deletes it) or it was cancelled from another tab.
          // Either way, there's nothing left to pay into.
          setPaymentStatus("expired");
          clearInterval(pollingRef.current);
          return;
        }

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        if (data.status === "paid") {
          setPaymentStatus("paid");
          clearCart(); // reflect the backend's cart clear in local state
          clearInterval(pollingRef.current);
        } else if (data.status === "failed") {
          setPaymentStatus("failed");
          clearInterval(pollingRef.current);
        }
        // "pending" — keep polling
      } catch (err) {
        console.error("Polling error:", err.message);
        // transient network error — don't flip status, just try again next tick
      }
    }, STATUS_POLL_INTERVAL_MS);

    return () => clearInterval(pollingRef.current);
  }, [orderId, paymentStatus, clearCart]);

  const handleCancel = async () => {
    if (!orderId) return;
    try {
      const res = await fetchWithAuth(`/api/payment/cancel/${orderId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
    } catch (err) {
      // order may already be gone (expired/paid mid-click) — not fatal either way
      console.error("Cancel error:", err.message);
    } finally {
      resetPayment();
    }
  };

  const handleExpire = () => {
    // fired by the modal's own countdown, ahead of the next poll tick or
    // the backend's timeout — cancel immediately so the order doesn't
    // linger as "pending" server-side any longer than it has to
    handleCancel();
  };

  const handleModalClose = () => {
    if (paymentStatus === "paid") {
      resetPayment();
      // e.g. navigate("/orders/" + orderId) if you have a confirmation page
    } else {
      // expired / failed — reset so "Place Order" is available again
      resetPayment();
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.085; // TODO: replace with your real tax calculation
  const displayTotal = subtotal + tax;

  return (
    <aside className="checkout-summary">
      <div className="checkout-summary__card">
        <h3 className="checkout-summary__heading">Your Order</h3>

        {/* ── Items ── */}
        <div className="checkout-summary__items">
          {cart.map((item) => (
            <div key={item.product._id} className="checkout-summary__item">
              <div className="checkout-summary__item-image-wrap">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="checkout-summary__item-image"
                />
              </div>
              <div className="checkout-summary__item-info">
                <h4 className="checkout-summary__item-name">
                  {item.product.name}
                </h4>
                <div className="checkout-summary__item-row">
                  <span className="checkout-summary__item-price">
                    ${item.product.price.toFixed(2)}
                  </span>
                  <span className="checkout-summary__item-qty">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Promo code ── */}
        <div className="checkout-summary__promo">
          <label className="checkout-form__label">Promo Code</label>
          <div className="checkout-summary__promo-row">
            <input
              className="checkout-form__input checkout-summary__promo-input"
              type="text"
              placeholder="Enter code"
            />
            <button className="checkout-summary__promo-btn">Apply</button>
          </div>
        </div>

        {/* ── Totals ── */}
        <div className="checkout-summary__totals">
          <div className="checkout-summary__total-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-summary__total-row">
            <span>Shipping</span>
            <span className="checkout-summary__free">Complimentary</span>
          </div>
          <div className="checkout-summary__total-row">
            <span>Tax (Calculated)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="checkout-summary__total-row checkout-summary__total-row--grand">
            <span>Total</span>
            <span>${displayTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Error ── */}
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        {/* ── CTA ── */}
        <button
          className="checkout-summary__place-order-btn"
          onClick={handleCheckout}
          disabled={loading || !!orderId}
        >
          {loading ? "Processing..." : "Place Order"}
          {!loading && <ArrowRight size={18} strokeWidth={1.5} />}
        </button>

        <p className="checkout-summary__legal">
          By placing your order, you agree to Lumina Skincare's{" "}
          <a href="#" className="checkout-summary__legal-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="checkout-summary__legal-link">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <TransactionModal
        open={!!orderId}
        qrCode={qrCode}
        amount={totalAmount}
        expiresAt={qrExpiresAt}
        status={paymentStatus ?? "pending"}
        merchantName="Lumina Skincare"
        onCancel={handleCancel}
        onClose={handleModalClose}
        onExpire={handleExpire}
      />
    </aside>
  );
}
