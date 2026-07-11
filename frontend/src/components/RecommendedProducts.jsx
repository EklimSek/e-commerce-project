import ProductCard from "./shop/ProductCard.jsx";

export default function RecommendedProducts({ products }) {
  return (
    <section className="recommended-products">
      <h2 className="recommended-products__heading">You Might Also Like</h2>

      <div className="recommended-products__grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}