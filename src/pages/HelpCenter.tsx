import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Search, HelpCircle, Truck, CreditCard, Package, FileText, Users, BookOpen } from "lucide-react";
import { useState } from "react";

const categories = [
  { title: "FAQ", description: "Häufig gestellte Fragen", icon: HelpCircle, link: "/faq", articles: 3 },
  { title: "Versand & Lieferung", description: "Versandbedingungen & Lieferzeiten", icon: Truck, link: "/versandbedingungen", articles: 1 },
  { title: "Widerrufsbelehrung", description: "Rückgabe & Widerruf", icon: Package, link: "/widerrufsbelehrung", articles: 1 },
  { title: "AGB", description: "Allgemeine Geschäftsbedingungen", icon: FileText, link: "/agb", articles: 1 },
  { title: "Das ist drin", description: "Inhaltsstoffe & Produktinfos", icon: BookOpen, link: "/das-ist-drin", articles: 1 },
  { title: "Anleitung", description: "So verwendest du FOQUZ", icon: BookOpen, link: "/anleitung", articles: 1 },
  { title: "B2B Anfragen", description: "Geschäftskunden & Großbestellungen", icon: Users, link: "/b2b-anfragen", articles: 1 },
  { title: "Datenschutz", description: "Datenschutzerklärung", icon: FileText, link: "/datenschutz", articles: 1 },
];

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  
  const filtered = categories.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-16">
          {/* Hero */}
          <div className="text-center mb-12 px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Wie können wir dir helfen?
            </h1>
            <p className="text-lg opacity-70 mb-8">
              Einfach Suchbegriff eingeben oder Thema auswählen.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input
                type="text"
                placeholder="Suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-foreground/20 bg-card text-foreground text-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category Grid */}
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((cat) => (
                <Link
                  key={cat.title}
                  to={cat.link}
                  className="group bg-card border-2 border-foreground/10 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200"
                >
                  <cat.icon className="w-10 h-10 mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
                  <p className="text-sm opacity-60">{cat.description}</p>
                  <p className="text-xs opacity-40 mt-2">{cat.articles} Artikel</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default HelpCenter;
