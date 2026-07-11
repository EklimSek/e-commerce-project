// ShopPage.jsx
import ShopHeader from '../components/shop/ShopHeader.jsx';
import ShopSidebar from '../components/shop/ShopSidebar.jsx';
import ProductGrid from '../components/shop/ProductGrid.jsx';


export default function ShopPage() {
  return (

    <div className="shop-page">
      <ShopHeader />
      <div className="shop-layout">
        <ShopSidebar />
        <ProductGrid />
      </div>
    </div>
    
  );
}