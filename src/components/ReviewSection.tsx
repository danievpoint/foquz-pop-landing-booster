import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Max Mustermann",
    date: "12.01.2026",
    text: "Absoluter Gamechanger! Nutze FOQUZ jetzt vor jeder Klausur. 10/10 würde wieder riechen.",
    color: "bg-foquz-watermelon-light",
  },
  {
    name: "Max Mustermann",
    date: "05.12.2025",
    text: "Watermelon Flex ist mein Go-To. Riecht mega und macht sofort wach. Besser als Kaffee!",
    color: "bg-foquz-thai-light",
  },
  {
    name: "Max Mustermann",
    date: "23.11.2025",
    text: "Hab's erst nicht geglaubt, aber nach 2 Sekunden war ich hellwach. Geniale Idee!",
    color: "bg-foquz-lemon-light",
  },
];

const ReviewSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, reviews.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="reviews" className="section-padding pt-10 md:pt-24 min-h-0 md:min-h-[600px] scroll-mt-20" style={{ backgroundColor: '#ffd618', containerType: 'inline-size' }}>
      <style>{`
        @container (min-width: 1024px) {
          .review-headline { font-size: 3.8cqw; line-height: 0.9; margin-bottom: 0.8cqw; }
          .review-subtitle { font-size: 1.1cqw; }
          .review-grid { gap: 2cqw; padding-bottom: 1cqw; }
          .review-card { padding: 1.3cqw; }
          .review-avatar { width: 3.5cqw; height: 3.5cqw; font-size: 1.1cqw; }
          .review-star { width: 1.2cqw; height: 1.2cqw; }
          .review-name { font-size: 1cqw; }
          .review-date { font-size: 0.8cqw; }
          .review-text { font-size: 0.95cqw; }
          .review-header { gap: 1cqw; margin-bottom: 1cqw; }
          .review-stars { gap: 0.2cqw; margin-bottom: 0.2cqw; }
          .review-section-header { margin-bottom: 2.5cqw; }
        }
      `}</style>
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-6 md:mb-12 review-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-[60px] md:leading-[0.9] mb-2 md:mb-4 review-headline">
            DIE COMMUNITY IST BEGEISTERT
          </h2>
          <p className="text-muted-foreground font-medium text-sm md:text-lg max-w-2xl mx-auto review-subtitle">Über 50.000 Performer vertrauen bereits auf FOQUZ.<br />Das sagen sie über ihren täglichen Gamechanger.</p>
        </motion.div>

        {/* Mobile: full-width cards, swipeable / Desktop: grid */}
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pt-0 review-grid"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" as any, touchAction: "pan-x", overscrollBehaviorY: "none", overflowY: "hidden" }}
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 w-full min-w-full snap-center px-6 lg:w-auto lg:min-w-0 lg:px-0"
            >
              <div className="comic-card bg-card p-5 review-card">
                <div className="flex items-center gap-4 mb-4 review-header">
                  <div className={`w-14 h-14 rounded-full ${r.color} comic-outline flex items-center justify-center font-black text-lg review-avatar`}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1 review-stars">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-foquz-lemon text-foreground review-star" />
                      ))}
                    </div>
                    <p className="font-extrabold text-base review-name">{r.name}</p>
                    <p className="text-sm text-muted-foreground review-date">{r.date}</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed review-text">"{r.text}"</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dot indicators – mobile only */}
        <div className="flex lg:hidden justify-center gap-3 mt-4">
          {reviews.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${i === activeIndex ? "bg-foreground" : "bg-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
