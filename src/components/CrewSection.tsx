import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: narrower by clipping top/bottom, still full width */}
      <div className="hidden md:flex w-full max-h-[380px] lg:max-h-[440px] xl:max-h-[520px] overflow-hidden items-start">
        <img src={crewBg} alt="FOQUZ Crew" className="w-full h-auto" loading="lazy" />
      </div>
      {/* Mobile: unchanged */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full h-auto" loading="lazy" />
    </section>
  );
};

export default CrewSection;
