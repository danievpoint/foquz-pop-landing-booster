import { useEffect, useState } from "react";
import { campaignCountdown } from "@/lib/blackFriday";
export default function BlackFridayCountdown() {
  const [clock, setClock] = useState(() => campaignCountdown());
  useEffect(() => {
    const update = () => setClock(campaignCountdown());
    const timer = window.setInterval(update, 1000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  if (clock.phase === "ended") return null;
  const upcoming = clock.phase === "upcoming";
  return (
    <div className="border-y-[3px] border-black bg-[#FFD11A] px-3 py-2 text-center text-black">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs md:text-sm font-black">
        <span>BLACK FRIDAY: 50 % AUF ALLES</span>
        <div className="flex items-center gap-2">
          <span>{upcoming ? "Startet in" : "Endet in"}</span>
          <span role="timer" aria-live="off" aria-label={`${clock.hours} Stunden, ${clock.minutes} Minuten, ${clock.seconds} Sekunden`} className="rounded-md bg-black px-2 py-1 font-mono text-base md:text-lg tabular-nums text-[#FFD11A]">
            {[clock.hours, clock.minutes, clock.seconds].map(n => String(n).padStart(2, "0")).join(":")}
          </span>
        </div>
        {!upcoming && <a href="/#sorten" className="underline underline-offset-2">Jetzt zugreifen →</a>}
      </div>
      <p className="mt-1 text-[10px] md:text-xs font-bold">
        {upcoming ? "Fr 27.11., 12 Uhr bis Sa 28.11., 23:59 Uhr" : "Nur bis Samstag, 28.11., 23:59 Uhr"} · Rabatt automatisch im Warenkorb
      </p>
    </div>
  );
}
