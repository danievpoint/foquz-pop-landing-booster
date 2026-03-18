import foquzLogo from "@/assets/foquz-logo.png";

const Footer = () => {
  return (
    <footer className="bg-background pt-8 md:pt-12 pb-6 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 md:gap-6 mb-6 md:mb-10">
          {/* Logo & Claim + Social */}
          <div className="col-span-2 md:col-span-1">
            <img src={foquzLogo} alt="FOQUZ" className="h-14 md:h-20 mb-2 md:mb-3 -ml-2" />
            <p className="text-sm md:text-lg opacity-80 mb-0.5 md:mb-1 font-bold">
               Die Original Foquz Riechdose aus Deutschland.
            </p>
            <p className="text-sm md:text-lg opacity-80 mb-3 md:mb-4">
              100% aromatisch, 100% legal, 100% Wolke 7!
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              {/* Facebook */}
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Facebook">
                <svg width="30" height="30" viewBox="0 0 48 48" className="md:w-9 md:h-9">
                  <circle cx="24" cy="24" r="24" fill="currentColor"/>
                  <path d="M29 25h-3.5v10h-4.5V25H18v-4h3v-2.5c0-3.1 1.9-4.5 4.4-4.5 1.3 0 2.6.2 2.6.2v3h-1.5c-1.4 0-1.9.9-1.9 1.8V21h3.4l-.5 4z" fill="white"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="Instagram">
                <svg width="30" height="30" viewBox="0 0 48 48" className="md:w-9 md:h-9">
                  <circle cx="24" cy="24" r="24" fill="currentColor"/>
                  <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="white" strokeWidth="2.5"/>
                  <circle cx="24" cy="24" r="5" fill="none" stroke="white" strokeWidth="2.5"/>
                  <circle cx="30.5" cy="17.5" r="1.5" fill="white"/>
                </svg>
              </a>
              {/* TikTok */}
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
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4">SHOP</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80">
              <li><a href="/#sorten" className="hover:opacity-100 transition-opacity">Produkte</a></li>
              <li><a href="/#bundle" className="hover:opacity-100 transition-opacity">Bundle</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Gutschein</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4">INFO</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80">
              <li><a href="/ueber-uns" className="hover:opacity-100 transition-opacity">Über uns</a></li>
              <li><a href="/faq" className="hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="/das-ist-drin" className="hover:opacity-100 transition-opacity">Das ist drin</a></li>
              <li><a href="/anleitung" className="hover:opacity-100 transition-opacity">Anleitung</a></li>
              <li><a href="/b2b-anfragen" className="hover:opacity-100 transition-opacity">B2B Anfragen</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4">LEGAL</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80">
              <li><a href="/impressum" className="hover:opacity-100 transition-opacity">Impressum</a></li>
              <li><a href="/datenschutz" className="hover:opacity-100 transition-opacity">Datenschutz</a></li>
              <li><a href="/agb" className="hover:opacity-100 transition-opacity">AGB</a></li>
              <li><a href="/widerrufsbelehrung" className="hover:opacity-100 transition-opacity">Widerrufsbelehrung</a></li>
              <li><a href="/versandbedingungen" className="hover:opacity-100 transition-opacity">Versandbedingungen</a></li>
            </ul>
          </div>

          {/* Hilfe + Payment */}
          <div className="flex flex-col">
            <h4 className="text-sm md:text-base font-extrabold mb-2 md:mb-4">HILFE</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm opacity-80 mb-3 md:mb-4">
              <li><a href="/hilfe" className="hover:opacity-100 transition-opacity">Help Center</a></li>
              <li><a href="/faq" className="hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="/versandbedingungen" className="hover:opacity-100 transition-opacity">Versand</a></li>
            </ul>
            <div className="flex gap-1.5 md:gap-2 mt-auto pt-3 md:pt-4 flex-wrap">
              {["PayPal", "Klarna", "VISA"].map((method) => (
                <div
                  key={method}
                  className="bg-foreground/10 border border-foreground/20 rounded-md px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold select-none"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/20 pt-4 md:pt-6 text-center text-[10px] md:text-xs opacity-60">
          © 2026 FOQUZ. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
