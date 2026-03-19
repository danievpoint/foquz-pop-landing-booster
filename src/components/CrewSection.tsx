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
        className="w-full h-full object-cover block"
        style={{ objectPosition: "center 72%" }}
        loading="lazy"
      />
    </section>
  );
};

export default CrewSection;
