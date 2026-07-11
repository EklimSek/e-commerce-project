import ProductBreadcrumb from "../components/product/ProductBreadcrumb.jsx";
import ProductGallery from "../components/product/ProductGallery.jsx";
import ProductInfo from "../components/product/ProductInfo.jsx";
import KeyIngredients from "../components/product/KeyIngredients.jsx";
import RecommendedProducts from "../components/RecommendedProducts.jsx";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useRecommendedProducts from '../utils/useRecommendedProducts.js';

export default function ProductDetailPage() {

  const state = useLocation();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(state?.product || null);

  const recommendedProducts = useRecommendedProducts();

  const { id } = useParams();

  useEffect(() => {

    if(state?.product) return;

    const fetchProductById = async () => {

      setLoading(true);
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json();
      setProduct(data.data);
      setLoading(false);

    } 

    fetchProductById();

  }, [id])

  if (!product) return null;

  return (
    <main className="product-detail-page">

      <ProductBreadcrumb name={product.name}/>

      {/* ── Hero — gallery + info ── */}
      <div className="product-detail-page__hero">
        <ProductGallery 
          images={product.image} 
        />
        <ProductInfo 
          product={product} 
        />
      </div>

      <KeyIngredients />

      <RecommendedProducts products={recommendedProducts} />

    </main>
  );
}