import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const Widerrufsbelehrung = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Widerrufsbelehrung</h1>
      <div className="prose prose-lg max-w-none opacity-80 space-y-6 leading-relaxed [&_p]:leading-[1.45] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3">

        <p>
          FOQUZ GmbH<br />
          Gewerbering am Brand 8<br />
          82549 Königsdorf
        </p>
        <p>
          E-Mail: info@foquz.de<br />
          Telefon: 01702420257<br />
          www.foquz.de
        </p>

        <h2>Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p>Die Widerrufsfrist bei Verträgen über Waren beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.</p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
        <p>
          <strong>FOQUZ GmbH</strong><br />
          Gewerbering am Brand 8, 82549 Königsdorf<br />
          Telefon: 01702420257<br />
          E-Mail: info@foquz.de
        </p>
        <p>mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Sie können das Muster-Widerrufsformular oder eine andere eindeutige Erklärung auch auf unserer Webseite www.foquz.de elektronisch ausfüllen und übermitteln. Machen Sie von dieser Möglichkeit Gebrauch, so werden wir Ihnen unverzüglich (z. B. per E-Mail) eine Bestätigung über den Eingang eines solchen Widerrufs übermitteln.</p>
        <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>

        <h2>Folgen des Widerrufs</h2>
        <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>
        <p>Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</p>
        <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>

        <div className="border-t border-foreground/20 my-10" />

        <h2>Muster-Widerrufsformular</h2>
        <p className="italic text-sm">(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
        <p>An: FOQUZ GmbH, Gewerbering am Brand 8, 82549 Königsdorf, E-Mail: info@foquz.de</p>
        <p>Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren:</p>
        <p>Bestellt am: _____________</p>
        <p>Name des/der Verbraucher(s): _____________</p>
        <p>Anschrift des/der Verbraucher(s): _____________<br />_____________</p>
        <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):<br />_____________</p>
        <p>Datum: _____________</p>

      </div>
    </div>
    <Footer />
  </div>
);

export default Widerrufsbelehrung;
