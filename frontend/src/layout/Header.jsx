import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useModalStore from "../store/modal.js";
import useCartStore from "../store/cart.js";

export default function Header() {
  const { openModal } = useModalStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCartStore();

  const handleCartClick = () => {
    if (location.pathname === "/cart" || location.pathname === "checkout")
      return;

    if (window.innerWidth <= 768) {
      navigate("/cart");
    } else {
      openModal("cart");
    }
  };

  return (
    <header className="header">
      <div className="header__inner">
        <button
          className="header__icon-btn header__icon-menu"
          aria-label="Menu"
          onClick={() => openModal("navbar")}
        >
          <Menu size={24} strokeWidth={1.25} />
        </button>

        <div className="about__us-wrap">
          <NavLink className="btn-about-us" to="/about">
            About Us
          </NavLink>
        </div>

        {/* ── Logo ── */}
        <div className="header__logo-wrap">
          <Link to="/" className="header__logo">
            LUMINA SKINCARE
          </Link>
        </div>

        {/* ── Icon actions ── */}
        <div className="header__actions">
          <button
            className="header__icon-btn header__icon-search"
            aria-label="Search"
            onClick={() => openModal("search")}
          >
            <Search size={24} strokeWidth={1.25} />
          </button>
          <button
            className="header__icon-btn header__icon-account"
            aria-label="Account"
            onClick={() => navigate("/login")}
          >
            <User size={24} strokeWidth={1.25} />
          </button>
          <button
            className="header__icon-btn header__icon-cart"
            aria-label="Cart"
            onClick={handleCartClick}
          >
            <ShoppingBag size={24} strokeWidth={1.25} />
            <span className="header__cart-dot" aria-hidden="true">
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
