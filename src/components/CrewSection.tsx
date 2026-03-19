import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden" style={{ maxHeight: "clamp(350px, 40vw, 700px)" }}>
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="w-full h-auto block object-cover object-bottom"
        loading="lazy"
      />
    </section>
  );
};

export default CrewSection;
