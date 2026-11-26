import { useEffect, useState } from "react";
import { isCampaignActive } from "@/lib/blackFriday";

export function useCampaignActive(end: number) {
  const [active, setActive] = useState(() => isCampaignActive(end));
  useEffect(() => {
    const update = () => setActive(isCampaignActive(end));
    update();
    const timer = window.setTimeout(update, Math.min(Math.max(0, end - Date.now()), 2147483647));
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [end]);
  return active;
}

export function useCampaignWindow(start: number, end: number) {
  const beforeStart = useCampaignActive(start);
  const beforeEnd = useCampaignActive(end);
  return !beforeStart && beforeEnd;
}
