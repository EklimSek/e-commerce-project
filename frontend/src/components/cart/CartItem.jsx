import { Trash2, Minus, Plus } from "lucide-react";
import useCartStore from "../../store/cart.js";

export default function CartItem({ item }) {

  const { product, quantity } = item;
  const {_id, category, image, name, price} = product;
  const total = price * quantity;

  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="cart-item">

      {/* ── Thumbnail ── */}
      <div className="cart-item__image-wrap">
        <img src={image} alt={name} className="cart-item__image" />
      </div>

      {/* ── Content column ── */}
      <div className="cart-item__content">

        {/* Top row — name/meta left, trash right */}
        <div className="cart-item__top">
          <div className="cart-item__info">
            <h3 className="cart-item__name">{name}</h3>
            <p className="cart-item__meta">150 ml | Brightening & Protective</p>
          </div>
          <button 
            className="cart-item__remove" 
            aria-label="Remove item"
            onClick={() => removeItem(_id)}
          >
            <Trash2 size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Bottom row — qty stepper left, price right */}
        <div className="cart-item__bottom">

          <div className="cart-item__qty-wrap">
            <button 
              className="cart-item__qty-btn" 
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(_id, quantity - 1)}
            >
              <Minus size={14} strokeWidth={2} />
            </button>
            <span className="cart-item__qty-value">{quantity}</span>
            <button 
              className="cart-item__qty-btn" 
              aria-label="Increase quantity"
              onClick={() => updateQuantity(_id, quantity + 1)}
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>
          
          <span className="cart-item__price">${total.toFixed(2)}</span>
        </div>

      </div>

    </div>
  );
}