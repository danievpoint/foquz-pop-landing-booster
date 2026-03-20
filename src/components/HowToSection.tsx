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
    <section id="howto" className="relative overflow-hidden scroll-mt-20 -mt-px">
      {/* Full-width lifestyle image */}
      <div className="relative min-h-[600px] md:min-h-[600px]" style={{ containerType: 'inline-size' }}>
        <style>{`
          @container (min-width: 1024px) {
            .howto-title { font-size: clamp(1.75rem, 2.8cqw, 2.75rem); margin-bottom: clamp(0.75rem, 1.2cqw, 1.25rem); }
            .howto-step { font-size: clamp(0.875rem, 1.1cqw, 1.125rem); }
            .howto-steps { gap: clamp(0.5rem, 0.8cqw, 0.875rem); }
            .howto-card { padding: clamp(1rem, 1.5cqw, 1.5rem) clamp(1.25rem, 2cqw, 2rem); max-width: clamp(12rem, 18cqw, 18rem); }
            .howto-content { padding-top: clamp(3rem, 5cqw, 5rem); }
          }
        `}</style>
        <video
          src={howtoBgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover absolute inset-0"
          style={{ contentVisibility: 'auto' }}
        />

        {/* Overlapping white text box */}
        <div className="relative z-10 container mx-auto section-padding pt-32 md:pt-40 howto-content">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true }}
            className="bg-card comic-card p-6 md:p-10 max-w-[340px] md:max-w-[520px] transform -rotate-2 howto-card"
          >
            <h2 className="text-3xl md:text-4xl mb-6 howto-title">How to Foquz</h2>
            <div className="space-y-4 howto-steps">
              {steps.map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <img src={s.icon} alt={`Schritt ${s.num}`} className="w-24 h-24 md:w-28 md:h-28 shrink-0" />
                  <p className="text-base howto-step">
                    <span className="font-extrabold">{s.num}. {s.title}</span>
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mint colored section below */}
      <div className="bg-foquz-thai section-padding" style={{ containerType: 'inline-size' }}>
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
