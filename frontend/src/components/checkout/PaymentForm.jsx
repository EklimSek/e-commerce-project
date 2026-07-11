import { CreditCard, Wallet } from "lucide-react";
import { useState } from "react";

export default function PaymentForm({ onChange }) {
    const [selected, setSelected] = useState(""); // "card" or "khqr"

    const handleSelect = (option) => {
        setSelected(option);
        onChange((prev) => ({ ...prev, paymentMethod: option }));
    };

    return (
        <section className="checkout-section">

            {/* ── Step header ── */}
            <div className="checkout-section__step-header">
                <span className="checkout-section__step-badge">2</span>
                <h2 className="checkout-section__step-title">Payment Method</h2>
            </div>

            {/* ── Payment options ── */}
            <div className="payment-options">

                {/* Credit Card */}
                <div
                    className={`payment-option ${selected === "card" ? "payment-option--active" : ""}`}
                    onClick={() => handleSelect("card")}
                >
                    <CreditCard size={22} strokeWidth={1.5} className="payment-option__icon" />
                    <div className="payment-option__info">
                        <span className="payment-option__name">Credit Card</span>
                        <span className="payment-option__sub">Visa, Mastercard, Amex</span>
                    </div>
                    <span className={`payment-option__radio ${selected === "card" ? "payment-option__radio--selected" : ""}`} />
                </div>

                {/* KHQR */}
                <div
                    className={`payment-option ${selected === "khqr" ? "payment-option--active" : ""}`}
                    onClick={() => handleSelect("khqr")}
                >
                    <Wallet size={22} strokeWidth={1.5} className="payment-option__icon" />
                    <div className="payment-option__info">
                        <span className="payment-option__name">KHQR</span>
                        <span className="payment-option__sub">Fast &amp; Secure</span>
                    </div>
                    <span className={`payment-option__radio ${selected === "khqr" ? "payment-option__radio--selected" : ""}`} />
                </div>

            </div>

            {/* ── Card details ── */}
            {selected === "card" && (
                <div className="checkout-form__grid checkout-form__grid--card">
                    <div className="checkout-form__field checkout-form__field--full checkout-form__field--icon">
                        <label className="checkout-form__label">Card Number</label>
                        <div className="checkout-form__input-wrap">
                            <input className="checkout-form__input" type="text" placeholder="0000 0000 0000 0000" />
                            <CreditCard size={18} strokeWidth={1.5} className="checkout-form__input-icon" />
                        </div>
                    </div>
                    <div className="checkout-form__field">
                        <label className="checkout-form__label">Expiry Date</label>
                        <input className="checkout-form__input" type="text" placeholder="MM / YY" />
                    </div>
                    <div className="checkout-form__field">
                        <label className="checkout-form__label">CVV</label>
                        <input className="checkout-form__input" type="text" placeholder="123" />
                    </div>
                </div>
            )}

        </section>
    );
}