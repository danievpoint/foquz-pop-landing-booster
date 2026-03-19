import crewBg from "@/assets/crew-bg.svg";

const CrewSection = () => {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <img
          src={crewBg}
          alt="FOQUZ Crew"
          className="w-full max-w-3xl mx-auto h-auto block"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default CrewSection;
