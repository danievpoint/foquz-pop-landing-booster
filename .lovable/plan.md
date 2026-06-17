
# Rechtssicherheits-Audit FOQUZ Shop (EU/DE)

Geprüft: Impressum, Datenschutz, AGB, Widerruf, Versand, Cookie-Banner, Newsletter, Footer, Checkout-Flow.

## Befunde

### 🔴 Kritisch (rechtlich problematisch, muss vor Live-Gang behoben werden)

1. **Cookie-Banner nicht TTDSG/DSGVO-konform**
   - Kein „Ablehnen"-Button gleichwertig zu „Akzeptieren" (vorhanden, aber nur Text — okay)
   - Aber: **keine granulare Auswahl** (Notwendig / Statistik / Marketing)
   - **Keine Einstellungs-Seite/Link** zum späteren Ändern der Einwilligung
   - **Keine Auflistung der gesetzten Cookies/Drittanbieter** (Pflicht nach EuGH „Planet49")
   - **Skripte werden trotzdem geladen**, der Banner blockiert nichts → reine Show. Muss tatsächlich Drittanbieter-Skripte (z. B. Meta-Pixel, Analytics, falls genutzt) erst nach Consent laden.

2. **Versandbedingungen leer** („wird in Kürze veröffentlicht")
   - Pflicht nach Art. 246a § 1 EGBGB: Lieferzeit, Versandkosten, Lieferländer.
   - Footer-Link führt aktuell ins Leere → **Abmahnrisiko**.

3. **OS-Plattform-Link fehlt komplett** (Art. 14 ODR-VO)
   - Pflicht: anklickbarer Link zu `https://ec.europa.eu/consumers/odr` im Impressum **und** leicht zugänglich (Footer).

4. **„Zur Kasse"-Button entspricht nicht § 312j Abs. 3 BGB („Button-Lösung")**
   - Der Button heißt aktuell „ZUR KASSE". Vorgeschrieben ist eine eindeutige Formulierung wie **„Zahlungspflichtig bestellen"**, „Kaufen" oder gleichwertig **direkt vor der Bestellabgabe**. „Zur Kasse" ist okay, **wenn** danach noch ein finaler Bestellbutton im Shopify-Checkout kommt (was hier der Fall ist, da Shopify übernimmt) — also okay, aber: **Checkout läuft auf Shopify-Domain**, dort muss Shopify-Checkout den Pflicht-Button-Text setzen (Standard ist konform). → **Hinweis, kein Codefix**.

5. **Checkout-Zusammenfassung vor Bestellabgabe (§ 312j Abs. 2 BGB)**
   - Pflichtangaben unmittelbar vor Bestellung: wesentliche Produktmerkmale, Gesamtpreis, Versandkosten, Vertragslaufzeit.
   - Der Cart-Drawer zeigt nur Name + Preis, **keine Produktmerkmale, keine Versandkosten-Info**. Versand wird erst im Shopify-Checkout berechnet → akzeptabel, **aber** Hinweis „zzgl. Versand" im Drawer ergänzen.

6. **Datenschutzerklärung listet Plattformen, die nicht (mehr) genutzt werden**
   - Facebook, Twitter/X, Twitch, LinkedIn, Xing werden beschrieben, sind aber im Footer nicht verlinkt. Das ist nicht direkt rechtswidrig, aber **inhaltlich falsch** und schwächt die Glaubwürdigkeit. TikTok ist neu verlinkt — gut, ist drin.
   - **Shopify als Auftragsverarbeiter fehlt** in der Datenschutzerklärung (Pflicht Art. 13 DSGVO: Empfänger personenbezogener Daten). Auch **Lovable Cloud / Supabase** (Newsletter-E-Mails, Edge Functions) muss genannt werden.
   - **Newsletter-Verarbeitung (Double-Opt-In, Speicherung, Widerruf)** ist nicht erkennbar dokumentiert.

7. **Newsletter ohne Double-Opt-In erkennbar**
   - Anmeldung scheint sofort den Rabatt zu aktivieren. DSGVO/UWG fordern **Double-Opt-In** (Bestätigungs-Mail mit Verifikations-Link). Bitte serverseitig prüfen / dokumentieren.
   - Checkbox „Ich willige in die Verarbeitung … ein" fehlt — der Disclaimer-Text alleine ersetzt keine aktive Einwilligungshandlung (laut Aufsichtsbehörden empfohlen: opt-in-Checkbox, nicht vorausgewählt).

8. **AGB §10 Abs. 5 unzulässig**
   - „Ein Widerspruchsrecht gegen Änderungen dieser AGB besteht nicht" → bei Verbrauchern **unwirksam** (BGH-Rspr.). Muss raus / umformuliert werden.

9. **AGB §7 Abs. 4 (Haftungsausschluss)** ist zu pauschal
   - Haftung für Leben, Körper, Gesundheit, Kardinalpflichten, Produkthaftungsgesetz darf nicht ausgeschlossen werden → klarstellende Formulierung ergänzen.

10. **Impressum §5 DDG vs. §18 MStV**
    - §5 DDG ist korrekt (DDG hat TMG abgelöst). Aber: bei journalistisch-redaktionellen Inhalten (Blog, Social-Posts mit redaktionellem Charakter) fehlt der **Verantwortliche nach §18 Abs. 2 MStV**. → Optional, falls Content/Blog kommt.

11. **USt-ID fehlt** im Impressum (Pflicht nur wenn vorhanden — falls vorhanden, **muss** sie rein).

12. **Telefonnummer im Impressum** ist eine Mobilnummer ohne Vorwahl-Format („01702420257"). Sollte als `+49 170 2420257` formatiert sein für Erreichbarkeit-Pflicht.

### 🟡 Empfohlen (Best Practice / nice-to-have)

13. **Preisangabenverordnung (PAngV)**: Produktseiten müssen zeigen:
    - Gesamtpreis inkl. MwSt.
    - „inkl. MwSt., zzgl. [Versandkosten-Link]"
    - Bei Verbrauchsgütern: **Grundpreis pro 100 g / kg / ml** (Pflicht bei Riechdosen mit Füllmenge!)
    - **Aktuell fehlt der Grundpreis** auf Karten und Produktdetailseite — **abmahnrelevant**.

14. **Streichpreise / Rabatte (PAngV §11)**: Bei „10% Rabatt" muss der **niedrigste Preis der letzten 30 Tage** angegeben werden.

15. **Barrierefreiheit (BFSG, gilt ab 28.06.2025)**
    - Onlineshops müssen barrierefrei sein. Mind. WCAG 2.1 AA: Kontraste, Alt-Texte, Tastaturbedienung, Formular-Labels. Sollte separat geprüft werden.

16. **Cookie-Consent-Logging**: aktuell nur `localStorage`. DSGVO-Beweispflicht erfordert serverseitiges Logging mit Zeitstempel.

17. **Datenschutz: Rechtsgrundlage für Shopify-Checkout** (Drittland USA?) und SCC-Hinweis ergänzen.

## Plan der Umsetzung (in Code)

Frontend-Anpassungen (alles ohne Design-Änderung):

```
1. src/pages/Versandbedingungen.tsx      → vollständigen Text einfügen
                                            (Lieferzeit, Versandkosten,
                                            Lieferländer, Versanddienstleister)
2. src/pages/Impressum.tsx                → OS-Plattform-Link (Art. 14 ODR-VO)
                                            ergänzen + Tel. neu formatieren
3. src/components/Footer.tsx              → Link „Versand" wieder relevant,
                                            zusätzlich OS-Plattform-Hinweis
                                            (optional)
4. src/pages/Datenschutz.tsx              → Shopify, Lovable Cloud/Supabase,
                                            Newsletter-Verarbeitung,
                                            Drittlandtransfers ergänzen
                                          → nicht genutzte Plattformen
                                            (Facebook, X, Twitch, LinkedIn,
                                            Xing) entfernen
5. src/pages/AGB.tsx                      → §10(5) entfernen, §7(4) um
                                            gesetzlich zwingende Haftung
                                            ergänzen
6. src/components/CookieBanner.tsx        → granulare Einwilligung
                                            (Notwendig / Statistik / Marketing)
                                          → „Einstellungen ändern"-Link im
                                            Footer
                                          → Skript-Loader, der externe
                                            Skripte nur nach Consent lädt
                                            (sofern Analytics/Pixel genutzt)
7. src/components/NewsletterSection.tsx   → Opt-in-Checkbox (nicht
                                            vorausgewählt) ergänzen
                                          → Hinweis auf Double-Opt-In-Mail
8. supabase/functions/shopify-newsletter  → Double-Opt-In-Flow
                                            (Confirmation-Mail mit Token)
                                            *(falls noch nicht vorhanden —
                                             vor Implementierung prüfen)*
9. src/components/CartDrawer.tsx          → Hinweis „zzgl. Versand" und
                                            Link zu Versandbedingungen
10. ProductGrid / ProductDetail           → Grundpreis (€/100 g) anzeigen
                                          → bei Rabatten Streichpreis
                                            korrekt nach PAngV §11
```

## Was ich von dir noch brauche (vor Umsetzung)

Damit ich keine erfundenen Angaben schreibe:

1. **Versandbedingungen**: Versanddienstleister (DHL/DPD/…?), Versandkosten DE/EU, Versandkostenfrei-Grenze, Lieferzeiten DE/EU, welche Länder bedient werden.
2. **USt-ID** der FOQUZ GmbH (falls vorhanden → ins Impressum).
3. **Genutzte Tracking-Tools**: Meta-Pixel, Google Analytics, TikTok-Pixel? (für Cookie-Banner-Logik)
4. **Newsletter Double-Opt-In** bereits implementiert in der Edge Function `shopify-newsletter`? Wenn nein → soll ich das nachrüsten?
5. **Grundpreis-Angabe**: Füllmenge pro Riechdose (z. B. 5 g)? → für €/100 g.
6. **Produktverantwortlichkeit/Sicherheit**: Sind die Riechdosen als Verbraucherprodukte unter GPSR (General Product Safety Regulation, gilt seit 13.12.2024) gekennzeichnet? Falls ja: Herstellerangaben + Sicherheits-Warnhinweise auf Produktdetailseite.

Sag mir, welche Punkte ich umsetzen soll (alles, oder Auswahl) und liefere die offenen Angaben — dann baue ich's in einem Rutsch ein.
