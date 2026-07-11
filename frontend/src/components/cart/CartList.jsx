import CartItem from "./CartItem.jsx";

export default function CartList({ items }) {
  return (
    
    <section className="cart-list">
      
      {items.map((item) => (
        <CartItem key={item.product._id} item={item} />
      ))}

    </section>
  );
}