import { X, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useModalStore from "../store/modal.js";

const NAV_LINKS = [
  { label: "Home",         path: "/" },
  { label: "All Products", path: "/shop" },
  { label: "Cleansers",    path: "/shop?page=1&category=cleanser" },
  { label: "Moisturizers", path: "/shop?page=1&category=moisturizer" },
  { label: "Serums",       path: "/shop?page=1&category=serum" },
  { label: "Toners",       path: "/shop?page=1&category=toner" },
  { label: "Masks",        path: "/shop?page=1&category=mask" },
];

export default function NavSidebar() {
  const { activeModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    closeModal();
    navigate(path);
  };

  return (
    <div
      className={`nav-sidebar-container ${activeModal === "navbar" ? "modal-open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="nav-sidebar">

        {/* ── Close ── */}
        <div className="nav-sidebar__close-row">
          <button className="nav-sidebar__close-btn" onClick={closeModal} aria-label="Close menu">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Title ── */}
        <h2 className="nav-sidebar__title">Shop</h2>

        {/* ── Nav links ── */}
        <nav className="nav-sidebar__links">
          {NAV_LINKS.map(({ label, path }) => (
            <div key={path} className="nav-sidebar__link-item">
              <button
                className="nav-sidebar__link-btn"
                onClick={() => handleNavigate(path)}
              >
                {label}
              </button>
              <hr className="nav-sidebar__divider" />
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="nav-sidebar__footer">
          <button className="nav-sidebar__signin-btn">
            Sign in or Create an Account
          </button>

          <a href="#" className="nav-sidebar__footer-link">
            <MessageCircle size={16} strokeWidth={1.5} />
            <span>Contact us</span>
          </a>

          <a href="#" className="nav-sidebar__footer-link">
            <MapPin size={16} strokeWidth={1.5} />
            <span>Find a store</span>
          </a>
        </div>

      </div>
    </div>
  );
}