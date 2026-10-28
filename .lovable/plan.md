# Prüfbericht: feste Bundles 3 / 4 / 8 (nichts geändert)

## Live-Befund Shopify (Storefront, 28.10.2026, Testwarenkörbe ohne Bestellung)

| Variante | ID | Preis | Lieferbar |
|---|---|---|---|
| Peach Party | 52867405513046 | 7,49 | ja |
| Thai Style | 52867410788694 | 7,49 | **nein** |
| Lemon Breezy | 52867411738966 | 7,49 | ja |
| Watermelon Flex | 55343195816278 | 7,49 | ja |
| Blueberry Flow | 55343191359830 | 7,49 | ja |
| Starter/Power Bundle | 55628113117526 | – | **für Storefront unsichtbar** |
| 5er Squad Bundle | 55628142707030 | – | **unsichtbar** |
| 10er Vorrats-Bundle | 55628181274966 | – | **unsichtbar** |
| 6er Vorrats-Set (alt) | 55425602879830 | 34,90 | ja, keine Komponenten |
| Prio-Versand | 55430739493206 | – | **unsichtbar** (Prio-Checkout weiterhin kaputt) |
| Sticker / Stripes Gratis | 55135962988886 / 55135961514326 | 0,00 | ja |

Folge: Weil Thai fehlt, sind alle Sets aktuell im freien Modus.

Aktuelle Preise über die automatischen Mengenrabatte (Einzeldosen):
- 3 Dosen (Blue/Peach/Lemon): **21,90 €**, passt
- 4 Dosen (je 1 Peach/Lemon/Water/Blue): **29,39 €**, Ziel 27,92 €
- 8 Dosen (je 2): **57,37 €**, Ziel 47,92 €

Die bestehenden Rabattstaffeln (3/5/9/10) ergeben 27,92 und 47,92 nicht. Gleicher Dosenpreis wie heute beim 5er/10er wären 6,98 € bzw. 5,99 € je Dose.

## Aktuelle Architektur
- Sets kommen als Einzeldosen mit `_set` in den Warenkorb. Die Preise kommen aus den Shopify-Mengenrabatten (`setMix.ts`, `cartRules.ts`, `CartContext.tsx`).
- Alte Bundle-IDs sind nur noch als Altbestand bekannt: `LEGACY_SETS`, `BUNDLE_VARIANT_BY_NAME`, Online-Store-Permalink. Neben ihnen wird nicht aufgefüllt, und es geht kein Klaviyo-Event raus.
- Gratis-Zugaben und Versandfreiheit hängen an fest verdrahteten Setgrößen 5/10 (`cartRules`). Die Gratis-Versand-Anzeige ist aus, weil Shopify Einzeldosen-Sets nicht kostenlos verschickt. Das Versandprofil „5er & 10er Bundles" gilt nur für echte Bundle-Produkte.
- Auffüll-Karten (`planFillToSet`) zielen auf 3→5→10 mit `FIXED_SET_MIX`.

## Technische Voraussetzungen für den Checkout mit echten Komponentenbundles
1. **Admin:** Drei Bundle-Produkte mit Komponenten (Shopify-Bundles-App), je eine Variante:
   - 3er: Blueberry, Peach, Lemon je 1
   - 4er: je 1 von vier Sorten
   - 8er: je 2 von vier Sorten
   
   Preise 21,90 / 27,92 / 47,92 als Variantenpreis. Alle drei für den Lovable/Headless-Kanal veröffentlichen und für die Storefront sichtbar machen. Der Bundle-Bestand ergibt sich aus den Komponenten, ohne Thai also nicht mehr 0.
2. **Prüfung danach:** Über die Storefront lesbar sein müssen `availableForSale`, `requiresComponents=true` und die `components`. Ein `cartCreate` mit nur der Bundle-Variante muss den Preis exakt liefern, und die Shopify-Antwort muss die Komponentenzeilen enthalten. Der Checkout muss über die normale `checkoutUrl` laufen. Den alten Permalink-Weg brauchen wir nur, falls die Bundles-App das erzwingt.
3. **Rabatt-Konflikt:** Die automatischen Mengenrabatte (3/5/9/10) dürfen Bundle-Positionen nicht zusätzlich rabattieren. Entweder schließt du die Bundle-Produkte in den Rabatten aus, oder die Rabatte bleiben nur für lose Dosen. DROP20 und die anderen Codes kombinierbar lassen.
4. **Versand:** Die neuen Bundles kommen in das gewünschte Versandprofil. Zu klären ist, ob 4er/8er versandfrei sein sollen. Danach `hasCheckoutFreeShipping` nur freischalten, wenn Shopify diese Warenkörbe tatsächlich kostenlos verschickt.
5. **Gratis-Zugaben:** Es braucht eine Regel, welche Bundles Sticker/Stripes bekommen, z. B. 4er und 8er statt 5er und 10er.
6. **Prio-Versand:** Variante 55430739493206 erneut veröffentlichen oder durch eine neue ID ersetzen. Das ist unabhängig von den Bundles, aber nötig, damit die Kasse mit Prio-Versand funktioniert.
7. **IDs:** Gib mir nach dem Anlegen die neuen Varianten-IDs und Handles der Bundles.

## Nötige Code-Umstellung (nach Freigabe, separater Auftrag)
- Neue Bundle-IDs zentral eintragen. Setgrößen 3/4/8 ersetzen 3/5/10 in Setauswahl, Startseitenkarten, Bundleseiten und Warenkorb-Hinweisen.
- Sorten-Picker, freien Modus und `setMode` für die neuen Bundles entfernen. Bestand aus der Bundle-Variante lesen.
- Warenkorb fügt eine Bundle-Zeile hinzu, Preise kommen nur aus Shopify. Auffüll-Karten 3→4→8 entfernen oder neu definieren. Bundle-Komponenten werden nicht aufgeteilt oder gefiltert (`AGENTS.md`-Regel).
- Klaviyo-Event für Bundle-Zeilen erlauben. Den Ausschluss „altes Bundle" anpassen.
- **Bestehende Warenkörbe:**
  - Gespeicherte Einzeldosen-Sets (`_set` 3/5/10) bleiben als lose Dosen gültig und werden nicht umgemischt.
  - Neue Versionsnummer für den gespeicherten Warenkorb, damit alte Set-Kennzeichnungen nicht fälschlich als 4er/8er gelten.
  - Gratis-Zugaben nach den neuen Regeln neu abgleichen.
  - Alte Bundle-IDs wie heute weiter als Altbestand behandeln.
- Tests: Bundle-Add, Preise, Gratis-Zugaben, Migration alter Warenkörbe, Auffüll-Logik, Klaviyo.

## Offene Fragen
- 4er/8er versandfrei und mit Gratis-Zugaben?
- Lose Einzeldosen weiter mit Mengenrabatten verkaufen?
- Sollen 5er/10er komplett verschwinden?
