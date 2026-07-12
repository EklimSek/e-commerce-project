import { Star, StarHalf, Truck, Leaf } from "lucide-react";

import useCartStore from "../../store/cart";
import toast from "react-hot-toast";

export default function ProductInfo( { product }) {

  const { _id, name, price, category } = product;
  const { cart, addToCart } = useCartStore();

  return (
    <div className="product-info">

      {/* ── Title block ── */}
      <div className="product-info__header">
        <span className="product-info__eyebrow">{category?.toUpperCase()}</span>
        <h2 className="product-info__title">{name}</h2>

        <div className="product-info__rating">
          <div className="product-info__stars">
            <Star size={18} fill="currentColor" strokeWidth={0} />
            <Star size={18} fill="currentColor" strokeWidth={0} />
            <Star size={18} fill="currentColor" strokeWidth={0} />
            <Star size={18} fill="currentColor" strokeWidth={0} />
            <StarHalf size={18} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="product-info__rating-text">4.8/5 (248 reviews)</span>
        </div>
      </div>

      {/* ── Price ── */}
      <div className="product-info__price">${price}</div>

      {/* ── Description ── */}
      <p className="product-info__description">
        "A ritual of clarity. This high-potency serum harmonizes 15%
        stabilized Vitamin C with Ferulic Acid to awaken your complexion's
        natural luminosity while shielding against environmental stressors."
      </p>

      {/* ── Size selection ── */}
      <div className="product-info__size-section">
        <span className="product-info__size-label">Select Size</span>
        <div className="product-info__size-options">
          <button className="product-info__size-btn product-info__size-btn--active">
            30ml
          </button>
          <button className="product-info__size-btn">
            50ml
          </button>
        </div>
      </div>

      {/* ── Add to cart + shipping notes ── */}
      <div className="product-info__actions">
        <button 
          className="product-info__add-btn"
          data-id = {_id}
          onClick={() => {
            addToCart(product);
            toast.success("Product added to cart succesfully!")
          }}
        >
          Add to Cart
        </button>

        <div className="product-info__notes">
          <div className="product-info__note">
            <Truck size={20} strokeWidth={1.5} />
            <span>Complimentary shipping on orders over $100</span>
          </div>
          <div className="product-info__note">
            <Leaf size={20} strokeWidth={1.5} />
            <span>Sustainably sourced, recycled glass vessel</span>
          </div>
        </div>
      </div>

    </div>
  );
}