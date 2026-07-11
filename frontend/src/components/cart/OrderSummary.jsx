import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth.js"


export default function OrderSummary({ subtotal, shipping, tax, total }) {

  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  return (
    <aside className="order-summary">
      <div className="order-summary__card">
        <h2 className="order-summary__heading">Order Summary</h2>

        <div className="order-summary__rows">
          <div className="order-summary__row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="order-summary__row">
            <span>Shipping</span>
            <span className="order-summary__free">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="order-summary__row">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="order-summary__total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          className="order-summary__checkout-btn"
          onClick={() => {
            if(!isLoggedIn){
              navigate('/login')
            }else{
              navigate('/checkout')
            }
          }}
        >
          Proceed to Checkout
        </button>

        <p className="order-summary__secure-note">
          Secure checkout powered by Stripe.
        </p>
      </div>
    </aside>
  );
}