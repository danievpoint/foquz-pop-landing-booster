import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: narrower by clipping top/bottom, still full width */}
      <div className="hidden md:block w-full max-h-[280px] lg:max-h-[340px] xl:max-h-[400px] overflow-hidden flex items-end">
        <img src={crewBg} alt="FOQUZ Crew" className="w-full h-auto" loading="lazy" />
      </div>
      {/* Mobile: unchanged */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full h-auto" loading="lazy" />
    </section>
  );
};

export default CrewSection;
