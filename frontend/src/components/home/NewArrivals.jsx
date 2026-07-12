import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../shop/ProductCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SKELETON_COUNT = 4;

export default function NewArrivals({ products, isLoading }) {
  return (
    <section className="arrivals">
      <div className="wrap">
        <div className="arrivals-head">
          <div>
            <span className="eyebrow">Seasonal Selection</span>
            <h2>New Arrivals</h2>
          </div>
          <Link className="view-all" to="/shop?sortBy=newest">
            View All
          </Link>
        </div>

        {/* Products */}
        <div className="recommended-products__grid">
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
            : products.length === 0 
            ? <p className="arrivals__empty">No new arrivals yet — check back soon.</p>
            : products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
