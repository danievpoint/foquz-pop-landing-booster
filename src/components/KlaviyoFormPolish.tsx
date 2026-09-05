import { useEffect } from "react";

/**
 * Das Newsletter-/Gewinnspiel-Popup wird von Klaviyo gerendert (externes
 * Skript). Diese Komponente passt es an das FOQUZ-Design an:
 *  - Buttons im Comic-Style (Barlow Black, schwarzer Rahmen + Schatten)
 *  - Rechtlicher Hinweis mit Links zu AGB und Datenschutzerklärung
 * Beides funktioniert auf Desktop und Mobil, unabhängig vom Formularlayout.
 */
const LEGAL_ID = "foquz-klaviyo-legal";

const KlaviyoFormPolish = () => {
  useEffect(() => {
    const addLegal = () => {
      const forms = document.querySelectorAll<HTMLElement>("[class*='klaviyo-form']");
      forms.forEach((form) => {
        if (!form.querySelector("form") && !form.querySelector("input[type='email']")) return;
        if (form.querySelector(`#${LEGAL_ID}`)) return;
        const el = document.createElement("div");
        el.id = LEGAL_ID;
        el.className = "foquz-klaviyo-legal";
        el.innerHTML =
          'Mit der Anmeldung stimmst du unseren <a href="/agb" target="_blank" rel="noopener">AGB</a> und der <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzerkl\u00e4rung</a> zu. Abmeldung jederzeit m\u00f6glich.';
        form.appendChild(el);
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
