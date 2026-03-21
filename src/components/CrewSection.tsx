import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px" style={{ backgroundColor: "#85c8b5" }}>
      {/* Desktop: contain so all characters are visible, bg color fills edges */}
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="hidden md:block w-full object-contain"
        style={{ height: "clamp(380px, 37vw, 620px)" }}
        loading="lazy"
      />
      {/* Mobile: contain, scales naturally */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full object-contain" loading="lazy" />
    </section>
  );
};

export default CrewSection;
