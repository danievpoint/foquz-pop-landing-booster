import Navbar from "@/components/Navbar";
import MarqueeBanner from "@/components/MarqueeBanner";
import Footer from "@/components/Footer";

const Datenschutz = () => (
  <div className="min-h-screen">
    <MarqueeBanner />
    <Navbar />
    <div className="container mx-auto px-4 pt-44 md:pt-56 pb-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Datenschutzerklärung</h1>
      <p className="opacity-70 mb-8">Stand: 27.06.2026</p>
      <div className="prose prose-lg max-w-none opacity-80 space-y-5 leading-relaxed [&_p]:leading-[1.45] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:p-2 [&_th]:border [&_td]:p-2 [&_td]:border [&_td]:align-top">

        <p>Diese Datenschutzerklärung informiert Sie darüber, wie wir personenbezogene Daten im Zusammenhang mit unserer Website, unserem Online-Shop, unseren Social-Media-Auftritten, Zahlungs- und Versandprozessen sowie Analyse- und Marketingdiensten verarbeiten.</p>

        <h2>1. Verantwortlicher</h2>
        <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
        <p>
          FOQUZ GmbH<br />
          Vertreten durch: Matthias Kurpiers, Kevin Zaremba<br />
          Gewerbering am Brand 8<br />
          82549 Königsdorf<br />
          Deutschland<br />
          E-Mail: matyas@achtabahn.de<br />
          Telefon: 01702420257
        </p>
        <p>Ein Datenschutzbeauftragter ist nicht bestellt.</p>

        <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
        <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Website, zur Abwicklung von Bestellungen, zur Kommunikation mit Ihnen, zur Erfüllung gesetzlicher Pflichten, zur Wahrung berechtigter Interessen oder auf Grundlage Ihrer Einwilligung erforderlich ist.</p>
        <p>Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen, z. B. Name, Anschrift, E-Mail-Adresse, Telefonnummer, IP-Adresse, Bestell-, Zahlungs-, Nutzungs-, Kommunikations- oder Cookie-Daten.</p>
        <p>Die maßgeblichen Rechtsgrundlagen sind:</p>
        <ul>
          <li>Art. 6 Abs. 1 lit. a DSGVO, wenn Sie eine Einwilligung erteilt haben.</li>
          <li>Art. 6 Abs. 1 lit. b DSGVO, wenn die Verarbeitung zur Vertragserfüllung oder für vorvertragliche Maßnahmen erforderlich ist.</li>
          <li>Art. 6 Abs. 1 lit. c DSGVO, wenn wir gesetzlich zur Verarbeitung verpflichtet sind.</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO, wenn wir oder ein Dritter ein berechtigtes Interesse haben und Ihre Interessen oder Grundrechte nicht überwiegen.</li>
        </ul>
        <p>Soweit wir Informationen auf Ihrem Endgerät speichern oder auslesen, die nicht technisch unbedingt erforderlich sind, erfolgt dies nur auf Grundlage Ihrer Einwilligung nach § 25 Abs. 1 TDDDG. Die anschließende Verarbeitung personenbezogener Daten erfolgt regelmäßig auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Technisch unbedingt erforderliche Speicher- oder Auslesevorgänge erfolgen auf Grundlage von § 25 Abs. 2 TDDDG.</p>

        <h2>3. Bereitstellung der Website und Server-Logfiles</h2>
        <p>Beim Aufruf unserer Website verarbeitet unser Webserver automatisch technische Zugriffsdaten. Dazu gehören insbesondere:</p>
        <ul>
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene URL</li>
          <li>Referrer-URL</li>
          <li>übertragene Datenmenge</li>
          <li>Browsertyp und Browserversion</li>
          <li>Betriebssystem</li>
          <li>verwendetes Endgerät</li>
          <li>Internet-Service-Provider</li>
        </ul>
        <p>Die Verarbeitung erfolgt, um die Website technisch bereitzustellen, Stabilität und Sicherheit zu gewährleisten, Missbrauch zu erkennen und Fehler zu analysieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren und funktionsfähigen Bereitstellung unserer Website.</p>
        <p>Server-Logfiles werden nur so lange gespeichert, wie dies für die genannten Zwecke erforderlich ist. Die konkrete Frist richtet sich nach den Einstellungen des Hosting- bzw. Shop-Anbieters. Eine längere Speicherung erfolgt nur, wenn dies zur Aufklärung von Sicherheitsvorfällen oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.</p>

        <h2>4. Hosting, Shop-System und technische Plattformen</h2>
        <h3>4.1 Shopify</h3>
        <p>Für den Betrieb unseres Online-Shops, Produktverwaltung, Warenkorb, Checkout, Bestellabwicklung, Kundenkonto, Sicherheit und Shop-Analyse nutzen wir Shopify. Anbieter für Nutzer im EWR ist Shopify International Ltd., 2nd Floor, 1-2 Victoria Buildings, Haddington Road, Dublin 4, D04 XN32, Irland.</p>
        <p>Wenn Sie unseren Shop nutzen oder eine Bestellung aufgeben, verarbeitet Shopify insbesondere:</p>
        <ul>
          <li>Name</li>
          <li>Rechnungs- und Lieferadresse</li>
          <li>E-Mail-Adresse</li>
          <li>Telefonnummer, sofern angegeben</li>
          <li>Bestell- und Warenkorbdaten</li>
          <li>Zahlungs- und Transaktionsinformationen</li>
          <li>IP-Adresse</li>
          <li>Browser-, Geräte- und Nutzungsdaten</li>
          <li>Sicherheits- und Betrugsprüfungsdaten</li>
        </ul>
        <p>Die Verarbeitung erfolgt zur Bereitstellung des Shops, zur Abwicklung von Bestellungen, zur Zahlungsabwicklung, zur Betrugsprävention, zur Sicherheit des Shops und zur Erfüllung gesetzlicher Pflichten. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO, Art. 6 Abs. 1 lit. c DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Soweit Shopify personenbezogene Daten in unserem Auftrag verarbeitet, besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Shopify kann Daten außerhalb der EU/des EWR verarbeiten, insbesondere in Kanada und den USA. Für Kanada besteht ein Angemessenheitsbeschluss der Europäischen Kommission. Für weitere Drittlandtransfers nutzt Shopify nach eigenen Angaben geeignete Garantien.</p>
        <p>Weitere Informationen: <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer">https://www.shopify.com/legal/privacy</a></p>

        <h3>4.2 Lovable</h3>
        <p>Unsere Website bzw. einzelne Online-Auftritte werden über Lovable erstellt, verwaltet oder bereitgestellt. Dabei können technische Daten, Projektinformationen, Formularinhalte und Nutzungsdaten verarbeitet werden, soweit dies für Betrieb, Sicherheit, Wartung und Weiterentwicklung erforderlich ist.</p>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO und Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer sicheren, effizienten und wartbaren technischen Bereitstellung unserer Online-Angebote.</p>
        <p>Soweit Lovable personenbezogene Daten in unserem Auftrag verarbeitet, schließen wir einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Soweit Daten in Drittländer übermittelt werden, erfolgt dies auf Grundlage geeigneter Garantien, insbesondere Standardvertragsklauseln nach Art. 46 DSGVO, soweit kein Angemessenheitsbeschluss besteht.</p>
        <p>Weitere Informationen: <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer">https://lovable.dev/privacy</a></p>

        <h3>4.3 Lovable Analytics und technische Ereignisdaten</h3>
        <p>Unsere Website kann Lovable-eigene Skripte zur technischen Bereitstellung, Fehleranalyse, Reichweitenmessung oder Projektanalyse laden. Dabei können insbesondere technische Ereignisdaten, IP-Adresse, Browser- und Geräteinformationen, Zeitstempel, Referrer, aufgerufene Seiten und Interaktionen verarbeitet werden.</p>
        <p>Soweit diese Verarbeitung für Betrieb, Sicherheit, Fehleranalyse oder technische Bereitstellung erforderlich ist, erfolgt sie auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Soweit Lovable-Skripte für nicht erforderliche Analyse- oder Marketingzwecke eingesetzt werden, erfolgt dies nur auf Grundlage Ihrer Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO.</p>

        <h3>4.4 Supabase</h3>
        <p>Wir nutzen Supabase für Backend-Dienste, insbesondere Datenbank, Authentifizierung, serverseitige Funktionen, Formularverarbeitung und Newsletter-Anmeldungen. Anbieter ist Supabase Inc. bzw. der jeweils in den Vertragsunterlagen benannte Vertragspartner.</p>
        <p>Je nach Nutzung können insbesondere folgende Daten verarbeitet werden:</p>
        <ul>
          <li>Registrierungs- und Login-Daten</li>
          <li>E-Mail-Adressen</li>
          <li>Formularinhalte</li>
          <li>Bestell- oder Anfragebezug</li>
          <li>IP-Adresse und technische Zugriffsdaten</li>
          <li>Zeitstempel</li>
          <li>Datenbankinhalte, die Sie über Formulare oder Konten bereitstellen</li>
        </ul>
        <p>Die Verarbeitung erfolgt zur Bereitstellung der Website-Funktionen, zur Bearbeitung Ihrer Anfragen, zur Verwaltung von Nutzerkonten und zur technischen Absicherung der Dienste. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO, Art. 6 Abs. 1 lit. c DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Soweit Supabase personenbezogene Daten in unserem Auftrag verarbeitet, schließen wir einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Soweit Daten in Drittländer übermittelt werden, erfolgt dies auf Grundlage geeigneter Garantien, insbesondere Standardvertragsklauseln nach Art. 46 DSGVO, soweit kein Angemessenheitsbeschluss besteht.</p>
        <p>Weitere Informationen: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a></p>

        <h3>4.5 Google Fonts</h3>
        <p>Unsere Website nutzt Schriftarten von Google Fonts. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Beim Abruf der Schriftarten können technische Daten, insbesondere IP-Adresse, Browserinformationen, Betriebssystem, Referrer und Zeitpunkt des Abrufs, an Google übermittelt werden.</p>
        <p>Die Verarbeitung erfolgt zur einheitlichen und performanten Darstellung unserer Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Soweit Google Fonts nicht lokal eingebunden sind und eine Verbindung zu Google-Servern hergestellt wird, kann eine Übermittlung in Drittländer, insbesondere die USA, erfolgen. Google stützt solche Übermittlungen nach eigenen Angaben auf geeignete Garantien, insbesondere das EU-US Data Privacy Framework und/oder Standardvertragsklauseln.</p>
        <p>Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></p>

        <h2>5. Bestellungen, Kundenkonto und Vertragsabwicklung</h2>
        <p>Wenn Sie in unserem Online-Shop bestellen, verarbeiten wir die Daten, die für die Annahme, Durchführung und Abwicklung Ihrer Bestellung erforderlich sind. Dazu gehören insbesondere:</p>
        <ul>
          <li>Name</li>
          <li>Rechnungs- und Lieferadresse</li>
          <li>E-Mail-Adresse</li>
          <li>Telefonnummer, sofern angegeben</li>
          <li>bestellte Produkte</li>
          <li>Bestellnummer</li>
          <li>Zahlungsart und Zahlungsstatus</li>
          <li>Versandstatus</li>
          <li>Retouren- und Reklamationsdaten</li>
          <li>Kommunikation im Zusammenhang mit der Bestellung</li>
        </ul>
        <p>Die Verarbeitung erfolgt zur Vertragserfüllung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Soweit wir Daten aufgrund handels- oder steuerrechtlicher Aufbewahrungspflichten speichern müssen, erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.</p>
        <p>Wenn Sie ein Kundenkonto anlegen, speichern wir die von Ihnen angegebenen Daten, damit Sie Bestellungen verwalten, Bestellhistorien einsehen und künftige Bestellungen komfortabler durchführen können. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit das Konto für vertragliche Funktionen genutzt wird, und Art. 6 Abs. 1 lit. f DSGVO für komfortbezogene Funktionen.</p>

        <h2>6. Zahlungsarten und Zahlungsdienstleister</h2>
        <p>Wir bieten verschiedene Zahlungsarten an, insbesondere PayPal, Kreditkartenzahlung, Shop Pay, Apple Pay, Google Pay, Klarna, Sofortüberweisung, Amazon Pay, Rechnungskauf und weitere über Shopify bzw. eingebundene Zahlungsanbieter bereitgestellte Zahlungsmethoden.</p>
        <p>Je nach gewählter Zahlungsart werden Zahlungs-, Bestell- und Kontaktdaten an den jeweiligen Zahlungsdienstleister übermittelt oder von diesem an uns übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Zahlungsabwicklung und Vertragserfüllung erforderlich ist. Darüber hinaus haben wir ein berechtigtes Interesse an sicheren, effizienten und nutzerfreundlichen Zahlungsmethoden, Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Zahlungsdienstleister können Daten außerdem in eigener Verantwortung zur Betrugsprävention, Identitätsprüfung, Bonitätsprüfung, regulatorischen Pflichten oder Zahlungsabsicherung verarbeiten.</p>

        <h3>6.1 Shopify Payments, Kreditkarte, Shop Pay, Apple Pay und Google Pay</h3>
        <p>Für Kreditkartenzahlungen, Shop Pay, Apple Pay, Google Pay und weitere Zahlungsarten nutzen wir Shopify Payments. Die Zahlungsabwicklung erfolgt über Shopify und die jeweils eingebundenen Zahlungsdienstleister. Dabei können insbesondere Name, Rechnungsadresse, Lieferadresse, E-Mail-Adresse, Zahlungsbetrag, Bestellnummer, Zahlungsstatus, Transaktionsdaten und Informationen zur Betrugsprävention verarbeitet werden.</p>
        <p>Wir erhalten grundsätzlich keine vollständigen Kreditkartennummern oder vollständigen Bankdaten. Wir erhalten Informationen, die für Bestellabwicklung, Zahlungsstatus, Rückerstattungen, Buchhaltung und Betrugsprävention erforderlich sind.</p>
        <p>Weitere Informationen: <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer">https://www.shopify.com/legal/privacy</a></p>

        <h3>6.2 PayPal</h3>
        <p>Bei Zahlung über PayPal erfolgt die Zahlungsabwicklung über PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg.</p>
        <p>Wir übermitteln an PayPal die für die Zahlungsabwicklung erforderlichen Informationen, insbesondere Zahlungsbetrag, Bestellbezug und ggf. Kontaktdaten. PayPal übermittelt uns Informationen zum Zahlungsstatus, zur Transaktions-ID und ggf. zu Rückbuchungen oder Betrugsprüfungen. Wir erhalten keine vollständigen Kreditkarten- oder Bankdaten.</p>
        <p>Weitere Informationen: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer">https://www.paypal.com/de/webapps/mpp/ua/privacy-full</a></p>

        <h3>6.3 Klarna, Sofortüberweisung und Rechnungskauf</h3>
        <p>Bei Zahlung über Klarna, Sofortüberweisung oder Rechnungskauf kann die Zahlungsabwicklung über Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm, Schweden, oder einen von Klarna eingebundenen Zahlungsdienst erfolgen.</p>
        <p>Klarna kann personenbezogene Daten zur Zahlungsabwicklung, Identitäts- und Bonitätsprüfung, Betrugsprävention, Forderungsverwaltung und Erfüllung regulatorischer Pflichten verarbeiten. Dazu können insbesondere Name, Kontaktdaten, Rechnungs- und Lieferadresse, Geburtsdatum, Zahlungsdaten, Bestelldaten, IP-Adresse, Geräteinformationen und Bonitätsinformationen gehören. Klarna handelt hierbei teilweise als eigener Verantwortlicher.</p>
        <p>Weitere Informationen: <a href="https://www.klarna.com/de/datenschutz/" target="_blank" rel="noopener noreferrer">https://www.klarna.com/de/datenschutz/</a></p>

        <h3>6.4 Amazon Pay</h3>
        <p>Bei Zahlung über Amazon Pay erfolgt die Zahlungsabwicklung über Amazon Payments Europe S.C.A., 38 avenue John F. Kennedy, L-1855 Luxemburg.</p>
        <p>Amazon Pay verarbeitet die für die Zahlungsabwicklung erforderlichen Zahlungs-, Transaktions- und Kontodaten. Wir erhalten von Amazon Pay Informationen, die für die Vertragsabwicklung erforderlich sind, insbesondere Zahlungsstatus, Transaktionsbezug und ggf. Liefer- oder Rechnungsinformationen, jedoch keine vollständigen Kreditkarten- oder Bankdaten.</p>
        <p>Weitere Informationen: <a href="https://pay.amazon.de/help/201212490" target="_blank" rel="noopener noreferrer">https://pay.amazon.de/help/201212490</a></p>

        <h3>6.5 PaymentHero</h3>
        <p>Wir nutzen die Shopify-App PaymentHero, um Zahlungsarten im Shop bzw. Checkout zu verwalten, zu steuern oder anzuzeigen. Dabei können checkout- und zahlungsbezogene Daten verarbeitet werden, z. B. Warenkorb, Lieferland, Bestellwert, ausgewählte Zahlungsmethode und technische Checkout-Daten.</p>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung für die Durchführung des Checkouts erforderlich ist, und Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer korrekten, sicheren und nutzerfreundlichen Bereitstellung der angebotenen Zahlungsarten.</p>

        <h3>6.6 Synctrack PayPal Tracking</h3>
        <p>Wir nutzen die Shopify-App Synctrack PayPal Tracking, um Versand- und Trackinginformationen zu PayPal-Transaktionen zu synchronisieren. Dadurch können insbesondere Bestellnummer, PayPal-Transaktionsbezug, Versandstatus, Trackingnummer, Versanddienstleister, Lieferadresse und Zeitpunkte der Versandereignisse verarbeitet und an PayPal übermittelt werden.</p>
        <p>Die Verarbeitung erfolgt zur Zahlungsabsicherung, zur Bearbeitung von Zahlungs- und Versandnachweisen, zur Reduzierung von Rückfragen, Konflikten oder Rückbuchungen und zur Vertragsabwicklung. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>

        <h2>7. Versand, Adressprüfung und Lieferstatus</h2>
        <p>Zur Lieferung bestellter Waren geben wir die für die Zustellung erforderlichen Daten an den jeweils beauftragten Versanddienstleister weiter. Dazu gehören in der Regel Name, Lieferadresse und, soweit für Lieferankündigung oder Abstimmung erforderlich, E-Mail-Adresse oder Telefonnummer.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Weitergabe für die Vertragserfüllung erforderlich ist. Soweit Kontaktdaten für Lieferbenachrichtigungen oder Zustellabstimmung verarbeitet werden, erfolgt dies auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer reibungslosen und kundenfreundlichen Zustellung.</p>

        <h3>7.1 DHL, Post &amp; DHL Shipping und easyDHL</h3>
        <p>Wir nutzen DHL bzw. Deutsche Post DHL für den Versand sowie die Shopify-Apps Post &amp; DHL Shipping und easyDHL zur Erstellung von Versandlabels, Übermittlung von Sendungsdaten, Sendungsverfolgung und Versandabwicklung.</p>
        <p>Dabei können insbesondere Name, Lieferadresse, E-Mail-Adresse, Telefonnummer, Bestellnummer, Versandart, Sendungsnummer, Trackingstatus und Zustellinformationen verarbeitet werden.</p>
        <p>Weitere Informationen von DHL: <a href="https://www.dhl.de/de/toolbar/footer/datenschutz.html" target="_blank" rel="noopener noreferrer">https://www.dhl.de/de/toolbar/footer/datenschutz.html</a></p>

        <h3>7.2 AddressHero</h3>
        <p>Wir nutzen die Shopify-App AddressHero zur Prüfung, Korrektur oder Verbesserung von Lieferadressen. Dabei können insbesondere Name, Lieferadresse, Bestellbezug, Warenkorb- oder Checkout-Daten und technische Informationen verarbeitet werden.</p>
        <p>Die Verarbeitung erfolgt, um fehlerhafte Lieferadressen, Zustellprobleme, Retouren und Nachfragen zu vermeiden. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>

        <h2>8. Kontaktaufnahme, Messaging und Formulare</h2>
        <p>Wenn Sie uns per E-Mail, Telefon, Kontaktformular, Social-Media-Nachricht, Chat/Messaging-Funktion oder auf anderem Weg kontaktieren, verarbeiten wir die von Ihnen übermittelten Daten zur Bearbeitung Ihrer Anfrage. Dazu können insbesondere Name, E-Mail-Adresse, Telefonnummer, Nachrichtentext, Bestellbezug, Social-Media-Profilname und technische Metadaten gehören.</p>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO, wenn Ihre Anfrage mit einem Vertrag oder vorvertraglichen Maßnahmen zusammenhängt, und Art. 6 Abs. 1 lit. f DSGVO in sonstigen Fällen. Unser berechtigtes Interesse liegt in der sachgerechten Beantwortung Ihrer Anfrage.</p>

        <h3>8.1 Shopify Messaging</h3>
        <p>Wir nutzen eine Messaging-Funktion in Shopify, um Kundenanfragen zu beantworten und Kommunikation im Zusammenhang mit Produkten, Bestellungen oder Support zu ermöglichen. Dabei können Nachrichteninhalte, Kontaktdaten, Bestellbezug und technische Informationen verarbeitet werden.</p>

        <h3>8.2 Shopify Forms</h3>
        <p>Wir nutzen Shopify Forms, um Formulare bereitzustellen, z. B. für Kontaktanfragen, Newsletter-Anmeldungen oder Interessentenlisten. Die jeweils eingegebenen Daten werden für den im Formular genannten Zweck verarbeitet.</p>

        <h3>8.3 FlowMail – Flow email sender</h3>
        <p>Wir nutzen FlowMail – Flow email sender, um transaktionale oder automatisierte E-Mails im Zusammenhang mit Shopify-Workflows zu versenden. Dabei können insbesondere E-Mail-Adresse, Name, Bestellbezug, Ereignisdaten und E-Mail-Inhalte verarbeitet werden.</p>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO für vertragsbezogene E-Mails, Art. 6 Abs. 1 lit. c DSGVO für gesetzlich erforderliche Mitteilungen und Art. 6 Abs. 1 lit. f DSGVO für technisch oder organisatorisch notwendige Kommunikation.</p>

        <h2>9. Shopify-Apps für Shop-Funktionen und Automatisierung</h2>
        <p>Wir nutzen verschiedene Shopify-Apps, um den Shop technisch zu betreiben, den Checkout anzupassen, Prozesse zu automatisieren und Kundenkommunikation zu ermöglichen.</p>

        <h3>9.1 Checkout Blocks</h3>
        <p>Wir nutzen Checkout Blocks zur Anpassung und Steuerung von Checkout-Inhalten und Checkout-Funktionen. Dabei können Warenkorb-, Checkout-, Liefer-, Zahlungs- und Bestelldaten verarbeitet werden, soweit dies für die Anzeige oder Steuerung der Checkout-Funktionen erforderlich ist.</p>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>

        <h3>9.2 Shopify Flow</h3>
        <p>Wir nutzen Shopify Flow zur Automatisierung interner Shop-Prozesse. Dabei können Ereignisse im Zusammenhang mit Bestellungen, Kundenkonten, Versand, Zahlungen, Tags, Formularen oder Marketingeinwilligungen verarbeitet werden.</p>
        <p>Die Verarbeitung erfolgt zur effizienten und fehlerarmen Abwicklung interner Prozesse. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO, Art. 6 Abs. 1 lit. c DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>

        <h3>9.3 Newsletter Sync</h3>
        <p>Wir nutzen Newsletter Sync zur Synchronisierung von Newsletter-Anmeldungen oder Marketingeinwilligungen zwischen Shopify und angebundenen E-Mail-Marketing-Diensten. Dabei können insbesondere E-Mail-Adresse, Name, Einwilligungsstatus, Zeitpunkt der Anmeldung, Tags und Kundendaten verarbeitet werden.</p>
        <p>Die Verarbeitung erfolgt zur Verwaltung Ihrer Newsletter-Einwilligung und zum Abgleich mit unserem E-Mail-Marketing-System. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO für den Newsletterversand und Art. 6 Abs. 1 lit. c bzw. lit. f DSGVO für die Dokumentation und Verwaltung der Einwilligung.</p>

        <h2>10. Cookies, lokale Speichertechnologien und Consent-Management</h2>
        <p>Unsere Website verwendet Cookies und vergleichbare Technologien, z. B. Local Storage, Session Storage, Pixel-Tags oder serverseitige Event-Messung. Diese Technologien können technisch erforderlich sein oder Analyse-, Marketing- und Komfortzwecken dienen.</p>
        <p>Technisch erforderliche Cookies und Technologien setzen wir ein, damit die Website funktioniert, z. B. für Warenkorb, Login, Checkout, Sicherheit, Betrugsprävention, Spracheinstellungen oder Consent-Speicherung. Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 2 TDDDG. Die anschließende Verarbeitung personenbezogener Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO oder Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Nicht erforderliche Cookies und Technologien für Analyse, Marketing, Retargeting, Conversion-Messung, Heatmaps, Session-Aufzeichnungen oder Profilbildung setzen wir nur mit Ihrer Einwilligung ein. Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 1 TDDDG. Rechtsgrundlage für die anschließende Verarbeitung personenbezogener Daten ist Art. 6 Abs. 1 lit. a DSGVO.</p>
        <p>Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft über die Cookie-Einstellungen auf unserer Website widerrufen oder ändern.</p>

        <h3>10.1 Consent-Verwaltung</h3>
        <p>Wir verwenden ein über Lovable bereitgestelltes oder in Lovable umgesetztes Consent-Management-System, um Einwilligungen für Cookies und vergleichbare Technologien einzuholen, zu dokumentieren und zu verwalten.</p>
        <p>Dabei können insbesondere folgende Daten verarbeitet werden:</p>
        <ul>
          <li>Consent-ID</li>
          <li>Einwilligungsstatus</li>
          <li>Zeitpunkt der Einwilligung oder Ablehnung</li>
          <li>ausgewählte Kategorien und Dienste</li>
          <li>technische Browser- und Geräteinformationen</li>
          <li>IP-Adresse, soweit zur Nachweisführung erforderlich</li>
        </ul>
        <p>Die Verarbeitung erfolgt zur Erfüllung gesetzlicher Nachweispflichten und zur rechtskonformen Steuerung von Cookies und Tracking-Technologien. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. c DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>

        <h3>10.2 Cookie- und Diensteübersicht</h3>
        <p>Die konkret eingesetzten Cookies und Technologien werden in unserem Consent-Management-System angezeigt. Dort finden Sie Angaben zu Anbieter, Zweck, Kategorie, Speicherdauer und Drittlandtransfer. Nicht erforderliche Dienste werden erst nach Ihrer Einwilligung aktiviert.</p>
        <p>Die Cookie-Übersicht kann insbesondere folgende Dienste abbilden, soweit sie technisch aktiv sind:</p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Dienst</th>
                <th>Anbieter</th>
                <th>Kategorie</th>
                <th>Zweck</th>
                <th>Rechtsgrundlage</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Shopify Cookies</td><td>Shopify</td><td>Erforderlich</td><td>Warenkorb, Checkout, Sicherheit, Shop-Betrieb</td><td>§ 25 Abs. 2 TDDDG, Art. 6 Abs. 1 lit. b/f DSGVO</td></tr>
              <tr><td>Consent-Cookie</td><td>eingesetztes Consent-System</td><td>Erforderlich</td><td>Speicherung und Nachweis der Cookie-Auswahl</td><td>§ 25 Abs. 2 TDDDG, Art. 6 Abs. 1 lit. c/f DSGVO</td></tr>
              <tr><td>Hotjar</td><td>Hotjar</td><td>Analyse</td><td>Heatmaps, Session-Aufzeichnungen, Nutzungsanalyse</td><td>Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>Klaviyo</td><td>Klaviyo</td><td>Marketing/Kommunikation</td><td>Newsletter, E-Mail-Marketing, Kampagnenanalyse</td><td>Einwilligung, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>Meta Pixel/Meta Business Tools</td><td>Meta</td><td>Marketing</td><td>Conversion-Messung, Retargeting, Anzeigenoptimierung</td><td>Soweit aktiv: Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>TikTok Pixel/TikTok Events API</td><td>TikTok</td><td>Marketing</td><td>Conversion-Messung, Retargeting, Anzeigenoptimierung</td><td>Soweit aktiv: Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>Google Analytics / Google Ads</td><td>Google</td><td>Analyse/Marketing</td><td>Reichweitenmessung, Conversion-Messung, Remarketing, Anzeigenoptimierung</td><td>Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>Pinterest Tag</td><td>Pinterest</td><td>Marketing</td><td>Conversion-Messung, Retargeting, Anzeigenoptimierung</td><td>Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>Snapchat Pixel</td><td>Snap</td><td>Marketing</td><td>Conversion-Messung, Retargeting, Anzeigenoptimierung</td><td>Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
              <tr><td>Microsoft Advertising / Microsoft Clarity</td><td>Microsoft</td><td>Analyse/Marketing</td><td>Conversion-Messung, Anzeigenoptimierung, Nutzungsanalyse</td><td>Einwilligung, § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</td></tr>
            </tbody>
          </table>
        </div>

        <h2>11. Analyse und Nutzerverhalten</h2>
        <h3>11.1 Shopify Analytics</h3>
        <p>Shopify stellt uns Statistiken zur Nutzung des Shops und zur Abwicklung von Bestellungen bereit. Dabei können insbesondere Seitenaufrufe, Warenkorbaktivitäten, Checkout-Schritte, Bestellungen, Umsatzdaten, Referrer, technische Informationen und aggregierte Auswertungen verarbeitet werden.</p>
        <p>Soweit diese Verarbeitung für den sicheren, ordnungsgemäßen und wirtschaftlichen Shopbetrieb erforderlich ist, erfolgt sie auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Soweit darüber hinausgehende Analyse-, Marketing- oder Trackingfunktionen eingesetzt werden, erfolgt dies nur mit Ihrer Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO.</p>

        <h3>11.2 Hotjar</h3>
        <p>Wir nutzen Hotjar, einen Analyse-Dienst der Hotjar Limited, Dragonara Business Centre, 5th Floor, Dragonara Road, Paceville St Julian's STJ 3141, Malta.</p>
        <p>Hotjar kann eingesetzt werden, um das Nutzungsverhalten auf unserer Website besser zu verstehen, z. B. anhand von Heatmaps, Klickverhalten, Scrollverhalten, Feedback-Funktionen oder Session-Aufzeichnungen. Dabei können insbesondere IP-Adresse in gekürzter oder pseudonymisierter Form, Geräteinformationen, Browserinformationen, Seitenaufrufe, Mausbewegungen, Klicks, Scrollverhalten und Interaktionen verarbeitet werden. Wir konfigurieren Hotjar so, dass sensible Formularfelder und Zahlungsdaten nicht aufgezeichnet werden.</p>
        <p>Hotjar wird nur auf Grundlage Ihrer Einwilligung eingesetzt. Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 1 TDDDG. Rechtsgrundlage für die anschließende Verarbeitung ist Art. 6 Abs. 1 lit. a DSGVO.</p>
        <p>Weitere Informationen: <a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank" rel="noopener noreferrer">https://www.hotjar.com/legal/policies/privacy/</a></p>

        <h2>12. Online-Marketing, Meta, TikTok und Retargeting</h2>
        <p>Wir betreiben Social-Media-Marketing über Instagram und TikTok. Soweit wir auf unserer Website Marketing-Technologien wie Meta Pixel, TikTok Pixel, Events API, serverseitiges Conversion-Tracking, Retargeting oder Zielgruppenabgleich einsetzen, erfolgt dies nur nach Ihrer vorherigen Einwilligung.</p>
        <p>Dabei können insbesondere folgende Ereignisse verarbeitet werden:</p>
        <ul>
          <li>Seitenaufruf</li>
          <li>Produktansicht</li>
          <li>Suche</li>
          <li>Klick auf Werbemittel</li>
          <li>Hinzufügen zum Warenkorb</li>
          <li>Beginn des Checkouts</li>
          <li>Abschluss eines Kaufs</li>
          <li>Umsatz, Währung und Bestellwert</li>
          <li>Produkt-IDs und Produktkategorien</li>
          <li>pseudonyme Cookie- oder Werbekennungen</li>
          <li>IP-Adresse</li>
          <li>Browser- und Geräteinformationen</li>
          <li>gehashte Kontaktdaten, soweit erweiterter Abgleich oder Custom Audiences aktiv genutzt werden</li>
        </ul>
        <p>Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 1 TDDDG. Rechtsgrundlage für die anschließende Verarbeitung personenbezogener Daten ist Art. 6 Abs. 1 lit. a DSGVO.</p>

        <h3>12.1 Meta Business Tools für Instagram/Facebook-Werbung</h3>
        <p>Sofern auf unserer Website Meta Business Tools, insbesondere Meta Pixel oder Meta Conversions API, aktiv eingebunden sind, nutzen wir diese Dienste von Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland.</p>
        <p>Mit Hilfe dieser Technologien können wir messen, ob Nutzer nach Klick auf eine Meta-Anzeige auf unserer Website bestimmte Aktionen ausführen, z. B. Produkte ansehen, Artikel in den Warenkorb legen, einen Checkout starten oder einen Kauf abschließen. Außerdem können wir Zielgruppen für Werbung bilden und Personen, die unsere Website besucht oder mit unserem Shop interagiert haben, auf Meta-Plattformen wie Instagram oder Facebook erneut ansprechen.</p>
        <p>Meta kann die Daten mit Ihrem Meta-Konto verknüpfen, wenn Sie dort angemeldet sind oder Meta Sie anderweitig wiedererkennen kann. Meta kann die Daten zudem für eigene Zwecke verarbeiten, insbesondere zur Personalisierung von Inhalten und Werbung, zur Messung und Verbesserung von Werbediensten sowie zur Sicherheit der Meta-Produkte.</p>
        <p>Weitere Informationen:<br />
          <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">https://www.facebook.com/privacy/policy/</a><br />
          <a href="https://www.facebook.com/legal/technology_terms" target="_blank" rel="noopener noreferrer">https://www.facebook.com/legal/technology_terms</a><br />
          <a href="https://www.facebook.com/legal/controller_addendum" target="_blank" rel="noopener noreferrer">https://www.facebook.com/legal/controller_addendum</a>
        </p>

        <h3>12.2 TikTok Business Tools</h3>
        <p>Sofern auf unserer Website TikTok Business Tools, insbesondere TikTok Pixel oder TikTok Events API, aktiv eingebunden sind, nutzen wir diese Dienste von TikTok Technology Limited, 10 Earlsfort Terrace, Dublin, D02 T380, Irland, und/oder TikTok Information Technologies UK Limited, 6th Floor, One London Wall, London, EC2Y 5EB, Vereinigtes Königreich.</p>
        <p>Mit TikTok Pixel und TikTok Events API können wir messen, ob Nutzer nach Klick auf eine TikTok-Anzeige bestimmte Aktionen auf unserer Website ausführen. Dazu gehören z. B. Seitenaufrufe, Produktansichten, Warenkorbaktionen, Checkout-Schritte und Käufe. Die Daten können zur Kampagnenmessung, Optimierung von Anzeigen, Zielgruppenbildung und interessenbasierter Werbung genutzt werden.</p>
        <p>Weitere Informationen:<br />
          <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://www.tiktok.com/legal/privacy-policy</a><br />
          <a href="https://ads.tiktok.com/help/article/tiktok-pixel" target="_blank" rel="noopener noreferrer">https://ads.tiktok.com/help/article/tiktok-pixel</a><br />
          <a href="https://ads.tiktok.com/help/article/events-api" target="_blank" rel="noopener noreferrer">https://ads.tiktok.com/help/article/events-api</a>
        </p>

        <h3>12.3 Google Analytics, Google Ads und Google Tag</h3>
        <p>Wir nutzen Dienste von Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, insbesondere Google Analytics, Google Ads Conversion Tracking, Remarketing-Funktionen und Google Tag bzw. Google Tag Manager.</p>
        <p>Mit diesen Diensten können wir die Nutzung unserer Website analysieren, den Erfolg von Werbeanzeigen messen, Zielgruppen bilden, Anzeigen optimieren und Nutzer auf Grundlage ihres Nutzungsverhaltens erneut mit Werbung ansprechen. Dabei können insbesondere IP-Adresse, Cookie- und Nutzerkennungen, Geräte- und Browserinformationen, Referrer, Seitenaufrufe, Klicks, Scroll- und Nutzungsverhalten, Produktinteraktionen, Warenkorb- und Checkout-Ereignisse, Kaufereignisse und Umsatzwerte verarbeitet werden.</p>
        <p>Diese Dienste werden nur nach Ihrer Einwilligung eingesetzt. Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 1 TDDDG. Rechtsgrundlage für die anschließende Verarbeitung ist Art. 6 Abs. 1 lit. a DSGVO. Google kann Daten in die USA und andere Drittländer übermitteln und stützt solche Übermittlungen nach eigenen Angaben auf geeignete Garantien, insbesondere das EU-US Data Privacy Framework und/oder Standardvertragsklauseln.</p>
        <p>Weitere Informationen:<br />
          <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">https://support.google.com/analytics/answer/6004245</a><br />
          <a href="https://support.google.com/google-ads/answer/1722022" target="_blank" rel="noopener noreferrer">https://support.google.com/google-ads/answer/1722022</a><br />
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
        </p>

        <h3>12.4 Pinterest Tag</h3>
        <p>Wir nutzen den Pinterest Tag von Pinterest Europe Ltd., Palmerston House, 2nd Floor, Fenian Street, Dublin 2, Irland, und Pinterest, Inc., 651 Brannan Street, San Francisco, CA 94107, USA.</p>
        <p>Mit dem Pinterest Tag können wir messen, ob Nutzer nach Interaktion mit einer Pinterest-Anzeige bestimmte Aktionen auf unserer Website ausführen, z. B. Produktansichten, Warenkorbaktionen, Checkout-Schritte oder Käufe. Die Daten können für Conversion-Messung, Kampagnenoptimierung, Zielgruppenbildung und Retargeting genutzt werden.</p>
        <p>Rechtsgrundlage ist Ihre Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO. Pinterest kann Daten in Drittländer übermitteln. Soweit erforderlich, erfolgt dies auf Grundlage geeigneter Garantien.</p>
        <p>Weitere Informationen: <a href="https://policy.pinterest.com/en/privacy-policy" target="_blank" rel="noopener noreferrer">https://policy.pinterest.com/en/privacy-policy</a></p>

        <h3>12.5 Snapchat Pixel</h3>
        <p>Wir nutzen den Snapchat Pixel bzw. Werbedienste von Snap Group Limited, 50 Cowcross Street, Floor 2, London, EC1M 6AL, Vereinigtes Königreich, und/oder Snap Inc., 3000 31st Street, Santa Monica, CA 90405, USA.</p>
        <p>Mit dem Snapchat Pixel können wir messen, ob Nutzer nach Interaktion mit einer Snapchat-Anzeige bestimmte Aktionen auf unserer Website ausführen. Dazu gehören z. B. Seitenaufrufe, Produktansichten, Warenkorbaktionen, Checkout-Schritte und Käufe. Die Daten können für Conversion-Messung, Anzeigenoptimierung, Zielgruppenbildung und Retargeting genutzt werden.</p>
        <p>Rechtsgrundlage ist Ihre Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO. Snap kann Daten in Drittländer übermitteln. Soweit erforderlich, erfolgt dies auf Grundlage geeigneter Garantien.</p>
        <p>Weitere Informationen:<br />
          <a href="https://values.snap.com/privacy/privacy-policy" target="_blank" rel="noopener noreferrer">https://values.snap.com/privacy/privacy-policy</a><br />
          <a href="https://businesshelp.snapchat.com/s/article/pixel-website-install" target="_blank" rel="noopener noreferrer">https://businesshelp.snapchat.com/s/article/pixel-website-install</a>
        </p>

        <h3>12.6 Microsoft Advertising und Microsoft Clarity</h3>
        <p>Wir nutzen Microsoft Advertising und Microsoft Clarity von Microsoft Ireland Operations Limited, One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland.</p>
        <p>Microsoft Advertising kann eingesetzt werden, um den Erfolg von Werbeanzeigen zu messen, Conversions zu erfassen, Zielgruppen zu bilden und Anzeigen zu optimieren. Microsoft Clarity kann eingesetzt werden, um Nutzungsverhalten auf unserer Website anhand von Heatmaps, Klicks, Scrollverhalten und Session-Aufzeichnungen auszuwerten. Dabei können insbesondere IP-Adresse, Cookie- und Nutzerkennungen, Browser- und Geräteinformationen, Seitenaufrufe, Klicks, Scrollverhalten, Interaktionen, Referrer, Conversion-Ereignisse und technische Nutzungsdaten verarbeitet werden.</p>
        <p>Diese Dienste werden nur nach Ihrer Einwilligung eingesetzt. Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist § 25 Abs. 1 TDDDG. Rechtsgrundlage für die anschließende Verarbeitung ist Art. 6 Abs. 1 lit. a DSGVO. Microsoft kann Daten in die USA und andere Drittländer übermitteln und stützt solche Übermittlungen nach eigenen Angaben auf geeignete Garantien, insbesondere das EU-US Data Privacy Framework und/oder Standardvertragsklauseln.</p>
        <p>Weitere Informationen: <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">https://privacy.microsoft.com/privacystatement</a></p>

        <h2>13. Newsletter, E-Mail-Marketing und SMS</h2>
        <h3>13.1 Newsletter-Anmeldung</h3>
        <p>Wenn Sie sich für unseren Newsletter oder SMS-Marketing anmelden, verarbeiten wir Ihre E-Mail-Adresse, Telefonnummer und weitere freiwillige Angaben wie Name, Interessen oder Tags, um Ihnen Informationen zu Produkten, Angeboten, Aktionen und Neuigkeiten zuzusenden.</p>
        <p>Die Anmeldung erfolgt grundsätzlich im Double-Opt-In-Verfahren, soweit dies für die konkrete Anmeldung technisch vorgesehen ist. Dabei speichern wir Zeitpunkt der Anmeldung, Zeitpunkt der Bestätigung, IP-Adresse und Einwilligungstext, um Ihre Einwilligung nachweisen zu können.</p>
        <p>Rechtsgrundlage für den Versand ist Art. 6 Abs. 1 lit. a DSGVO. Rechtsgrundlage für die Protokollierung ist Art. 6 Abs. 1 lit. c DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, z. B. über den Abmeldelink in jeder Newsletter-E-Mail oder durch Nachricht an uns.</p>

        <h3>13.2 Klaviyo</h3>
        <p>Wir nutzen Klaviyo für E-Mail-Marketing und SMS-Marketing. Anbieter ist Klaviyo, Inc., 125 Summer Street, Boston, MA 02110, USA.</p>
        <p>Klaviyo verarbeitet insbesondere:</p>
        <ul>
          <li>E-Mail-Adresse</li>
          <li>Name, sofern angegeben</li>
          <li>Telefonnummer, sofern für SMS-Marketing angegeben</li>
          <li>Einwilligungsstatus</li>
          <li>Anmelde- und Abmeldezeitpunkte</li>
          <li>Bestell- und Produktinteressen</li>
          <li>Newsletter-Öffnungen und Klicks</li>
          <li>Tags, Segmente und Kampagnenzuordnungen</li>
          <li>technische Informationen wie IP-Adresse, Browser- und Gerätedaten</li>
        </ul>
        <p>Wir nutzen Klaviyo, um Newsletter und Marketingnachrichten zu versenden, Einwilligungen zu verwalten, Kampagnen zu analysieren und Inhalte zu personalisieren. Rechtsgrundlage für werbliche Nachrichten ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Soweit Informationen auf Ihrem Endgerät gespeichert oder ausgelesen werden, erfolgt dies auf Grundlage von § 25 Abs. 1 TDDDG. Rechtsgrundlage für die Dokumentation von Einwilligungen ist Art. 6 Abs. 1 lit. c DSGVO und Art. 6 Abs. 1 lit. f DSGVO.</p>
        <p>Klaviyo verarbeitet Daten auch in den USA. Soweit erforderlich, erfolgt die Übermittlung auf Grundlage geeigneter Garantien, insbesondere Standardvertragsklauseln und/oder einer Zertifizierung nach dem EU-US Data Privacy Framework, soweit vorhanden.</p>
        <p>Weitere Informationen: <a href="https://www.klaviyo.com/legal/privacy" target="_blank" rel="noopener noreferrer">https://www.klaviyo.com/legal/privacy</a></p>

        <h3>13.3 Bestandskundenwerbung für ähnliche Waren</h3>
        <p>Wenn wir Ihre E-Mail-Adresse im Zusammenhang mit dem Verkauf einer Ware oder Dienstleistung erhalten haben, können wir Ihnen auch ohne gesonderte Newsletter-Einwilligung Werbung für eigene ähnliche Waren oder Dienstleistungen zusenden, sofern die gesetzlichen Voraussetzungen des § 7 Abs. 3 UWG vorliegen.</p>
        <p>Dies gilt nur, wenn:</p>
        <ul>
          <li>wir Ihre E-Mail-Adresse im Zusammenhang mit einem Verkauf erhalten haben,</li>
          <li>wir die Adresse nur für Direktwerbung für eigene ähnliche Waren oder Dienstleistungen verwenden,</li>
          <li>Sie der Verwendung nicht widersprochen haben,</li>
          <li>wir Sie bei Erhebung der Adresse und bei jeder Verwendung klar und deutlich darauf hinweisen, dass Sie der Verwendung jederzeit widersprechen können, ohne dass hierfür andere als die Übermittlungskosten nach den Basistarifen entstehen.</li>
        </ul>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Sie können der Verwendung Ihrer E-Mail-Adresse für Direktwerbung jederzeit widersprechen.</p>

        <h2>14. Shopify Collabs, Influencer- und Affiliate-Marketing</h2>
        <p>Wir nutzen Shopify Collabs, um Kooperationen mit Creatorn, Influencern oder Affiliate-Partnern zu verwalten. Wenn Sie sich als Kooperationspartner bewerben oder über einen Affiliate-/Creator-Link bestellen, können personenbezogene Daten verarbeitet werden.</p>
        <p>Dazu können insbesondere gehören:</p>
        <ul>
          <li>Name und Kontaktdaten</li>
          <li>Social-Media-Profile</li>
          <li>Kommunikationsdaten</li>
          <li>Bewerbungs- oder Kooperationsinformationen</li>
          <li>Affiliate-Link, Rabattcode oder Kampagnenzuordnung</li>
          <li>Bestell- und Provisionsdaten</li>
          <li>Zahlungs- oder Abrechnungsdaten von Kooperationspartnern</li>
        </ul>
        <p>Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO für Kooperations- und Abrechnungsprozesse, Art. 6 Abs. 1 lit. c DSGVO für gesetzliche Pflichten und Art. 6 Abs. 1 lit. f DSGVO für die Verwaltung und Auswertung von Kooperationen.</p>

        <h2>15. Social-Media-Auftritte</h2>
        <p>Wir betreiben folgende Social-Media-Auftritte:</p>
        <ul>
          <li>Instagram: <a href="https://www.instagram.com/foquz.official" target="_blank" rel="noopener noreferrer">https://www.instagram.com/foquz.official</a></li>
          <li>TikTok: <a href="https://www.tiktok.com/@foquz.official" target="_blank" rel="noopener noreferrer">https://www.tiktok.com/@foquz.official</a></li>
        </ul>
        <p>Wenn Sie unsere Social-Media-Profile besuchen oder mit uns dort interagieren, verarbeiten sowohl wir als auch der jeweilige Plattformbetreiber personenbezogene Daten. Dazu können Profilinformationen, Kommentare, Nachrichten, Likes, Interaktionen, technische Daten, Nutzungsdaten und statistische Auswertungen gehören.</p>
        <p>Wir verarbeiten Daten aus Social-Media-Interaktionen zur Kommunikation, Kundenbetreuung, Bearbeitung von Anfragen, Öffentlichkeitsarbeit und Auswertung der Reichweite unserer Inhalte. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage mit einem Vertrag zusammenhängt, und Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in Kommunikation, Marketing und der Verbesserung unserer Angebote.</p>
        <p>Die Plattformbetreiber können Daten für eigene Zwecke verarbeiten, insbesondere zur Bereitstellung der Plattform, Analyse, Werbung, Profilbildung und Personalisierung. Auf diese Verarbeitung haben wir nur begrenzten Einfluss.</p>

        <h3>15.1 Instagram</h3>
        <p>Unser Instagram-Auftritt wird über Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland, bereitgestellt.</p>
        <p>Meta stellt uns für unseren Instagram-Auftritt aggregierte Statistiken bereit, sogenannte Insights. Für bestimmte Insight-Verarbeitungen können Meta und wir gemeinsam verantwortlich im Sinne von Art. 26 DSGVO sein. Die wesentlichen Informationen stellt Meta bereit.</p>
        <p>Weitere Informationen:<br />
          <a href="https://privacycenter.instagram.com/policy/" target="_blank" rel="noopener noreferrer">https://privacycenter.instagram.com/policy/</a><br />
          <a href="https://www.facebook.com/legal/terms/page_controller_addendum" target="_blank" rel="noopener noreferrer">https://www.facebook.com/legal/terms/page_controller_addendum</a>
        </p>

        <h3>15.2 TikTok</h3>
        <p>Unser TikTok-Auftritt wird von TikTok Technology Limited, 10 Earlsfort Terrace, Dublin, D02 T380, Irland, bereitgestellt.</p>
        <p>Wenn Sie unser TikTok-Profil besuchen oder mit unseren Inhalten interagieren, kann TikTok insbesondere Nutzungsdaten, Interaktionsdaten, technische Daten und Profilinformationen verarbeiten. TikTok kann Daten auch für Analyse, Werbung und Personalisierung verwenden.</p>
        <p>Weitere Informationen: <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://www.tiktok.com/legal/privacy-policy</a></p>

        <h2>16. Betrugsprävention, Sicherheit und Missbrauchserkennung</h2>
        <p>Wir verarbeiten personenbezogene Daten, um Betrug, Missbrauch, Spam, unberechtigte Zugriffe, Zahlungsrisiken und Sicherheitsvorfälle zu erkennen und zu verhindern.</p>
        <p>Dazu können insbesondere IP-Adresse, technische Geräteinformationen, Bestell- und Zahlungsdaten, Login-Daten, Risikosignale, Fehlermeldungen und sicherheitsbezogene Ereignisse verarbeitet werden.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der Sicherheit unserer Website, dem Schutz unserer Kunden, der Verhinderung von Zahlungsausfällen und der Abwehr rechtswidriger Handlungen. Soweit gesetzliche Pflichten bestehen, ist Art. 6 Abs. 1 lit. c DSGVO Rechtsgrundlage.</p>

        <h2>17. Empfänger personenbezogener Daten</h2>
        <p>Wir geben personenbezogene Daten nur weiter, wenn dies für die genannten Zwecke erforderlich ist, Sie eingewilligt haben oder eine gesetzliche Verpflichtung besteht.</p>
        <p>Empfänger oder Kategorien von Empfängern können insbesondere sein:</p>
        <ul>
          <li>Hosting- und Infrastruktur-Dienstleister</li>
          <li>Shop- und Checkout-Anbieter</li>
          <li>Zahlungsdienstleister</li>
          <li>Versanddienstleister</li>
          <li>IT- und Wartungsdienstleister</li>
          <li>Newsletter- und Kommunikationsdienstleister</li>
          <li>Analyse- und Marketingdienstleister, soweit eingewilligt</li>
          <li>Anbieter der genannten Shopify-Apps</li>
          <li>Steuerberater, Rechtsberater und Wirtschaftsprüfer</li>
          <li>Behörden, Gerichte und öffentliche Stellen, soweit gesetzlich erforderlich</li>
        </ul>
        <p>Mit Dienstleistern, die personenbezogene Daten in unserem Auftrag verarbeiten, schließen wir Verträge zur Auftragsverarbeitung nach Art. 28 DSGVO, soweit dies erforderlich ist.</p>

        <h2>18. Drittlandtransfers</h2>
        <p>Einige der von uns eingesetzten Dienstleister können personenbezogene Daten außerhalb der EU/des EWR verarbeiten, insbesondere in den USA, Kanada oder dem Vereinigten Königreich.</p>
        <p>Soweit für ein Drittland ein Angemessenheitsbeschluss der Europäischen Kommission besteht, stützen wir die Übermittlung hierauf. Soweit kein Angemessenheitsbeschluss besteht, erfolgt die Übermittlung nur auf Grundlage geeigneter Garantien, insbesondere Standardvertragsklauseln nach Art. 46 DSGVO, zusätzlicher Schutzmaßnahmen oder Ihrer ausdrücklichen Einwilligung, soweit erforderlich.</p>
        <p>Bei US-Anbietern kann eine Übermittlung außerdem auf das EU-US Data Privacy Framework gestützt werden, sofern der jeweilige Anbieter entsprechend zertifiziert ist.</p>

        <h2>19. Speicherdauer</h2>
        <p>Wir speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
        <p>Typische Speicherfristen sind:</p>
        <ul>
          <li>Vertrags- und Bestelldaten: regelmäßig 6 bis 10 Jahre nach handels- und steuerrechtlichen Vorgaben.</li>
          <li>Rechnungs- und Buchhaltungsdaten: regelmäßig 10 Jahre.</li>
          <li>Handels- und Geschäftsbriefe: regelmäßig 6 Jahre.</li>
          <li>Kundenkonto-Daten: bis zur Löschung des Kontos, soweit keine Aufbewahrungspflichten entgegenstehen.</li>
          <li>Kontaktanfragen: bis zur abschließenden Bearbeitung, danach nach Maßgabe gesetzlicher Fristen oder berechtigter Interessen.</li>
          <li>Newsletter-Einwilligungen: für die Dauer des Newsletterbezugs und danach so lange, wie der Nachweis der Einwilligung erforderlich ist.</li>
          <li>Consent-Daten: für die Dauer der Nachweisnotwendigkeit und nach Maßgabe der Einstellungen des Consent-Systems.</li>
          <li>Server-Logfiles: nach Maßgabe der Einstellungen des Hosting- bzw. Shop-Anbieters.</li>
          <li>Marketing- und Analyse-Cookies: gemäß der jeweiligen Angabe im Consent-System.</li>
        </ul>
        <p>Nach Ablauf der jeweiligen Frist werden die Daten gelöscht oder anonymisiert, soweit keine weitere Rechtsgrundlage für die Verarbeitung besteht.</p>

        <h2>20. Pflicht zur Bereitstellung von Daten</h2>
        <p>Die Bereitstellung bestimmter personenbezogener Daten ist für den Abschluss und die Durchführung eines Vertrags erforderlich, insbesondere Name, Rechnungs- und Lieferadresse, E-Mail-Adresse, Bestelldaten und Zahlungsinformationen. Ohne diese Daten können wir Ihre Bestellung nicht bearbeiten.</p>
        <p>Die Bereitstellung von Daten für Newsletter, Analyse, Marketing oder nicht erforderliche Cookies ist freiwillig. Wenn Sie keine Einwilligung erteilen, entstehen Ihnen hierdurch keine Nachteile für die Nutzung der grundlegenden Shop-Funktionen.</p>

        <h2>21. Automatisierte Entscheidungsfindung</h2>
        <p>Wir treffen keine Entscheidungen, die ausschließlich auf einer automatisierten Verarbeitung einschließlich Profiling beruhen und Ihnen gegenüber rechtliche Wirkung entfalten oder Sie in ähnlicher Weise erheblich beeinträchtigen.</p>
        <p>Zahlungsdienstleister oder Betrugspräventionsdienste können eigene automatisierte Prüfungen zur Betrugsvermeidung, Bonitätsbewertung oder Zahlungsabsicherung durchführen. Informationen hierzu finden Sie in den Datenschutzhinweisen der jeweiligen Anbieter.</p>

        <h2>22. Datensicherheit</h2>
        <p>Wir treffen technische und organisatorische Maßnahmen, um personenbezogene Daten gegen Verlust, Zerstörung, Veränderung, unbefugten Zugriff und unbefugte Offenlegung zu schützen. Dazu gehören insbesondere Zugriffsbeschränkungen, Verschlüsselung, sichere Übertragung, Berechtigungskonzepte, Protokollierung, Datensicherungen und regelmäßige Überprüfung der Sicherheitsmaßnahmen, soweit angemessen.</p>

        <h2>23. Ihre Rechte</h2>
        <p>Sie haben nach Maßgabe der gesetzlichen Voraussetzungen folgende Rechte:</p>
        <ul>
          <li>Recht auf Auskunft, Art. 15 DSGVO</li>
          <li>Recht auf Berichtigung, Art. 16 DSGVO</li>
          <li>Recht auf Löschung, Art. 17 DSGVO</li>
          <li>Recht auf Einschränkung der Verarbeitung, Art. 18 DSGVO</li>
          <li>Recht auf Datenübertragbarkeit, Art. 20 DSGVO</li>
          <li>Recht auf Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO, Art. 21 DSGVO</li>
          <li>Recht auf Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft, Art. 7 Abs. 3 DSGVO</li>
          <li>Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde, Art. 77 DSGVO</li>
        </ul>
        <p>Wenn wir personenbezogene Daten auf Grundlage Ihrer Einwilligung verarbeiten, können Sie diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt unberührt.</p>
        <p>Wenn wir personenbezogene Daten auf Grundlage berechtigter Interessen verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, Widerspruch gegen die Verarbeitung einlegen. Bei Direktwerbung haben Sie ein jederzeitiges Widerspruchsrecht ohne Angabe von Gründen.</p>
        <p>Zur Ausübung Ihrer Rechte können Sie sich an die oben genannten Kontaktdaten wenden.</p>

        <h2>24. Zuständige Aufsichtsbehörde</h2>
        <p>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Für uns ist zuständig:</p>
        <p>
          Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)<br />
          Promenade 18<br />
          91522 Ansbach<br />
          Deutschland<br />
          Website: <a href="https://www.lda.bayern.de/" target="_blank" rel="noopener noreferrer">https://www.lda.bayern.de/</a>
        </p>
        <p>Sie können sich auch an eine andere zuständige Datenschutzaufsichtsbehörde wenden.</p>

        <h2>25. Aktualisierung dieser Datenschutzerklärung</h2>
        <p>Wir passen diese Datenschutzerklärung an, wenn sich unsere Datenverarbeitungen, eingesetzte Dienste, technische Funktionen oder rechtliche Anforderungen ändern. Es gilt jeweils die auf unserer Website veröffentlichte Fassung.</p>

      </div>
    </div>
    <Footer />
  </div>
);

export default Datenschutz;
