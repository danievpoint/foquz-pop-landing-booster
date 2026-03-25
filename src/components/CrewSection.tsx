import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: use aspect-ratio to scale proportionally, clip top via object-position */}
      <div className="hidden md:block w-full aspect-[16/5] overflow-hidden">
        <img
          src={crewBg}
          alt="FOQUZ Crew"
          className="w-full h-full object-cover object-bottom"
          loading="lazy"
        />
      </div>
      {/* Mobile: full image */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full h-auto" loading="lazy" />
    </section>
  );
};

export default CrewSection;
