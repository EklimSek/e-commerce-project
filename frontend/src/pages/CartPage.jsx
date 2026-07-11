import CartList from "../components/cart/CartList.jsx";
import OrderSummary from "../components/cart/OrderSummary.jsx";
import RecommendedProducts from "../components/RecommendedProducts.jsx";

import { ShoppingBag } from "lucide-react";

import useCartStore from "../store/cart.js";
import useRecommendedProducts from "../utils/useRecommendedProducts.js";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function CartPage() {

  const { cart, getTotal } = useCartStore();
  const recommendedProducts = useRecommendedProducts();

  const total = getTotal();
  const navigate = useNavigate();

  return (
    <main className="cart-page">

      {/* Header */}
      <div className="cart-modal__header">
        <h2 className="cart-modal__title">Your Bag</h2>
        <span className="cart-modal__count">{cart.length} Items</span>
      </div>


      {cart.length === 0 ? (
        <div className="cart-modal__empty">
          <ShoppingBag size={48} strokeWidth={1} className="cart-modal__empty-icon" />
          <p className="cart-modal__empty-title">Your cart is empty</p>
          <button
            className="cart-modal__shop-btn"
            onClick={() => { navigate("/shop"); }}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="cart-page__grid">
          <CartList items={cart} />
          <OrderSummary
            subtotal={total}
            shipping={0}
            tax={0}
            total={total}
          />
        </div>
      )}
      

      <RecommendedProducts products={recommendedProducts} />

    </main>
  );
}