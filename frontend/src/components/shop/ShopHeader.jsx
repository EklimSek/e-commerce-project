import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const SORT_OPTIONS = [
  { label: "Newest",             value: "newest" },
  { label: "Oldest",             value: "oldest" },
  { label: "Price Low to High",  value: "price-asc" },
  { label: "Price High to Low",  value: "price-desc" },
];

export default function ShopHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sortRef = useRef(null);

  const currentSort = searchParams.get("sortBy") || "";
  const currentLabel = SORT_OPTIONS.find(o => o.value === currentSort)?.label || "Newest";

  // Function for sort change
  const handleSortByChange = (newSort) => {
    const params = Object.fromEntries(searchParams);

    if(params.search) delete params.search;

    if (!newSort) {
      delete params.sortBy;
    } else {
      params.sortBy = newSort;
    }

    params.page = 1;
    setSearchParams(params);
    setDropdownOpen(false);
  };
  
  // Sort
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="shop-header">

      <nav className="shop-header__breadcrumb" aria-label="Breadcrumb">
        <a href="/" className="shop-header__breadcrumb-link">Home</a>
        <span className="shop-header__breadcrumb-sep">/</span>
        <span className="shop-header__breadcrumb-current">Shop All</span>
      </nav>

      <div className="shop-header__row">
        <div className="shop-header__meta">
          <h1 className="shop-header__title">Skincare</h1>
          <p className="shop-header__desc">
            Curated essentials for a refined skincare ritual. Each formula is a
            balance of potent botanical extracts and clinical precision.
          </p>
        </div>

        <div className="shop-header__controls">
          <span className="shop-header__count">24 Products</span>


          <div className="shop-header__sort-wrap" ref={sortRef}>
            <button
              className="shop-header__sort-btn"
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              Sort By: {currentLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="shop-header__sort-dropdown" role="listbox">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.value}>
                    <button
                      className={`shop-header__sort-option ${
                        currentSort === option.value ? "shop-header__sort-option--active" : ""
                      }`}
                      onClick={() => handleSortByChange(option.value)}
                      role="option"
                      aria-selected={currentSort === option.value}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>

    </header>
  );
}