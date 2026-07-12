import ProductCard from "./ProductCard.jsx";

import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import useProductStore from "../../store/product.js";
const SKELETON_COUNT = 9;

export default function ProductGrid() {
  const { products, totalPages, totalProduct, fetchProduct } =
    useProductStore();
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageNum = parseInt(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const search = searchParams.get("search") || "";

  // Use effect will run once the component is rendered
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        await fetchProduct({ pageNum, category, sortBy, search }); // on load fetch page 1
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [pageNum, category, sortBy, search]); // The dependency array

  const handlePageChange = (newPage) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPage,
    });
  };

  return (
    <section className="product-grid__section">
      {/* ── Cards ── */}
      <div className="product-grid">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="product-card">
                <div className="product-card__image-wrap">
                  <Skeleton
                    height="100%"
                    style={{ position: "absolute", inset: 0 }}
                  />
                </div>
                <div className="product-card__info">
                  <Skeleton
                    width="30%"
                    height={12}
                    style={{ marginBottom: 8 }}
                  />
                  <Skeleton
                    width="70%"
                    height={16}
                    style={{ marginBottom: 8 }}
                  />
                  <Skeleton width="35%" height={16} />
                </div>
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {/* ── Load more ── */}
      <div className="pagination-container">
        <span className="show-result">
          {Math.min(pageNum * 9, totalProduct)} of {totalProduct} Results
        </span>

        <div className="pagination">
          {/* Previous Button */}
          <button
            className="arrow-btn"
            disabled={pageNum === 1}
            onClick={() => handlePageChange(pageNum - 1)}
          >
            &lt;
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            // Page button
            <button
              key={page}
              className={`pagination-btn ${pageNum === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            className="arrow-btn"
            disabled={pageNum === totalPages}
            onClick={() => handlePageChange(pageNum + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
