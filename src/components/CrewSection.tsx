import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: cover + right anchor, crops left side */}
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="hidden md:block w-full object-cover"
        style={{ objectPosition: "right 72%", height: "clamp(380px, 37vw, 620px)" }}
        loading="lazy"
      />
      {/* Mobile: contain so ALL characters are always visible */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full object-contain" loading="lazy" />
    </section>
  );
};

export default CrewSection;
