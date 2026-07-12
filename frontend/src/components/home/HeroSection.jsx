import React from "react";
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-bg" />
      <div className="hero-content wrap">
        <div className="hero-inner">
          <h1 className="hero-title">Glow from Within</h1>
          <p className="hero-copy">
            Scientifically formulated rituals powered by earth's most potent botanicals for skin
            that speaks of health and clarity.
          </p>
          <button className="btn-dark" onClick={() => navigate("/shop")}>Shop the Collection</button>
        </div>
      </div>
      
    </section>
  );
}