import React from "react";

export default function Newsletter() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to email provider / API
  };

  return (
    <section className="newsletter">
      <div className="wrap newsletter-inner">
        <h2>Join the Ritual</h2>
        <p>
          Subscribe to receive skincare guides, early access to new launches, and a 15% welcome
          gift on your first order.
        </p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input placeholder="Your email address" type="email" />
          <button className="btn-dark" type="submit">
            Subscribe
          </button>
        </form>
        <p className="newsletter-fine">
          By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </section>
  );
}