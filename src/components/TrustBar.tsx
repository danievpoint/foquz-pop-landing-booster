import { motion } from "framer-motion";

const trustItems = [
  { emoji: "🌿", label: "100% ÄTHERISCHE ÖLE" },
  { emoji: "⚡", label: "INSTANT-WIRKUNG IN 2 SEK" },
  { emoji: "🚫", label: "KEIN KOFFEIN, KEIN CRASH" },
  { emoji: "📦", label: "VERSAND IN 24H" },
  { emoji: "✅", label: "100% LEGAL & VEGAN" },
];

const TrustBar = () => {
  return (
    <section className="relative py-10 md:py-14 overflow-hidden bg-primary">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.h3
          className="text-center text-primary-foreground font-black text-xl md:text-2xl mb-8 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          WARUM FOQUZ?
        </motion.h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              className={`flex flex-col items-center text-center gap-3 p-4 md:p-5 rounded-2xl border-2 border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-colors ${
                i === 4 ? "col-span-2 md:col-span-1 mx-auto w-full max-w-[200px] md:max-w-none" : ""
              }`}
            >
              <motion.span
                className="text-3xl md:text-4xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {item.emoji}
              </motion.span>
              <span className="text-[10px] md:text-xs font-extrabold text-primary-foreground leading-tight tracking-wide">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
