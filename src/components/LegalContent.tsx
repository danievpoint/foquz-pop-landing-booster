import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

/**
 * Rendert einen statischen Rechtstext aus src/legal/*.html. Dieselben Dateien
 * werden 1:1 für die Shopify-Seiten unter legal/shopify/ verwendet, damit
 * Website und Shopify-Admin nie auseinanderlaufen. Inhalte sind eigene,
 * statische Texte (keine Nutzereingaben).
 */
const LegalContent = ({ html }: { html: string }) => {
  const navigate = useNavigate();
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (href && href.startsWith("/") && !a?.target) {
      e.preventDefault();
      navigate(href);
    }
  };
  return (
    <div
      onClick={onClick}
      className="prose prose-lg max-w-none opacity-80 space-y-5 leading-relaxed [&_p]:leading-[1.45] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default LegalContent;
