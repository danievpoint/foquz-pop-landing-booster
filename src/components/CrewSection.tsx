import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full overflow-hidden" style={{ maxHeight: "clamp(300px, 35vw, 600px)" }}>
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="w-full h-auto block"
        style={{ marginTop: "-10%" }}
        loading="lazy"
      />
    </section>
  );
};

export default CrewSection;
