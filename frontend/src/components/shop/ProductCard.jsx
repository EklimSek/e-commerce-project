import useCartStore from '../../store/cart.js'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';


export default function ProductCard({ product }) {
  const { _id, image, category, name, price } = product;
  const { cart, addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddProduct = (e) => {
    e.preventDefault();   // prevents any default link behaviour
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link 
      to={`/shop/${_id}`}
      state = { product }
      className="product-card"
    >

      {/* ── Image area ── */}
      <div className="product-card__image-wrap">
        <img
          src={image}
          alt={name}
          className="product-card__image"
        />

        {/* Hover overlay */}
        <div className="product-card__overlay" />

        {/* Add to cart button — appears on hover */}
        <div className="product-card__cta-wrap">
          <button 
            className="product-card__cta"
            data-id = {_id}
            onClick={handleAddProduct}
          >Add to Cart</button>
        </div>

      </div>

      {/* ── Info ── */}
      <div className="product-card__info">
        <p className="product-card__category">{category}</p>
        <h4 className="product-card__name">{name}</h4>
        <div className="product-card__pricing">
          <span className="product-card__price">${price.toFixed(2)}</span>
        </div>
      </div>

    </Link>
  );
}