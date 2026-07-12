import React from "react";

export default function OurStory() {
  return (
    <section className="wrap">
      <div className="story-grid">
        <div className="story-img-wrap">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqV76b29N3L4-Uf6Tg0UpuQCcdZMF3MW0huX0Suj3wnHYvl9wJ2tKfpcSTb3OdhrKqHQWpe-ePhuXCu1srKf34XJbxaJWbCGEoQqp-UGVUR79cAt0STsDpY-eE9dODF8r7ksZNQVtJBc2IHqSj_FXWAt1j9e9urOqp13SQ9OjlLkI0LDDOW2ZQRwoJs5B_yjEtB0OtbJsEy86XVQ1Iw1L8oOpxRiIYpL2vPz9PuoqUDI3WzSImmSimSqEWqw2hg21JCEp8BdNcY15Y"
            alt="Woman with radiant skin in a sunlit garden"
          />
          <div className="story-quote">
            <p>"We believe skincare is the ultimate form of self-respect."</p>
          </div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">Our Philosophy</span>
          <h2>Rooted in Earth, Perfected by Science.</h2>
          <p>
            At Lumina, we don't believe in quick fixes. We believe in the ritual of care. Our
            journey began in a small botanical lab, where we sought to bridge the gap between
            ancient herbal wisdom and modern dermatological breakthroughs.
          </p>
          <p>
            Every drop in our collection is sustainably sourced and meticulously tested, ensuring
            that your path to radiance is as ethical as it is effective.
          </p>
          <a className="story-link" href="#">
            Read our full story
          </a>
        </div>
      </div>
    </section>
  );
}