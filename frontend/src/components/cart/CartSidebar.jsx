import { X, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useModalStore from "../../store/modal.js";
import useCartStore from "../../store/cart.js";
import CartItem from "./CartItem.jsx";

export default function CartSidebar() {

  const { activeModal, closeModal } = useModalStore();
  const { cart, getTotal } = useCartStore();
  // cart = [{product: {_id, image, category, name, price}, quantity }, {....}]
  const total = getTotal();
  const navigate = useNavigate();

  return (
    <div
      className={`cart-modal-container ${activeModal === "cart" ? "modal-open" : ""}`}
      onClick={(e) => {
        // close when clicking the backdrop
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="cart-modal">

        {/* ── Close button ── */}
        <div className="cart-modal__close-row">
          <button className="cart-modal__close-btn" onClick={closeModal} aria-label="Close cart">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Header ── */}
        <div className="cart-modal__header">
          <h2 className="cart-modal__title">Your Bag</h2>
          <span className="cart-modal__count">{cart.length} Items</span>
        </div>

        {/* ── Items ── */}
        <div className="cart-modal__items">
          {cart.length === 0 ? (
            <div className="cart-modal__empty">
              <ShoppingBag size={48} strokeWidth={1} className="cart-modal__empty-icon" />
              <p className="cart-modal__empty-title">Your cart is empty</p>
              <button
                className="cart-modal__shop-btn"
                onClick={() => { closeModal(); navigate("/shop"); }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart.map((cartItem) => (
              <CartItem key={cartItem.product._id} item={cartItem} />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {cart.length > 0 && (
          <div className="cart-modal__footer">
            <div className="cart-modal__total-row">
              <span className="cart-modal__total-label">Total</span>
              <span className="cart-modal__total-value">${parseFloat(total).toFixed(2)}</span>
            </div>
            <button
              className="cart-modal__view-btn"
              onClick={() => { closeModal(); navigate("/cart"); }}
            >
              View Bag
            </button>
          </div>
        )}

      </div>
    </div>
  );
}