import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: narrower by clipping top/bottom, still full width */}
      <div className="hidden md:flex w-full <div className="hidden md:flex w-full max-h-[420px] lg:max-h-[480px] xl:max-h-[560px] overflow-hidden items-start"> overflow-hidden items-start">
        <img src={crewBg} alt="FOQUZ Crew" className="w-full h-auto" loading="lazy" />
      </div>
      {/* Mobile: unchanged */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full h-auto" loading="lazy" />
    </section>
  );
};

export default CrewSection;
