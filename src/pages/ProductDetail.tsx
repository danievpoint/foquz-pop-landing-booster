import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useProductAvailability } from "@/hooks/useProductAvailability";
import StockBadge from "@/components/StockBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();
  const { isAvailable } = useProductAvailability();

  const product = products.find((p) => p.handle === handle);
  const otherProducts = products.filter((p) => p.handle !== handle);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-2">Produkt nicht gefunden</h1>
          <Link to="/#sorten" className="text-primary underline font-semibold">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back link */}
      <div className="container mx-auto px-4 pt-24 md:pt-28">
        <Link
          to="/#sorten"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Alle Sorten
        </Link>
      </div>

      {/* Product detail */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="py-4"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-base md:text-lg mb-6 whitespace-pre-line">
              {product.desc}
            </p>

            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl md:text-4xl font-black">{product.price}</span>
              <StockBadge available={isAvailable(product.name)} />
            </div>
            <span className="text-xs text-muted-foreground mb-6 block">inkl. MwSt.</span>

            <button
              onClick={() =>
                addToCart(1, {
                  id: product.name,
                  name: product.name,
                  price: product.numericPrice,
                  image: product.image,
                })
              }
              className="comic-btn text-sm md:text-base py-3 px-10 font-black mb-8"
              style={{ backgroundColor: product.color, color: "#000" }}
            >
              FOKUS SICHERN
            </button>

            {/* Ingredients */}
            <div className="border-t-2 border-foreground/10 pt-6">
              <h3 className="font-extrabold text-lg mb-4">WAS STECKT DRIN?</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ backgroundColor: "#ffd618" }}
                    >
                      ✓
                    </span>
                    {ing}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-bold text-muted-foreground mt-4">
                100% Natur. Ohne Chemie. Ohne Bullshit.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other products */}
      <section className="bg-card/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-8">
            ENTDECKE AUCH
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {otherProducts.map((p) => (
              <Link
                key={p.handle}
                to={`/produkt/${p.handle}`}
                className="group rounded-2xl overflow-hidden bg-card border-2 border-foreground/5 hover:border-foreground/20 transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-base mb-0.5">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg">{p.price}</span>
                    <StockBadge available={isAvailable(p.name)} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
