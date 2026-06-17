import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const Versandbedingungen = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Versandbedingungen</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6">

        <h2>1. Geltungsbereich</h2>
        <p>Diese Versandbedingungen gelten für alle Bestellungen, die über die Website www.foquz.de getätigt werden. Verkäufer ist die FOQUZ GmbH, Gewerbering am Brand 8, 82549 Königsdorf.</p>

        <h2>2. Liefergebiet</h2>
        <p>Wir liefern aktuell ausschließlich an Lieferadressen innerhalb von <strong>Deutschland</strong>. Belieferungen in andere EU-Länder erfolgen nur nach individueller Absprache.</p>

        <h2>3. Versanddienstleister</h2>
        <p>Der Versand erfolgt über Deutsche Post / DHL als Paket- oder Warenpost-Sendung.</p>

        <h2>4. Versandkosten</h2>
        <ul>
          <li>Deutschland: <strong>4,90 €</strong> pauschal pro Bestellung (inkl. MwSt.)</li>
          <li>Versandkostenfrei ab einem Bestellwert von <strong>30,00 €</strong></li>
        </ul>
        <p className="text-sm italic">Die genauen Versandkosten werden vor Abschluss der Bestellung im Checkout transparent angezeigt.</p>

        <h2>5. Lieferzeit</h2>
        <p>Sofern in der Produktbeschreibung nicht anders angegeben, beträgt die Lieferzeit innerhalb Deutschlands <strong>2 – 5 Werktage</strong> nach Zahlungseingang. Die Lieferzeit beginnt am Tag nach Vertragsschluss und endet mit dem Ablauf des letzten Tages der Frist. Fällt der letzte Tag der Frist auf einen Samstag, Sonntag oder gesetzlichen Feiertag, so tritt an die Stelle eines solchen Tages der nächste Werktag.</p>

        <h2>6. Selbstabholung</h2>
        <p>Eine Selbstabholung der Ware ist aus organisatorischen Gründen nicht möglich.</p>

        <h2>7. Gefahrenübergang</h2>
        <p>Ist der Kunde Verbraucher, geht die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der verkauften Ware mit Übergabe an den Kunden auf diesen über. Ist der Kunde Unternehmer, geht die Gefahr mit Übergabe der Ware an den Versanddienstleister über.</p>

        <h2>8. Transportschäden</h2>
        <p>Werden Waren mit offensichtlichen Transportschäden geliefert, reklamieren Sie diese bitte möglichst sofort beim Zusteller und nehmen Sie schnellstmöglich Kontakt mit uns auf. Die Versäumung einer Reklamation oder Kontaktaufnahme hat für Ihre gesetzlichen Ansprüche und deren Durchsetzung, insbesondere Ihre Gewährleistungsrechte, keinerlei Konsequenzen. Sie helfen uns aber, unsere eigenen Ansprüche gegenüber dem Frachtführer bzw. der Transportversicherung geltend machen zu können.</p>

      </div>
    </div>
    <Footer />
  </div>
);

export default Versandbedingungen;
