import { motion } from "framer-motion";
import whyfoquzBg from "@/assets/whyfoquz-bg.png";
import iconYourFocus from "@/assets/icon-your-focus.svg";
import iconYourCloud from "@/assets/icon-your-cloud.svg";
import iconYourNose from "@/assets/icon-your-nose.svg";
import iconStayFresh from "@/assets/icon-stay-fresh.svg";

const points = [
  { title: "YOUR FOCUS:", text: "Einfach kurz durchatmen.", icon: iconYourFocus },
  { title: "YOUR CLOUD:", text: "Du entscheidest was du riechst.", icon: iconYourCloud },
  { title: "YOUR NOSE:", text: "Nasenspray war gestern.", icon: iconYourNose },
  { title: "STAY FRESH:", text: "Energie die nicht lügt.", icon: iconStayFresh },
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
      style={{ containerType: 'inline-size' }}
    >
      <style>{`
        @container (min-width: 1024px) {
          .why-headline { font-size: clamp(1.875rem, 3cqw, 3rem); line-height: 0.95; margin-bottom: clamp(1rem, 1.5cqw, 1.5rem); }
          .why-point-title { font-size: clamp(1.125rem, 1.5cqw, 1.5rem); }
          .why-point-text { font-size: clamp(0.875rem, 0.95cqw, 1rem); }
          .why-points { gap: clamp(0.75rem, 1.2cqw, 1.25rem); margin-bottom: clamp(1rem, 1.5cqw, 1.5rem); }
          .why-bubble { padding: clamp(1.25rem, 2cqw, 2rem) clamp(1.5rem, 2.5cqw, 2.5rem); }
        }
      `}</style>
      <img src={whyfoquzBg} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <div className="hidden lg:block lg:w-1/2" />

          <div className="w-full lg:w-1/2">
            <SpeechBubble>
              <h2 className="text-3xl md:text-[42px] md:leading-[0.95] text-foreground mb-6 lg:mb-10 why-headline">
                DAS IST FOQUZ.
              </h2>

              <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8 why-points">
                {points.map((p) => (
                  <div key={p.title} className="flex items-center gap-4">
                    <img src={p.icon} alt={p.title} className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 shrink-0" />
                    <div>
                      <h3 className="text-lg md:text-2xl font-extrabold text-foreground mb-0.5 why-point-title">
                        {p.title}
                      </h3>
                      <p className="text-foreground/80 text-sm md:text-base font-medium leading-relaxed why-point-text">
                        {p.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-foreground/20 pt-4 lg:pt-6">
                <p className="text-foreground/90 text-xs md:text-sm lg:text-base font-medium leading-relaxed why-point-text">
                  <span className="font-extrabold">FOQUZ</span> ist der erste Fokus-Boost für die Nase — entwickelt für alle, die einen klaren Kopf brauchen, genau dann wenn es drauf ankommt. Mit echten Kräutern und ätherischen Ölen sorgt er für sofortige Frische. Ob in der Tasche, am Schreibtisch, beim Lernen, Zocken oder im Auto — <span className="font-extrabold">FOQUZ</span> ist immer dabei, wenn du ihn brauchst.
                </p>
                <p className="text-foreground font-extrabold text-sm md:text-base lg:text-lg mt-3">
                  Kleine Dose, große Wirkung. Stay FOQUZD. 🚀
                </p>
              </div>
            </SpeechBubble>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFoquzSection;
