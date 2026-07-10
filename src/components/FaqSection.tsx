import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Package,
  Wind,
  ShieldCheck,
  Leaf,
  Truck,
  HelpCircle,
  Plus,
  Minus,
  HelpingHand,
  Nose,
  Timer,
  Archive,
  Thermometer,
  RefreshCw,
  Coffee,
  Ban,
  Car,
  Plane,
  Baby,
  AlertTriangle,
  HeartPulse,
  Flame,
  HandHeart,
  Stethoscope,
  Scale,
  Repeat,
  Flower2,
  Flame as FlameIcon,
  Sprout,
  GitCompare,
  Rocket,
  Mail,
  Undo2,
  Boxes,
  type LucideIcon,
} from "lucide-react";

type Faq = {
  q: string;
  a: string;
  category: string;
  icon: LucideIcon;
};

const faqs: Faq[] = [
  // 1
  { category: "Produkt & Anwendung", icon: Sparkles, q: "Wofür ist FOQUZ?", a: "FOQUZ ist dein Frische-Kick für die Nase. Dose auf, kurz daran riechen, tief durchatmen und weitermachen – beim Training, am Schreibtisch, unterwegs oder einfach dann, wenn du kurz einen frischen Moment brauchst. Kein großes Ding. Einfach aufmachen, riechen, durchatmen." },
  // 2
  { category: "Produkt & Anwendung", icon: Wind, q: "Wie benutze ich FOQUZ richtig?", a: "Deckel ab, Dose mit etwas Abstand unter die Nase halten und den Duft kurz einatmen. Du musst die Dose nicht direkt an die Nase drücken. Danach den Deckel wieder fest verschließen – so bleibt die Intensität länger erhalten." },
  // 3
  { category: "Produkt & Anwendung", icon: Wind, q: "Wie nah soll ich FOQUZ an die Nase halten?", a: "Starte einfach mit etwas Abstand und finde heraus, welche Intensität für dich angenehm ist. Gerade beim ersten Mal gilt: lieber entspannt anfangen als direkt Vollgas. Deine Nase sagt dir ziemlich schnell, was passt." },
  // 4
  { category: "Produkt & Anwendung", icon: Leaf, q: "Was ist alles in der Dose?", a: "FOQUZ basiert auf einer Mischung aus getrockneten Kräutern und Blüten, Menthol und – je nach Sorte – weiteren Duftbestandteilen bzw. natürlichem Aroma. Die genaue Zusammensetzung findest du auf dem jeweiligen Etikett. Kein Nikotin und kein Koffein." },
  // 5
  { category: "Produkt & Anwendung", icon: Package, q: "Warum sind beim Öffnen manchmal kleine Kräuterstücke in der Dose verteilt?", a: "Kein Stress – das kann passieren. FOQUZ enthält echte getrocknete Kräuter und Blüten, die von einem Netz gehalten werden. Beim Transport wird die Dose bewegt und geschüttelt. Dadurch können sich kleine Pflanzenteile durch das Netz lösen und am Rand der Dose landen. Einfach vorsichtig mit einem Taschentuch entfernen. Das Netz und den Doseninhalt bitte nicht herausnehmen." },
  // 6
  { category: "Produkt & Anwendung", icon: ShieldCheck, q: "Darf ich das Netz oder den Inhalt aus der Dose holen?", a: "Nein – Regel Nr. 1 im FOQUZ Club: Das Netz und der Doseninhalt bleiben in der Dose. FOQUZ ist ausschließlich zum Riechen gedacht. Der Inhalt ist nicht zum Verzehr, Erhitzen oder zur Anwendung auf der Haut geeignet." },
  // 7
  { category: "Produkt & Anwendung", icon: Package, q: "Wie lange hält eine Dose?", a: "Nach dem Öffnen ist deine FOQUZ Dose maximal 3 Monate haltbar. Wenn du sie intensiv und regelmäßig nutzt, empfehlen wir dir aber, sie ungefähr nach einem Monat zu tauschen – dann ist der Frische-Kick einfach am intensivsten. Kleiner Tipp: Deckel nach der Benutzung immer direkt wieder fest drauf. Je weniger die Dose unnötig offen steht, desto länger bleibt die volle Power erhalten." },
  // 8
  { category: "Produkt & Anwendung", icon: Package, q: "Warum riecht meine Dose schwächer als am Anfang?", a: "Mit der Zeit kann die Duftintensität etwas nachlassen – besonders, wenn die Dose häufig oder längere Zeit offen bleibt. Deshalb: nach dem Riechen direkt wieder zuschrauben und richtig lagern. Wenn du FOQUZ intensiv nutzt, empfehlen wir für den besten Frische-Kick einen Wechsel nach ungefähr einem Monat." },
  // 9
  { category: "Produkt & Anwendung", icon: Leaf, q: "Kann die Intensität von Dose zu Dose leicht variieren?", a: "Ja, leichte Unterschiede können vorkommen. FOQUZ enthält echte pflanzliche Bestandteile – und Natur sieht nicht immer zu 100 % gleich aus und riecht nicht immer exakt identisch. Kleine Unterschiede bei Aussehen und Duftintensität sind deshalb normal." },
  // 10
  { category: "Produkt & Anwendung", icon: Package, q: "Wie sollte ich FOQUZ lagern?", a: "Trocken, gut verschlossen und nicht über 25 °C lagern. Bitte nicht im heißen Auto oder in der prallen Sonne liegen lassen. Und wichtig: für Kinder unzugänglich aufbewahren." },
  // 11
  { category: "Produkt & Anwendung", icon: Wind, q: "Kann ich FOQUZ beliebig oft am Tag benutzen?", a: "FOQUZ ist für kurze Frischemomente im Alltag gedacht. Nutze es so, wie es sich für dich angenehm anfühlt, und übertreib es nicht. Wenn du den Duft als unangenehm oder reizend empfindest, beende die Anwendung." },
  // 12
  { category: "Frische, Alltag & Lifestyle", icon: Sparkles, q: "Ist FOQUZ eine Alternative zu Kaffee oder Energy Drinks?", a: "Wenn du zwischendurch einfach einen Frische-Kick suchst: absolut. FOQUZ kommt ohne Koffein, Nikotin und Zucker aus und kann deshalb eine gute Alternative für Momente sein, in denen du sonst vielleicht automatisch zum nächsten Energy Drink oder Kaffee greifen würdest. Wichtig: FOQUZ ist kein Wachmacher und wirkt nicht wie Koffein. Es geht um den intensiven Duft, den Frischemoment und das kleine Ritual zwischendurch. Dose auf. Kurz riechen. Durchatmen. Weiter geht's." },
  // 13
  { category: "Frische, Alltag & Lifestyle", icon: Leaf, q: "Enthält FOQUZ Nikotin, Koffein oder Zucker?", a: "Nein. FOQUZ enthält weder Nikotin noch Koffein und wird nicht gegessen oder getrunken. Es ist ein Lifestyle-Produkt zum Riechen – kein Energy Drink, kein Nahrungsergänzungsmittel und kein Medizinprodukt." },
  // 14
  { category: "Frische, Alltag & Lifestyle", icon: ShieldCheck, q: "Kann ich FOQUZ beim Autofahren benutzen?", a: "Grundsätzlich kannst du FOQUZ unterwegs dabeihaben. Aber bitte nur benutzen, wenn du dadurch nicht vom Straßenverkehr abgelenkt wirst. Im Zweifel gilt ganz einfach: erst sicher anhalten, dann FOQUZ öffnen." },
  // 15
  { category: "Frische, Alltag & Lifestyle", icon: Truck, q: "Kann ich FOQUZ im Flugzeug oder auf Reisen mitnehmen?", a: "FOQUZ ist klein und handlich und lässt sich easy mitnehmen. Bitte beachte trotzdem immer die aktuellen Sicherheits-, Einreise- und Zollbestimmungen deines Reiseziels sowie die Regeln deiner Fluggesellschaft." },
  // 16
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Ab welchem Alter ist FOQUZ geeignet?", a: "FOQUZ ist nicht für Kinder unter 6 Jahren geeignet. Bitte für Kinder unzugänglich aufbewahren." },
  // 17
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Kann ich FOQUZ bei Asthma, Allergien oder Überempfindlichkeit verwenden?", a: "Nein. FOQUZ darf bei Allergien gegen enthaltene Bestandteile, Asthma oder Überempfindlichkeit nicht verwendet werden." },
  // 18
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Kann ich FOQUZ in der Schwangerschaft verwenden?", a: "In der Schwangerschaft und Stillzeit empfehlen wir, vor der Nutzung ärztlichen Rat einzuholen und die Inhaltsstoffe der jeweiligen Sorte zu berücksichtigen." },
  // 19
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Was mache ich, wenn der Duft unangenehm brennt oder mich reizt?", a: "Anwendung sofort beenden und für frische Luft sorgen. Wenn Beschwerden anhalten oder stärker werden, medizinischen Rat einholen. Bei bekannter Allergie, Asthma oder Überempfindlichkeit FOQUZ nicht verwenden." },
  // 20
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Kann ich FOQUZ essen, erhitzen oder auf die Haut auftragen?", a: "Nein. Bitte wirklich nur daran riechen. Der Doseninhalt ist nicht zum Verzehr, nicht zum Erhitzen und nicht zur Anwendung auf der Haut geeignet." },
  // 21
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Ist FOQUZ ein Medizinprodukt?", a: "Nein. FOQUZ ist ein Lifestyle-Produkt zum Riechen und ersetzt keine medizinische Behandlung. Bei gesundheitlichen Beschwerden wende dich bitte an medizinisches Fachpersonal." },
  // 22
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Ist FOQUZ legal?", a: "Ja. FOQUZ ist ein frei verkäufliches Lifestyle-Produkt zum Riechen. Es enthält kein Nikotin und keine verbotenen Substanzen. Bitte verwende das Produkt ausschließlich wie vorgesehen und beachte die Warnhinweise auf dem Etikett." },
  // 23
  { category: "Sicherheit & Hinweise", icon: ShieldCheck, q: "Macht FOQUZ süchtig?", a: "FOQUZ enthält kein Nikotin und kein Koffein. Es sind keine abhängig machenden Wirkstoffe zugesetzt. Was passieren kann: Du gewöhnst dich ziemlich schnell an dein kleines FOQUZ Ritual." },
  // 24
  { category: "Sorten & Auswahl", icon: Sparkles, q: "Welche Flavors gibt es?", a: "Aktuell gibt es ThaiStyle, LemonBreezy und PeachParty. Weitere Flavors wie BlueberryFlow und WatermelonFlex sind geplant. Die aktuelle Auswahl findest du immer im Shop." },
  // 25
  { category: "Sorten & Auswahl", icon: Sparkles, q: "Welche Sorte ist die stärkste?", a: "Wenn du es besonders intensiv und klassisch magst, ist ThaiStyle wahrscheinlich dein Match. Unsere fruchtigen Flavors verbinden den FOQUZ Frischemoment mit ihrer jeweiligen Duftrichtung. Welche Sorte sich für dich am stärksten anfühlt, hängt aber auch von deinem persönlichen Duftempfinden ab." },
  // 26
  { category: "Sorten & Auswahl", icon: Sparkles, q: "Welche Sorte eignet sich für Einsteiger?", a: "Du magst es klassisch und intensiv? Dann starte mit ThaiStyle. Du willst es fruchtiger und leichter? Dann sind LemonBreezy oder PeachParty wahrscheinlich eher dein Ding. Am Ende gilt: Deine Nase entscheidet." },
  // 27
  { category: "Sorten & Auswahl", icon: HelpCircle, q: "Was ist der Unterschied zu Hong Thai?", a: "Hong Thai ist ein bekanntes asiatisches Kräuterinhalationsprodukt. FOQUZ geht seinen eigenen Weg: eigene Sorten und Duftprofile, moderne Flavors, auf den europäischen Markt ausgerichtete Produktinformationen und ein Design, das du gerne aus der Tasche ziehst." },
  // 28
  { category: "Bestellung & Versand", icon: Truck, q: "Wie schnell wird meine Bestellung geliefert?", a: "Wir geben Gas: Deine Bestellung wird in der Regel schnellstmöglich bearbeitet und versendet. Die tatsächliche Laufzeit hängt von Versandart, Auslastung und Zustellregion ab. Die jeweils aktuelle Lieferzeit findest du im Shop bzw. in deiner Bestellbestätigung." },
  // 29
  { category: "Bestellung & Versand", icon: Truck, q: "Womit wird meine Bestellung versendet?", a: "Innerhalb Deutschlands versenden wir mit der Deutschen Post. Sobald deine Bestellung unterwegs ist, heißt es: FOQUZ incoming." },
  // 30
  { category: "Bestellung & Versand", icon: Package, q: "Kann ich meine Dose zurückgeben?", a: "Ungeöffnete Dosen kannst du im Rahmen der geltenden Widerrufsbedingungen zurückgeben. Bei geöffneten Produkten kann das Widerrufsrecht aus Hygiene- und Gesundheitsschutzgründen ausgeschlossen sein, wenn eine entsprechende Versiegelung entfernt wurde. Die Details findest du in unserer Widerrufsbelehrung." },
  // 31
  { category: "Bestellung & Versand", icon: Package, q: "Gibt es Mengenrabatte oder Bundles?", a: "Yes. Unser 3er Bundle ist perfekt, wenn du direkt mehrere Sorten testen oder deinen FOQUZ Vorrat auffüllen willst – und günstiger als drei Einzeldosen. Aktuelle Bundles und Aktionen findest du immer im Shop." },
];

// Initial visible indices (0-based): 1,2,4,10,11,22,23 → 0,1,3,9,10,21,22
const INITIAL_VISIBLE = [0, 1, 3, 9, 10, 21, 22];

const categoryColors: Record<string, string> = {
  "Produkt & Anwendung": "bg-foquz-thai-light",
  "Frische, Alltag & Lifestyle": "bg-foquz-lemon-light",
  "Sicherheit & Hinweise": "bg-foquz-watermelon-light",
  "Sorten & Auswahl": "bg-foquz-peach",
  "Bestellung & Versand": "bg-foquz-blueberry",
};

const FaqItem = ({ faq, index }: { faq: Faq; index: number }) => {
  const [open, setOpen] = useState(false);
  const Icon = faq.icon;
  const chipColor = categoryColors[faq.category] ?? "bg-foquz-thai-light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.2) }}
      className={`comic-card bg-card overflow-hidden transition-transform duration-150 ${
        open ? "" : "hover:-translate-y-0.5"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 md:gap-4 px-4 py-4 md:px-5 md:py-5 text-left"
      >
        <span
          className={`shrink-0 grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full comic-outline ${chipColor}`}
        >
          <Icon size={20} className="text-foreground" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            {faq.category}
          </span>
          <span className="block font-extrabold text-base md:text-lg leading-tight">
            {faq.q}
          </span>
        </span>
        <span
          className={`shrink-0 grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full comic-outline bg-background transition-transform duration-200 ${
            open ? "rotate-45 bg-primary" : ""
          }`}
          aria-hidden
        >
          <Plus size={18} className={open ? "text-primary-foreground" : ""} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 md:px-5 md:pb-6 pl-[68px] md:pl-[76px]">
              <div className="border-t-2 border-foreground/10 pt-3 md:pt-4">
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FaqSection = () => {
  const [expanded, setExpanded] = useState(false);

  const visibleFaqs = expanded
    ? faqs.map((f, i) => ({ faq: f, index: i }))
    : INITIAL_VISIBLE.map((i) => ({ faq: faqs[i], index: i }));

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      id="faq"
      className="section-padding py-14 md:py-24 bg-background scroll-mt-[124px] relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Decorative floating accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-4 md:left-16 w-8 h-8 md:w-12 md:h-12 rounded-full bg-foquz-lemon comic-outline animate-float" />
        <div
          className="absolute top-24 right-6 md:right-24 w-10 h-10 md:w-16 md:h-16 rounded-full bg-foquz-watermelon comic-outline animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-8 md:left-32 w-6 h-6 md:w-10 md:h-10 rounded-full bg-foquz-thai comic-outline animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <Sparkles
          className="absolute top-8 right-1/3 text-foreground/30 hidden md:block"
          size={28}
        />
        <Sparkles
          className="absolute bottom-16 right-10 text-foreground/30"
          size={22}
        />
      </div>

      <div className="container mx-auto max-w-3xl relative">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 comic-outline comic-shadow bg-secondary px-4 py-1.5 rounded-full mb-4">
            <HelpCircle size={16} />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider">
              Support & Antworten
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-3">
            HÄUFIGE FRAGEN
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto">
            Alles rund um FOQUZ – kurz, ehrlich und ohne Umwege erklärt.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {visibleFaqs.map(({ faq, index }) => (
            <FaqItem key={faq.q} faq={faq} index={index} />
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="comic-btn bg-primary text-primary-foreground inline-flex items-center gap-2"
          >
            {expanded ? (
              <>
                <Minus size={20} />
                Weniger anzeigen
              </>
            ) : (
              <>
                <Plus size={20} />
                Alle {faqs.length} Fragen anzeigen
              </>
            )}
          </button>
          {!expanded && (
            <p className="text-xs md:text-sm text-muted-foreground">
              Zeige {INITIAL_VISIBLE.length} von {faqs.length} Fragen
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
