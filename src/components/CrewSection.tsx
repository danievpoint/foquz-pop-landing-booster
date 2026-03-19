import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section
      className="w-full overflow-hidden -mt-px -mb-px"
      style={{ height: "clamp(320px, 34vw, 540px)" }}
    >
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="w-full h-full object-cover object-bottom block"
        loading="lazy"
      />
    </section>
  );
};

export default CrewSection;
