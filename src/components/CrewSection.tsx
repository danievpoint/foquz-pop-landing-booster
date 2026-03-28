import crewBg from "@/assets/crew-bg.svg";
import crewBgDesktop from "@/assets/crew-bg-desktop.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden -mt-px -mb-px">
      {/* Desktop: scale proportionally and keep the sign visible */}
      <div className="hidden md:block w-full aspect-[16/6] overflow-hidden">
        <img
          src={crewBgDesktop}
          alt="FOQUZ Crew"
          className="w-full h-full object-cover [object-position:center_82%]"
          loading="lazy"
        />
      </div>
      {/* Mobile: full image */}
      <img src={crewBg} alt="FOQUZ Crew" className="md:hidden w-full h-auto" loading="lazy" />
    </section>
  );
};

export default CrewSection;
