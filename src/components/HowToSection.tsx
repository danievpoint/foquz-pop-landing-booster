import { motion } from "framer-motion";
import lifestyleImg from "@/assets/lifestyle-howto.png";
import howtoBgVideo from "@/assets/howto-bg-video.mp4";
import howtoIcon01 from "@/assets/howto-icon-01.svg";
import howtoIcon02 from "@/assets/howto-icon-02.svg";
import howtoIcon03 from "@/assets/howto-icon-03.svg";

const steps = [
  { num: "1", title: "DOSE AUF", icon: howtoIcon01 },
  { num: "2", title: "NASE DRAUF", icon: howtoIcon02 },
  { num: "3", title: "DURCHATMEN", icon: howtoIcon03 },
];

const HowToSection = () => {
  return (
    <section id="howto" className="relative overflow-hidden scroll-mt-20 -mt-px" style={{ backgroundColor: "#75559f" }}>
      <div className="relative min-h-[600px] md:min-h-[600px]" style={{ containerType: "inline-size" }}>
        <style>{`
          @container (min-width: 1024px) {
            .howto-title { font-size: clamp(1.75rem, 2.8cqw, 2.75rem); margin-bottom: clamp(0.75rem, 1.2cqw, 1.25rem); }
            .howto-step { font-size: clamp(0.875rem, 1.1cqw, 1.125rem); }
            .howto-steps { gap: clamp(0.5rem, 0.8cqw, 0.875rem); }
            .howto-card { padding: clamp(1.5rem, 2.5cqw, 2.5rem) clamp(1.5rem, 2.5cqw, 2.5rem); max-width: clamp(20rem, 30cqw, 32rem); }
            .howto-icon { width: clamp(4rem, 5.5cqw, 5.5rem); height: clamp(4rem, 5.5cqw, 5.5rem); }
            .howto-content { padding-top: clamp(3rem, 5cqw, 5rem); }
          }
        `}</style>
        <video
          src={howtoBgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="block w-full h-full object-cover absolute inset-0"
          style={{ contentVisibility: "auto" }}
        />
        <div className="relative z-10 container mx-auto section-padding pt-32 md:pt-40 howto-content">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true }}
            className="bg-card/85 comic-card p-4 md:p-6 lg:p-10 w-full max-w-[80vw] md:max-w-[400px] lg:max-w-[520px] transform -rotate-2 howto-card"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 lg:mb-6 howto-title">How to Foquz</h2>
            <div className="space-y-2 md:space-y-3 lg:space-y-4 howto-steps">
              {steps.map((s) => (
                <div key={s.num} className="flex items-center gap-3 md:gap-4">
                  <img
                    src={s.icon}
                    alt={`Schritt ${s.num}`}
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-28 lg:h-28 shrink-0 howto-icon"
                  />
                  <p className="text-base md:text-lg lg:text-xl howto-step whitespace-nowrap">
                    <span className="font-extrabold">
                      {s.num}. {s.title}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bg-foquz-thai section-padding" style={{ containerType: "inline-size" }}>
        <style>{`
          @container (min-width: 1024px) {
            .howto-banner { font-size: clamp(1.25rem, 2cqw, 2rem); }
          }
        `}</style>
        <div className="container mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-extrabold text-card uppercase howto-banner"
          >
            100% aromatisch. 100% legal. 100% Wolke 7.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HowToSection;
