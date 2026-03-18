import { motion } from "framer-motion";
import { Leaf, Zap, ShieldBan, Package, CheckSquare } from "lucide-react";

const trustItems = [
  { icon: Leaf, label: "100% ÄTHERISCHE ÖLE" },
  { icon: Zap, label: "INSTANT-WIRKUNG IN 2 SEK" },
  { icon: ShieldBan, label: "KEIN KOFFEIN, KEIN CRASH" },
  { icon: Package, label: "VERSAND IN 24H" },
  { icon: CheckSquare, label: "100% LEGAL & VEGAN" },
];

const TrustBar = () => {
  return (
    <section className="bg-foreground py-6 md:py-8">
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
              <item.icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              <span className="text-xs md:text-sm font-bold text-muted-foreground tracking-wide">
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
