import { useEffect } from "react";

/**
 * Das Newsletter-/Gewinnspiel-Popup wird von Klaviyo gerendert (externes
 * Skript). Diese Komponente passt es an das FOQUZ-Design an:
 *  - Buttons im Comic-Style (Barlow Black, schwarzer Rahmen + Schatten)
 *  - Rechtlicher Hinweis mit Links zu AGB und Datenschutzerklärung
 * Beides funktioniert auf Desktop und Mobil, unabhängig vom Formularlayout.
 */
const LEGAL_CLASS = "foquz-klaviyo-legal";
const FORM_CLASS = "foquz-klaviyo-form";
const CONTENT_CLASS = "foquz-klaviyo-content";

const KlaviyoFormPolish = () => {
  useEffect(() => {
    const addLegal = () => {
      const forms = document.querySelectorAll<HTMLFormElement>("form[class*='klaviyo-form']");
      forms.forEach((form) => {
        if (!form.querySelector("input[type='email']")) return;

        form.classList.add(FORM_CLASS);
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
          'Mit der Anmeldung stimmst du unseren <a href="/agb" target="_blank" rel="noopener">AGB</a> und der <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzerkl\u00e4rung</a> zu. Abmeldung jederzeit m\u00f6glich.';
        content.appendChild(legal);
      });
    };

    addLegal();
    const observer = new MutationObserver(addLegal);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
};

export default KlaviyoFormPolish;
