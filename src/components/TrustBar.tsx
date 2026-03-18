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
    <section className="bg-secondary py-6 md:py-8">
      <div className="container mx-auto">
        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {trustItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="text-lg md:text-xl">{item.emoji}</span>
              <span className="text-xs md:text-sm font-extrabold text-secondary-foreground tracking-wide">
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
