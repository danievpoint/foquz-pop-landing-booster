import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: no fixed height, SVG scales naturally with full width */}
      <img src={crewBg} alt="FOQUZ Crew" className="hidden md:block w-full h-auto" loading="lazy" />
      {/* Mobile: same approach */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full h-auto" loading="lazy" />
    </section>
  );
};

export default CrewSection;
