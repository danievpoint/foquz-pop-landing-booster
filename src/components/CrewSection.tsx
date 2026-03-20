import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section
      className="w-full overflow-hidden -mt-px -mb-px"
      style={{ height: "clamp(380px, 37vw, 620px)" }}
    >
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="w-full h-full object-cover block md:object-position-center"
        style={{ objectPosition: "120% 72%" }}
        loading="lazy"
      />
      <style>{`
        @media (min-width: 1024px) {
          .md\\:object-position-center { object-position: center 72% !important; }
        }
      `}</style>
    </section>
  );
};

export default CrewSection;
