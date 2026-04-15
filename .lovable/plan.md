

## Plan: Popup-Trigger-Logik umbauen

### Betroffene Dateien

1. **`src/contexts/CartContext.tsx`** — Popup-Koordination via Context erweitern
2. **`src/components/NewsletterPopup.tsx`** — Trigger-Logik ersetzen
3. **`src/components/BundlePopup.tsx`** — Trigger-Logik ersetzen

Kein Design, kein Layout, keine Texte, keine Breakpoints werden verändert.

---

### Schritt 1: CartContext erweitern

Neue Felder im Context für Popup-Koordination:

- `popupOpen: boolean` — ob gerade irgendein Popup offen ist
- `setPopupOpen(v: boolean)` — Setter
- `lastAddedProductId: string | null` — zuletzt hinzugefügtes Produkt (für Bundle-Relevanz)
- `onAddToCart` Callback-Liste oder ein Event-Signal (`addToCartTimestamp: number`), damit BundlePopup auf Add-to-Cart reagieren kann

Konkret: Nach jedem `addToCart`-Aufruf wird `addToCartTimestamp` auf `Date.now()` gesetzt, damit das BundlePopup darauf lauschen kann.

### Schritt 2: NewsletterPopup — neue Trigger

Alte Logik (6s Timer) wird komplett ersetzt:

- **Desktop (Exit Intent):** `mouseleave` auf `document.documentElement` mit `clientY < 0` erkennen. Nur feuern wenn: kein Produkt im Warenkorb, kein anderes Popup offen, nicht bereits dismissed (sessionStorage), Bundle-Popup wurde nicht gerade gezeigt.
- **Mobile (25s ODER 55% Scroll):** Zwei Listener parallel — ein `setTimeout(25000)` und ein `scroll`-Listener der `scrollY / (docHeight - viewportHeight) >= 0.55` prüft. Wer zuerst eintritt, triggert. Gleiche Guards wie Desktop.
- Guard: `items.length === 0` (kein Produkt im Warenkorb)
- Guard: `!popupOpen` (kein anderes Popup offen)
- Guard: `sessionStorage` für "bundle shown" prüfen — wenn Bundle-Popup in dieser Session schon gezeigt wurde, Newsletter nicht direkt danach zeigen (mindestens 10s Abstand oder gar nicht mehr in der Session)
- `useIsMobile()` Hook verwenden um Desktop vs. Mobile zu unterscheiden

### Schritt 3: BundlePopup — neue Trigger

Alte Logik (60s Timer) wird komplett ersetzt:

- Trigger: Reagiert auf `addToCartTimestamp` aus dem CartContext. Wenn sich der Wert ändert und > 0, wird nach 1.5s Delay das Popup gezeigt.
- Guard: Nur zeigen wenn `!popupOpen` (kein anderes Popup offen)
- Guard: Nur zeigen wenn das hinzugefügte Produkt NICHT bereits das Bundle selbst ist (`lastAddedProductId !== "starter-bundle"`)
- Guard: Nur 1x pro Session (sessionStorage)
- Beim Öffnen: `setPopupOpen(true)`, beim Schließen: `setPopupOpen(false)` + sessionStorage Flag für "bundle was shown"

### Schritt 4: Koordination Newsletter ↔ Bundle

Beide Popups setzen `setPopupOpen(true/false)` beim Öffnen/Schließen. Damit blockieren sie sich gegenseitig automatisch. Zusätzlich wird ein sessionStorage-Key `foquz_bundle_popup_shown_at` gesetzt (Timestamp), damit das Newsletter-Popup nicht direkt danach kommt.

---

### Was sich ändert

| Regel | Vorher | Nachher |
|---|---|---|
| Newsletter-Trigger | 6s Timer | Desktop: Exit Intent / Mobile: 25s oder 55% Scroll |
| Newsletter-Guard | Nur sessionStorage | + kein Warenkorb-Inhalt, kein anderes Popup offen |
| Bundle-Trigger | 60s Timer | 1.5s nach Add-to-Cart |
| Bundle-Guard | Nur sessionStorage | + kein anderes Popup offen, nicht das Bundle selbst |
| Koordination | Keine | Gegenseitige Blockierung via `popupOpen` State |

### Was unverändert bleibt

- Komplettes JSX/Design beider Popups
- Texte, Farben, Abstände, Breakpoints
- CartDrawer, Navbar, Hero, ProductGrid, alle anderen Komponenten
- sessionStorage-Keys (bleiben kompatibel)

