import { motion } from "framer-motion";
import iconLeaf from "@/assets/icon-trust-leaf.png";
import iconBolt from "@/assets/icon-trust-bolt.png";
import iconNoCoffee from "@/assets/icon-trust-nocoffee.png";
import iconShipping from "@/assets/icon-trust-shipping.png";
import iconLegal from "@/assets/icon-trust-legal.png";

const trustItems = [
  { icon: iconLeaf, label: "100% ÄTHERISCHE ÖLE" },
  { icon: iconBolt, label: "INSTANT-WIRKUNG IN 2 SEK" },
  { icon: iconNoCoffee, label: "KEIN KOFFEIN, KEIN CRASH" },
  { icon: iconShipping, label: "VERSAND IN 24H" },
  { icon: iconLegal, label: "100% LEGAL & VEGAN" },
];

const TrustBar = () => {
  return (
    <section className="bg-background py-8 md:py-10" style={{ containerType: 'inline-size' }}>
      <style>{`
        @container (min-width: 1024px) {
          .trust-label { font-size: clamp(0.7rem, 0.85cqw, 0.875rem); }
          .trust-icon { width: clamp(1.5rem, 2cqw, 2rem); height: clamp(1.5rem, 2cqw, 2rem); }
          .trust-card { padding: clamp(0.875rem, 1.2cqw, 1.25rem) clamp(1rem, 1.5cqw, 1.5rem); gap: clamp(1.25rem, 2cqw, 2rem); }
          .trust-item { gap: clamp(0.3rem, 0.5cqw, 0.5rem); }
        }
      `}</style>
      <div className="container mx-auto">
        <motion.div
          className="comic-card bg-card p-5 md:p-6 flex flex-wrap justify-center gap-6 md:gap-10 trust-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {trustItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2 trust-item"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <img src={item.icon} alt="" className="w-7 h-7 md:w-8 md:h-8 object-contain trust-icon" />
              <span className="text-[11px] md:text-sm font-extrabold text-foreground tracking-wide trust-label">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
