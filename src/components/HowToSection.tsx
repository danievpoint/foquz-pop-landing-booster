import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import howtoBgVideo from "@/assets/howto-bg-video.mp4";

const steps = [
  { num: "1", title: "Dose auf:", desc: "Dreh den Deckel deiner Lieblingssorte auf." },
  { num: "2", title: "Tief einatmen:", desc: "Ein kräftiger Zug durch die Nase genügt." },
  { num: "3", title: "Fokus an:", desc: "Spüre die Wirkung in nur 2 Sekunden." },
];

const HowToSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !videoLoaded) {
          setVideoLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoLoaded]);

  useEffect(() => {
    if (videoLoaded && videoRef.current) {
      videoRef.current.src = howtoBgVideo;
      videoRef.current.load();
    }
  }, [videoLoaded]);

  return (
    <section id="howto" ref={sectionRef} className="relative overflow-hidden scroll-mt-20">
      <div className="relative min-h-[600px] md:min-h-[600px]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover absolute inset-0"
        />

        {/* Overlapping white text box */}
        <div className="relative z-10 container mx-auto section-padding pt-32 md:pt-40">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true }}
            className="bg-card comic-card p-5 md:p-8 max-w-[260px] transform -rotate-2"
          >
            <h2 className="text-3xl md:text-4xl mb-6">So gehts...</h2>
            <div className="space-y-4">
              {steps.map((s) => (
                <p key={s.num} className="text-base">
                  <span className="font-extrabold">{s.num}. {s.title}</span>{" "}
                  {s.desc}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mint colored section below */}
      <div className="bg-foquz-thai section-padding">
        <div className="container mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-extrabold text-card uppercase"
          >
            100% aromatisch. 100% legal. 100% Wolke 7.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HowToSection;
