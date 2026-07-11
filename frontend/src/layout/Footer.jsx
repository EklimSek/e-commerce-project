import { Link } from "react-router-dom";
import { Globe, Camera, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { label: "Privacy Policy",     to: "/privacy" },
  { label: "Terms of Service",   to: "/terms" },
  { label: "Shipping & Returns", to: "/shipping" },
  { label: "Contact Us",         to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Main grid ── */}
      <div className="footer__inner">

        {/* Col 1 + 2 — Brand (spans 2 cols on desktop) */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">LUMINA</Link>
          <p className="footer__tagline">
            Elevating daily routines into sacred rituals through the lens of
            modern dermatological science and pure botanical extracts.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social-btn" aria-label="Website">
              <Globe size={20} strokeWidth={1.25} />
            </a>
            <a href="#" className="footer__social-btn" aria-label="Instagram">
              <Camera size={20} strokeWidth={1.25} />
            </a>
          </div>
        </div>

        {/* Col 3 — Quick Links */}
        <div className="footer__col">
          <p className="footer__col-heading">Quick Links</p>
          <div className="footer__links">
            {QUICK_LINKS.map(({ label, to }) => (
              <Link key={to} to={to} className="footer__link">{label}</Link>
            ))}
          </div>
        </div>

        {/* Col 4 — Newsletter */}
        <div className="footer__col">
          <p className="footer__col-heading">Newsletter</p>
          <p className="footer__newsletter-copy">
            Join our community for ritual guides and early access.
          </p>
          <div className="footer__newsletter-wrap">
            <input
              type="email"
              className="footer__newsletter-input"
              placeholder="email address"
              aria-label="Email address for newsletter"
            />
            <button className="footer__newsletter-btn" aria-label="Subscribe">
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>

      {/* ── Copyright bar ── */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} Lumina Skincare. Science meets Nature.
        </p>
      </div>

    </footer>
  );
}