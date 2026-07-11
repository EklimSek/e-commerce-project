import { useState } from "react";

export default function ShippingForm({ onChange }) {

  const [form, setForm] = useState({
      address: "",
      city: "",
      phoneNum: "",
  });

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value};
    setForm(updated)
    onChange(updated)
  }

  return (
    <section className="checkout-section">

      {/* ── Step header ── */}
      <div className="checkout-section__step-header">
        <span className="checkout-section__step-badge checkout-section__step-badge--active">1</span>
        <h2 className="checkout-section__step-title">Shipping Information</h2>
      </div>

      {/* ── Fields ── */}
      <div className="checkout-form__grid">

        <div className="checkout-form__field checkout-form__field--full">
          <label className="checkout-form__label">Address</label>
          <input 
            className="checkout-form__input" 
            type="text" 
            placeholder="123 Serenity Lane" 
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">City</label>
          <input 
            className="checkout-form__input" 
            type="text" 
            placeholder="Santa Monica"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
        </div>

        <div className="checkout-form__field">
          <label className="checkout-form__label">Phone Number</label>
          <input 
            className="checkout-form__input" 
            type="text" 
            placeholder="+855 96-XXX-XXX"
            name="phoneNum"
            value={form.phoneNum}
            onChange={handleChange}
          />
        </div>



      </div>
    </section>
  );
}