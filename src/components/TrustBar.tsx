import { motion } from "framer-motion";
import iconWappen from "@/assets/icon-wappen.svg";
import iconStern from "@/assets/icon-stern.svg";
import iconBlitz from "@/assets/icon-blitz.svg";
import trustWoman from "@/assets/trust-woman.png";

const stats = [
  { icon: iconWappen, value: "50k+", label: "Kunden" },
  { icon: iconStern, value: "4.9", label: "Sterne" },
  { icon: iconBlitz, value: "2 Sek", label: "Wirkung" },
];

const TrustBar = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#6bbaa0" }}
    >
      {/* Background image */}
      <img
        src={trustWoman}
        alt="Frau mit FOQUZ Produkt"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content overlay – consistent positioning */}
      <div className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="flex flex-col items-start max-w-md">
            <motion.h2
              className="text-4xl md:text-[60px] md:leading-[0.9] mb-10 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              VON PERFORMERN GEFEIERT
            </motion.h2>
            <div className="flex flex-col gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <motion.img
                    src={s.icon}
                    alt={s.label}
                    className="w-20 h-20 md:w-28 md:h-28"
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  />
                  <div>
                    <span className="text-3xl md:text-4xl font-black block text-white">{s.value}</span>
                    <span className="text-base font-bold uppercase text-white">{s.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
