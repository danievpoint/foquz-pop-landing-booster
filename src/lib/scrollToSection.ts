// Zuverlässiges Scrollen zu einer Sektion.
// Sektionen unterhalb des Heros werden lazy geladen und Bilder verschieben das
// Layout nach dem Sprung – deshalb wird die Zielposition nach dem Scrollen
// mehrfach nachkorrigiert, bis sie stabil ist.

const getOffset = () => {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => parseFloat(styles.getPropertyValue(name)) || 0;
  return read("--safe-area-top") + read("--marquee-height") + 84;
};

export function scrollToSection(id: string) {
  const selector = id.startsWith("#") ? id : `#${id}`;

  let attempts = 0;
  let lastTop = Number.NaN;

  const step = () => {
    const el = document.querySelector<HTMLElement>(selector);
    attempts += 1;

    if (el) {
      const target = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - getOffset(),
      );

      if (Math.abs(target - window.scrollY) > 2) {
        window.scrollTo({ top: target, behavior: "auto" });
      }

      // Position stabil? Dann fertig.
      if (Math.abs(target - lastTop) < 2 && attempts > 3) return;
      lastTop = target;
    }

    // Bis ~1,2s nachkorrigieren (Lazy-Sections & Bilder).
    if (attempts < 24) setTimeout(step, 50);
  };

  step();
}
