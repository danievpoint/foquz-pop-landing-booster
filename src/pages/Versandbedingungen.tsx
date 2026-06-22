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
        <p>Wir liefern innerhalb von <strong>Deutschland, Österreich und der Schweiz</strong>. Lieferungen in andere Länder sind grundsätzlich nicht möglich. Wenn du aus einem anderen Land bestellen möchtest, melde dich bitte vorab unter <a href="mailto:info@foquz.de" className="underline">info@foquz.de</a>.</p>

        <h2>3. Versanddienstleister</h2>
        <p>Der Versand erfolgt über die <strong>Deutsche Post / DHL</strong> als Paket- oder Warenpost-Sendung.</p>

        <h2>4. Versandkosten</h2>
        <p>Die Höhe der Versandkosten richtet sich nach dem Lieferland und dem Bestellwert. Die exakten Versandkosten werden Ihnen vor Abschluss der Bestellung im <strong>Checkout transparent angezeigt</strong> und sind Bestandteil des Gesamtpreises.</p>

        <h2>5. Lieferzeit</h2>
        <p>Die nachfolgenden Angaben sind <strong>unverbindliche Richtwerte</strong>, da die tatsächliche Zustellung durch den Versanddienstleister DHL erfolgt und von uns nicht garantiert werden kann:</p>
        <ul>
          <li>Deutschland: in der Regel <strong>2 – 5 Werktage</strong></li>
          <li>EU-Ausland: in der Regel <strong>5 – 14 Werktage</strong></li>
        </ul>
        <p>Die Lieferzeit beginnt am Tag nach Vertragsschluss und Zahlungseingang. Verzögerungen durch DHL, Zoll oder höhere Gewalt liegen außerhalb unseres Einflussbereichs. Ein konkreter Liefertermin wird nicht zugesichert.</p>

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
