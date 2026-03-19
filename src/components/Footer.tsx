import { Link } from "react-router-dom";
import foquzLogo from "@/assets/foquz-logo.png";

const Footer = () => {
  return (
    <footer className="bg-background pt-8 md:pt-12 pb-6 md:pb-8" style={{ containerType: 'inline-size' }}>
      <style>{`
        @container (min-width: 1024px) {
          .ft-logo { height: clamp(3rem, 4cqw, 4rem); margin-bottom: clamp(0.375rem, 0.6cqw, 0.625rem); }
          .ft-claim { font-size: clamp(0.875rem, 1cqw, 1rem); }
          .ft-heading { font-size: clamp(0.75rem, 0.9cqw, 0.875rem); margin-bottom: clamp(0.5rem, 0.8cqw, 0.875rem); }
          .ft-link { font-size: clamp(0.7rem, 0.8cqw, 0.875rem); }
          .ft-links { gap: clamp(0.25rem, 0.4cqw, 0.5rem); }
          .ft-grid { gap: clamp(1rem, 1.5cqw, 1.5rem); margin-bottom: clamp(1.5rem, 2cqw, 2rem); }
          .ft-social svg { width: clamp(1.5rem, 2cqw, 2rem); height: clamp(1.5rem, 2cqw, 2rem); }
          .ft-social { gap: clamp(0.5rem, 0.8cqw, 0.875rem); }
          .ft-copy { font-size: clamp(0.625rem, 0.7cqw, 0.75rem); }
          .ft-payment { font-size: clamp(0.625rem, 0.7cqw, 0.75rem); padding: clamp(0.1875rem, 0.3cqw, 0.375rem) clamp(0.375rem, 0.6cqw, 0.625rem); }
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 md:gap-6 mb-6 md:mb-10 ft-grid">
          {/* Logo & Claim + Social */}
          <div className="col-span-2 md:col-span-1">
            <img src={foquzLogo} alt="FOQUZ" className="h-14 md:h-20 mb-2 md:mb-3 -ml-2 ft-logo" />
            <p className="text-sm md:text-lg opacity-80 mb-0.5 md:mb-1 font-bold ft-claim">
               Die Original Foquz Riechdose aus Deutschland.
            </p>
            <p className="text-sm md:text-lg opacity-80 mb-3 md:mb-4 ft-claim">
              100% aromatisch, 100% legal, 100% Wolke 7!
            </p>
            <div className="flex items-center gap-3 md:gap-4 ft-social">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Facebook">
                <svg width="30" height="30" viewBox="0 0 48 48" className="md:w-9 md:h-9">
                  <circle cx="24" cy="24" r="24" fill="currentColor"/>
                  <path d="M29 25h-3.5v10h-4.5V25H18v-4h3v-2.5c0-3.1 1.9-4.5 4.4-4.5 1.3 0 2.6.2 2.6.2v3h-1.5c-1.4 0-1.9.9-1.9 1.8V21h3.4l-.5 4z" fill="white"/>
                </svg>
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Instagram">
                <svg width="30" height="30" viewBox="0 0 48 48" className="md:w-9 md:h-9">
                  <circle cx="24" cy="24" r="24" fill="currentColor"/>
                  <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="white" strokeWidth="2.5"/>
                  <circle cx="24" cy="24" r="5" fill="none" stroke="white" strokeWidth="2.5"/>
                  <circle cx="30.5" cy="17.5" r="1.5" fill="white"/>
                </svg>
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="TikTok">
                <svg width="30" height="30" viewBox="0 0 48 48" className="md:w-9 md:h-9">
                  <circle cx="24" cy="24" r="24" fill="currentColor"/>
                  <path d="M30 16.5a5.5 5.5 0 003.5 2v3.5a9 9 0 01-3.5-.7v7.7a7 7 0 11-7-7v3.5a3.5 3.5 0 103.5 3.5V14h3.5v2.5z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4 ft-heading">SHOP</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80 ft-links">
              <li><Link to="/#sorten" className="hover:opacity-100 transition-opacity ft-link">Produkte</Link></li>
              <li><Link to="/#bundle" className="hover:opacity-100 transition-opacity ft-link">Bundle</Link></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity ft-link">Gutschein</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4 ft-heading">INFO</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80 ft-links">
              <li><Link to="/ueber-uns" className="hover:opacity-100 transition-opacity ft-link">Über uns</Link></li>
              <li><Link to="/faq" className="hover:opacity-100 transition-opacity ft-link">FAQ</Link></li>
              <li><Link to="/das-ist-drin" className="hover:opacity-100 transition-opacity ft-link">Das ist drin</Link></li>
              <li><Link to="/anleitung" className="hover:opacity-100 transition-opacity ft-link">Anleitung</Link></li>
              <li><Link to="/b2b-anfragen" className="hover:opacity-100 transition-opacity ft-link">B2B Anfragen</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4 ft-heading">LEGAL</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80 ft-links">
              <li><Link to="/impressum" className="hover:opacity-100 transition-opacity ft-link">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:opacity-100 transition-opacity ft-link">Datenschutz</Link></li>
              <li><Link to="/agb" className="hover:opacity-100 transition-opacity ft-link">AGB</Link></li>
              <li><Link to="/widerrufsbelehrung" className="hover:opacity-100 transition-opacity ft-link">Widerrufsbelehrung</Link></li>
              <li><Link to="/versandbedingungen" className="hover:opacity-100 transition-opacity ft-link">Versandbedingungen</Link></li>
            </ul>
          </div>

          {/* Hilfe + Payment */}
          <div className="flex flex-col">
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4 ft-heading">HILFE</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80 mb-3 md:mb-4 ft-links">
              <li><Link to="/hilfe" className="hover:opacity-100 transition-opacity ft-link">Help Center</Link></li>
              <li><Link to="/faq" className="hover:opacity-100 transition-opacity ft-link">FAQ</Link></li>
              <li><Link to="/versandbedingungen" className="hover:opacity-100 transition-opacity ft-link">Versand</Link></li>
            </ul>
            <div className="flex gap-1.5 md:gap-2 mt-auto pt-3 md:pt-4 flex-wrap">
              {["PayPal", "Klarna", "VISA"].map((method) => (
                <div
                  key={method}
                  className="bg-foreground/10 border border-foreground/20 rounded-md px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold select-none ft-payment"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/20 pt-4 md:pt-6 text-center text-[10px] md:text-xs opacity-60 ft-copy">
          © 2026 FOQUZ. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;