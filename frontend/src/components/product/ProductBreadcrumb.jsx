import { Link } from "react-router-dom";


export default function ProductBreadcrumb( { name }) {
  return (
    <nav className="product-breadcrumb">
      <Link to="/" className="product-breadcrumb__link">HOME</Link>
      <span className="product-breadcrumb__sep">›</span>
      <Link to="/shop" className="product-breadcrumb__link">SHOP</Link>
      <span className="product-breadcrumb__sep">›</span>
      <span className="product-breadcrumb__current">{name}</span>
    </nav>
  );
}