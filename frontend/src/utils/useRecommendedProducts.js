import { useEffect } from "react";
import useCartStore from "../store/cart.js";
import useProductStore from "../store/product.js";

export default function useRecommendedProducts() {
  const { cart } = useCartStore();
  const { fetchRecommend, recommendedProducts } = useProductStore();

  useEffect(() => {
    if (cart.length === 0) {
      fetchRecommend({});
      return;
    }
    const category = cart[0].category;
    const exclude = cart.map(item => item._id);
    fetchRecommend({ category, exclude });
  }, [cart]);

  return recommendedProducts;
}