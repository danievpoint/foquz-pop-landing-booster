import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full">
      <img
        src={crewBg}
        alt="FOQUZ Crew"
        className="w-full h-auto block"
        loading="lazy"
      />
    </section>
  );
};

export default CrewSection;
