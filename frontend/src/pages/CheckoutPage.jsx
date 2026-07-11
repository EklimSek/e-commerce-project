import { Currency, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import ShippingForm from "../components/checkout/ShippingForm.jsx";
import PaymentForm from "../components/checkout/PaymentForm.jsx";
import CheckoutSummary from "../components/checkout/CheckoutSummary.jsx";
import { useState } from "react";

export default function CheckoutPage() {

  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    phoneNum: ""
  })

  const [paymentData, setPaymentData] = useState({
    currency: "USD",
    paymentMethod: ""
  })

  return (
    <>

      <main className="checkout-page">
        <div className="checkout-page__grid">

          {/* Left — steps */}
          <div className="checkout-page__steps">
            <ShippingForm onChange={setShippingData}/>
            <hr className="checkout-divider" />
            <PaymentForm onChange={setPaymentData}/>
          </div>

          {/* Right — summary */}
          {/* Place Order button here */}
          <CheckoutSummary shippingData={shippingData} paymentData={paymentData}/>

        </div>
      </main>
    </>
  );
}