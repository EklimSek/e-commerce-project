// import "../../styles/components/shop-sidebar.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  { label: "All Products",          value: "" },
  { label: "Cleansers",    value: "cleanser" },
  { label: "Toners",       value: "toner" },
  { label: "Serums",       value: "serum" },
  { label: "Moisturizers", value: "moisturizer" },
  { label: "Masks",        value: "mask" },
];
const SKIN_CONCERNS = ["Dry", "Oily", "Sensitive", "Anti-Aging"];

export default function ShopSidebar() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const currentCategory = searchParams.get("category") || "";
  const currentLabel = CATEGORIES.find(c => c.value === currentCategory)?.label || "All";

  const handleCategoryChange = (newCategory) => {
    const params = Object.fromEntries(searchParams);

    if(params.search) delete params.search;
    
    if (!newCategory) {
      delete params.category;
    } else {
      params.category = newCategory;
    }

    params.page = 1;
    setSearchParams(params);
    setCategoryOpen(false);
  };

  // Category
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="shop-sidebar">

      {/* ── Category ── */}
      {/* ── Category dropdown ── */}
      <div className="shop-sidebar__section">
        <h3 className="shop-sidebar__heading">Category</h3>

        <div className="shop-sidebar__dropdown-wrap" ref={categoryRef}>
          <button
            className="shop-sidebar__dropdown-btn"
            onClick={() => setCategoryOpen(prev => !prev)}
            aria-expanded={categoryOpen}
            aria-haspopup="listbox"
          >
            {currentLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {categoryOpen && (
            <ul className="shop-sidebar__dropdown-list" role="listbox">
              {CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <button
                    className={`shop-sidebar__dropdown-option ${
                      currentCategory === cat.value ? "shop-sidebar__dropdown-option--active" : ""
                    }`}
                    onClick={() => handleCategoryChange(cat.value)}
                    role="option"
                    aria-selected={currentCategory === cat.value}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Skin Concern ── */}
      <div className="shop-sidebar__section">
        <h3 className="shop-sidebar__heading">Skin Concern</h3>
        <div className="shop-sidebar__chips">
          {SKIN_CONCERNS.map((concern) => (
            <button key={concern} className="shop-sidebar__chip">
              {concern}
            </button>
          ))}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div className="shop-sidebar__section">
        <h3 className="shop-sidebar__heading">Price Range</h3>
        <div className="shop-sidebar__range-wrap">
          <input
            type="range"
            className="shop-sidebar__range"
            min={20}
            max={200}
            defaultValue={200}
            aria-label="Price range"
          />
          <div className="shop-sidebar__range-labels">
            <span>$20</span>
            <span>$200+</span>
          </div>
        </div>
      </div>

      {/* ── Promo Card ── */}
      <div className="shop-sidebar__promo">
        <p className="shop-sidebar__promo-title">Winter Ritual Guide</p>
        <p className="shop-sidebar__promo-desc">
          Discover the perfect layering technique for dry months.
        </p>
        <a href="#" className="shop-sidebar__promo-link">Read Journal</a>
      </div>

    </aside>
  );
}