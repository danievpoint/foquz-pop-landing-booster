import { motion } from "framer-motion";
import whyfoquzBg from "@/assets/whyfoquz-bg.png";

const points = [
  { title: "YOUR FOCUS:", text: "Einfach kurz durchatmen." },
  { title: "YOUR CLOUD:", text: "Du entscheidest was du riechst." },
  { title: "YOUR NOSE:", text: "Nasenspray war gestern." },
  { title: "STAY FRESH:", text: "Energie die nicht lügt." },
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
      <img src={whyfoquzBg} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <div className="hidden lg:block lg:w-1/2" />

          <div className="w-full lg:w-1/2">
            <SpeechBubble>
              <h2 className="text-3xl md:text-[42px] md:leading-[0.95] text-foreground mb-6 lg:mb-10">
                DAS IST FOQUZ.
              </h2>

              <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8">
                {points.map((p) => (
                  <div key={p.title}>
                    <h3 className="text-lg md:text-2xl font-extrabold text-foreground mb-0.5">
                      {p.title}
                    </h3>
                    <p className="text-foreground/80 text-sm md:text-base font-medium leading-relaxed">
                      {p.text}
                    </p>
                  </div>
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
