import { useState, useEffect } from "react";
import { Menu, X, Globe, HelpCircle, Search, User, ShoppingCart, ShoppingBag, Star, Layers, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import foquzLogo from "@/assets/foquz-logo-full.svg";
import navbarHeaderBgPng from "@/assets/navbar-header-bg.png";
import navbarHeaderBgSvg from "@/assets/navbar-header-bg.svg";
import navbarPattern from "@/assets/navbar-pattern.png";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import LoginModal from "@/components/LoginModal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const leftLinks = [
    { label: "START", href: "/", icon: ShoppingBag },
    { label: "PRODUKTE", href: "/#sorten", icon: ShoppingBag },
    { label: "BUNDLE", href: "/#bundle", icon: Layers },
  ];

  const rightLinks = [
    { label: "SO GEHTS", href: "/#howto", icon: BookOpen },
    { label: "REVIEWS", href: "/#reviews", icon: Star },
  ];

  const mobileLinks = [...leftLinks, ...rightLinks.filter(l => l.label === "SO GEHTS")];

  const iconClass = `transition-colors cursor-pointer ${scrolled ? "hover:text-primary" : "text-primary-foreground hover:opacity-80"}`;

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 border-b-[3px] border-foreground ${scrolled ? "shadow-md" : ""}`}
      style={{ willChange: 'transform', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Solid background fallback to prevent content showing through */}
        <div className="absolute inset-0 bg-[hsl(var(--foquz-lightblue))]" />
        {/* Mobile: PNG background */}
        <img src={navbarHeaderBgPng} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none lg:hidden" />
        {/* Desktop: SVG background, overflows downward */}
        <img src={navbarHeaderBgSvg} alt="" className="absolute top-[-86%] left-0 w-full h-[300%] object-contain object-top pointer-events-none hidden lg:block scale-[0.4]" />
      </div>
      <div className="container mx-auto flex items-center justify-center py-3 md:py-4 relative">
        {/* Desktop: left pill | centered logo | right pill */}
        <div className="hidden lg:flex items-center w-full justify-between">
          {/* Left pill */}
          <div className="flex items-center gap-4 rounded-full px-5 py-2.5 bg-secondary comic-outline">
            {leftLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-bold text-sm text-secondary-foreground hover:opacity-80 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Center logo */}
          {/* Logo removed */}

          {/* Right pill - cart only */}
          <div className="flex items-center gap-4 rounded-full px-5 py-2.5 bg-secondary comic-outline">
            <button className="relative" onClick={openCart}>
              <ShoppingCart size={18} className="text-secondary-foreground hover:opacity-80 transition-colors cursor-pointer" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center comic-outline">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile: burger left, logo center, cart right */}
        <div className="lg:hidden flex items-center justify-between w-full px-4">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full p-2 bg-card border-2 border-foreground shadow-lg">
            {mobileOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
          </button>
          <button className="relative rounded-full p-2 bg-card border-2 border-foreground shadow-lg" onClick={openCart}>
            <ShoppingCart size={20} className="text-foreground" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center comic-outline">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

    </nav>

    {/* Mobile menu - fullscreen white overlay OUTSIDE nav so it covers everything */}
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden fixed inset-x-0 top-0 z-[10000] bg-white flex flex-col" style={{ height: '66vh' }}>
        >
          {/* Top bar with X, logo, cart */}
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 bg-card border-2 border-foreground shadow-lg">
              <X size={24} className="text-foreground" />
            </button>
            <img src={foquzLogo} alt="FOQUZ" className="h-10" />
            <button className="relative rounded-full p-2 bg-card border-2 border-foreground shadow-lg" onClick={() => { setMobileOpen(false); openCart(); }}>
              <ShoppingCart size={20} className="text-foreground" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center comic-outline">
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Menu links */}
          <div className="pt-8 px-8">
            <div className="space-y-8">
              {mobileLinks.filter(l => l.label !== "START").map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-5 font-extrabold text-2xl uppercase tracking-wide text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <l.icon size={28} className="text-primary" />
                  {l.label}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <CartDrawer />
    <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;
