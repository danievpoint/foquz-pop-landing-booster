import { motion } from "framer-motion";
import whyfoquzBg from "@/assets/whyfoquz-bg.png";
import iconInstantFocus from "@/assets/icon-instant-focus.png";
import iconStayCool from "@/assets/icon-stay-cool.png";
import iconPureRefresh from "@/assets/icon-pure-refresh.png";
import iconGeilerGeruch from "@/assets/icon-geiler-geruch.png";

const pillars = [
  {
    title: "INSTANT FOCUS",
    text: "Vergiss das Warten auf die Wirkung. Einmal tief einatmen und du bist im Tunnel. In 2 Sekunden von 0 auf 100 – genau dann, wenn du es brauchst.",
    shortText: "In 2 Sekunden von 0 auf 100.",
    icon: iconInstantFocus,
  },
  {
    title: "STAY COOL",
    text: "Maximale Performance ohne das Zittern. Wir liefern dir den Fokus-Kick ohne den künstlichen Energy-Drink-Crash. Deine Energie bleibt konstant, dein Kopf bleibt klar.",
    shortText: "Fokus-Kick ohne Crash.",
    icon: iconStayCool,
  },
  {
    title: "PURE REFRESH",
    text: "100% Natur, 0% Bullshit. Ätherische Öle, die dein System fluten und deine Sinne wecken. Vegan, zuckerfrei und so erfrischend wie ein neuer Morgen.",
    shortText: "100% Natur, 0% Bullshit.",
    icon: iconPureRefresh,
  },
  {
    title: "GEILER GERUCH",
    text: "Drei einzigartige Sorten, die deine Sinne flashen. Jeder Duft ein Erlebnis – so gut, dass du nicht mehr aufhören willst.",
    shortText: "Drei Sorten, die flashen.",
    icon: iconGeilerGeruch,
  },
];

const SpeechBubble = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    <div
      className="relative rounded-2xl border-2 border-foreground px-6 py-8 lg:px-10 lg:py-10"
      style={{
        backgroundColor: "hsl(48, 100%, 55%)",
        boxShadow: "4px 4px 0px 0px #000",
      }}
    >
      {children}
    </div>
  </div>
);

const WhyFoquzSection = () => {
  return (
    <section
      className="section-padding py-12 md:py-32 min-h-fit md:h-auto flex items-center relative overflow-hidden"
    >
      <img src={whyfoquzBg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left: empty space for background image to show */}
          <div className="hidden lg:block lg:w-1/2" />

          {/* Right: stacked cards in one box */}
          <div className="w-full lg:w-1/2">
            <SpeechBubble>
              <motion.h2
                className="text-3xl md:text-[42px] md:leading-[0.95] text-foreground mb-6 lg:mb-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                DEIN GAMECHANGER.<br />KEINE AUSREDEN MEHR.
              </motion.h2>

              {/* Mobile: compact 2-col grid like Holy reference */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {pillars.map((p, i) => (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex flex-col items-center text-center"
                    >
                      <img src={p.icon} alt={p.title} loading="lazy" className="w-16 h-16 object-contain mb-2" />
                      <h3 className="text-sm font-extrabold text-foreground mb-1">
                        {p.title}
                      </h3>
                      <p className="text-foreground/80 text-xs font-medium leading-snug">
                        {p.shortText}
                      </p>
                    </motion.div>
                ))}
              </div>

              {/* Desktop: full text list */}
              <div className="hidden lg:flex flex-col gap-8">
                {pillars.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                      {p.title}
                    </h3>
                    <p className="text-foreground/80 text-base md:text-lg font-medium leading-relaxed">
                      {p.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </SpeechBubble>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFoquzSection;
