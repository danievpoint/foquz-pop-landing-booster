# Kampagne "3 für 2" – Kaufe 2 Dosen, dritte gratis

Ab sofort aktiv, Kunde wählt die Gratis-Sorte selbst. Der Rabatt wird in Shopify hinterlegt, damit die Bestellung, die Rechnung und der Lieferschein die dritte Dose korrekt als kostenlos ausweisen.

## So funktioniert es für den Kunden

1. Kunde legt 2 Dosen in den Warenkorb.
2. Im Warenkorb erscheint ein auffälliger Hinweis: "Deine 3. Dose ist gratis – wähle deine Sorte".
3. Kunde wählt eine der vier Sorten aus einer kleinen Auswahlreihe; sie wird als dritte Dose hinzugefügt.
4. Der Preis der günstigsten Dose wird automatisch abgezogen – im Warenkorb sichtbar und im Shopify-Checkout identisch.
5. Beim Bezahlen ist die dritte Dose als eigene Position mit 0 € enthalten, also auch auf dem Lieferschein.

Bei 5 Dosen greift die Aktion zweimal (immer je 2 gekaufte = 1 gratis), wenn gewünscht; standardmäßig einmal pro Bestellung.

## Regeln

- Gilt nur für Einzeldosen, nicht für das Power Bundle (dort gibt es bereits Rabatt + Zugaben).
- Nicht mit anderen Rabattcodes kombinierbar: es gilt weiterhin nur ein Code pro Bestellung, der beste gewinnt.
- Entfernt der Kunde eine der bezahlten Dosen, verschwindet die Gratis-Dose automatisch wieder.

## Umsetzung (technisch)

1. **Shopify**: Neue Price Rule + Rabattcode `3FUER2` als "Buy X Get Y": Kauf von 2 Dosen (Einzeldosen-Varianten als Voraussetzung) → 1 Dose zu 100 % Rabatt, Start sofort, kein Enddatum, Nutzung pro Bestellung einmal.
2. **`src/contexts/CartContext.tsx`**:
   - `KNOWN_DISCOUNTS` um `3FUER2` erweitern (Wert wird ohnehin über Shopify verifiziert, die Anzeige nutzt den von Shopify zurückgegebenen Rabattbetrag).
   - Neue abgeleitete Werte: Anzahl bezahlter Einzeldosen, ob ein Gratis-Slot offen ist, sowie `freeCanId`.
   - Auto-Code-Kandidat `3FUER2` ergänzen, sobald eine Gratis-Dose im Warenkorb liegt; bestehende "nur ein Code"-Logik bleibt unverändert.
   - Sync-Effekt analog zum bestehenden Geschenk-Sync: Gratis-Dose entfernen, sobald weniger als 2 bezahlte Dosen im Warenkorb sind.
   - Die Gratis-Dose wird als normale Variante mit Menge 1 an den Shopify-Checkout übergeben (Rabattierung erfolgt über den Code), damit sie in Shopify als Position erscheint.
3. **`src/components/CartDrawer.tsx`**: Auswahlblock für die Gratis-Sorte (vier kleine Produktkacheln aus `src/data/products.ts`), Kennzeichnung der Gratis-Zeile als "GRATIS", kein Mengen-Stepper auf dieser Zeile.
4. **Hinweis-Banner**: kurze Zeile im Warenkorb und optional in der Marquee-Leiste ("3 FÜR 2 – DIE DRITTE DOSE GRATIS").
5. **Verifikation**: Checkout-Aufruf gegen Shopify prüfen (`discountCodes.applicable`), damit die Rabattsumme im Warenkorb dem Shopify-Checkout entspricht.

Das bestehende Design und die Power-Bundle-Logik bleiben unangetastet.
