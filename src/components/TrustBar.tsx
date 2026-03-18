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
    <section className="bg-background py-8 md:py-10">
      <div className="container mx-auto">
        <motion.div
          className="comic-card bg-card p-5 md:p-6 flex flex-wrap justify-center gap-6 md:gap-10"
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
              <span className="text-[11px] md:text-sm font-extrabold text-foreground tracking-wide">
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
