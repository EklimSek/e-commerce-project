import { NavLink } from "react-router-dom";
import { Home, Search, LayoutGrid, Bookmark, User } from "lucide-react";
import useModalStore from "../store/modal.js";

const NAV_ITEMS = [
  { label: "Home",       to: "/",        icon: Home },
  { label: "Search",     to: null,       icon: Search,     modal: "search" },
  { label: "Shop", to: "/shop",    icon: LayoutGrid },
  { label: "Saved",      to: "/saved",   icon: Bookmark },
  { label: "Account",    to: "/account", icon: User },
];

export default function MobileNav() {
  const { openModal } = useModalStore();

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ label, to, icon: Icon, modal }) => {

        if (modal) {
          return (
            <button
              key={label}
              className="mobile-nav__item"
              onClick={() => openModal(modal)}
              aria-label={label}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="mobile-nav__label">{label}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `mobile-nav__item ${isActive ? "mobile-nav__item--active" : ""}`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="mobile-nav__label">{label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}