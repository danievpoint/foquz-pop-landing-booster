import { useEffect } from "react";

/**
 * Das Newsletter-/Gewinnspiel-Popup wird von Klaviyo gerendert (externes
 * Skript). Diese Komponente passt es an das FOQUZ-Design an:
 *  - Buttons im Comic-Style (Barlow Black, schwarzer Rahmen + Schatten)
 *  - Rechtlicher Hinweis mit Links zu AGB und Datenschutzerklärung
 * Das Grundlayout kommt aus index.css und greift direkt am Klaviyo-Markup,
 * damit beim Laden nichts kurz "springt".
 */
const LEGAL_CLASS = "foquz-klaviyo-legal";
const FORM_CLASS = "foquz-klaviyo-form";
const CONTENT_CLASS = "foquz-klaviyo-content";
const SCALE_RESET_CLASS = "foquz-klaviyo-scale-reset";

const KlaviyoFormPolish = () => {
  useEffect(() => {
    let frame = 0;
    let running = false;

    const polish = () => {
      const forms = document.querySelectorAll<HTMLFormElement>("form[class*='klaviyo-form']");
      forms.forEach((form) => {
        if (!form.querySelector("input[type='email']")) return;

        form.classList.add(FORM_CLASS);

        // Klaviyo skaliert das Popup auf Mobil per transform – einmal neutralisieren.
        let parent: HTMLElement | null = form.parentElement;
        while (parent && parent !== document.body) {
          if (parent.classList.contains(SCALE_RESET_CLASS)) break;
          if (window.getComputedStyle(parent).transform !== "none") {
            parent.classList.add(SCALE_RESET_CLASS);
            break;
          }
          parent = parent.parentElement;
        }

        const columns = Array.from(form.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement && child.tagName === "DIV",
        );
        const content = columns.find((column) => column.querySelector("input[type='email']"));
        content?.classList.add(CONTENT_CLASS);

        form.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
          if (button.textContent?.trim().toLocaleLowerCase("de-DE") === "nein danke") {
            const row = button.closest<HTMLElement>("[data-testid='form-row']");
            (row ?? button).classList.add("foquz-klaviyo-dismiss-hidden");
          }
        });

        if (!content || content.querySelector(`.${LEGAL_CLASS}`)) return;
        const legal = document.createElement("div");
        legal.className = LEGAL_CLASS;
        legal.innerHTML =
          'Mit deiner Anmeldung akzeptierst du unsere <a href="/agb" target="_blank" rel="noopener noreferrer">AGB</a> und <a href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzerkl\u00e4rung</a>. Abmeldung jederzeit m\u00f6glich.';
        content.appendChild(legal);
      });
    };

    // Eigene DOM-Schreibvorgänge dürfen den Observer nicht erneut auslösen
    // (das führte auf Mobil zu Layout-Flackern beim Laden).
    const schedule = () => {
      if (running || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        running = true;
        observer.disconnect();
        try {
          polish();
        } finally {
          running = false;
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    };

    const observer = new MutationObserver(schedule);

    polish();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default KlaviyoFormPolish;
