## Ziel

`https://www.foquz.de/discount/:code` muss **selbst** mit HTTP 301/302 antworten. Lovable-Hosting kann das nicht (Static + SPA-Fallback → immer 200). Also muss vor oder statt Lovable eine Instanz stehen, die auf diesem Pfad einen echten Redirect ausliefert.

Keine DNS-Änderung in diesem Schritt – hier nur die Optionen und ihre Konsequenzen.

---

## Option A (empfohlen): Netlify oder Vercel als Host für www.foquz.de

Das bestehende Vite-Projekt wird zusätzlich auf Netlify/Vercel deployed. Dort existiert eine echte Server-Redirect-Regel für exakt `/discount/*`, alles andere geht unverändert an die SPA.

**Netlify – `public/_redirects` (oder `netlify.toml`)**
```text
/discount/*  https://<edge-function-host>/discount-redirect/:splat  302
/*           /index.html  200
```

**Vercel – `vercel.json`**
```json
{
  "redirects": [
    { "source": "/discount/:code", "destination": "https://<edge-function-host>/discount-redirect/:code", "statusCode": 302 }
  ],
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Alternativ ohne Supabase-Hop: eine native Serverless-Route (`api/discount/[code].ts` bzw. Netlify Function), die dieselbe Logik wie `supabase/functions/discount-redirect/index.ts` enthält und direkt 302 auf `https://www.foquz.de/?discount=CODE&dt_id=...` setzt. Weniger Latenz, ein Hop weniger, aber Logik dann an zwei Stellen.

### Was sich ändert
- **Repo**: `netlify.toml` bzw. `vercel.json` (+ optional Serverless-Route). Kein Anwendungscode.
- **Build**: identisch (`npm run build`, Output `dist`).
- **Env-Variablen**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` müssen im Netlify/Vercel-Dashboard gesetzt werden (Build-Zeit-Variablen, sie landen ohnehin im Client-Bundle – keine Secrets).
- **Backend**: bleibt vollständig bei Lovable Cloud. Edge Functions, DB, Auth, Shopify-Funktionen unverändert. CORS ist bereits `*`.
- **Lovable-Publishing**: Der Lovable-Publish-Flow bleibt bestehen, `*.lovable.app` läuft weiter. Aber `www.foquz.de` zeigt dann **nicht mehr** auf Lovable. Änderungen im Editor gehen nicht mehr automatisch live – es braucht einen Deploy-Pfad (GitHub-Verbindung → Netlify/Vercel baut bei Push). Das ist die zentrale Konsequenz dieser Option.
- **DNS bei one.com** (später auszuführen):
  - `A @` und `A www` (aktuell `185.158.133.1`) werden ersetzt: Vercel → `A @ 76.76.21.21` + `CNAME www cname.vercel-dns.com`; Netlify → `CNAME www <site>.netlify.app` + ALIAS/A für Apex laut Netlify.
  - Der TXT-Record `_lovable` kann bleiben (schadet nicht, hält die Domain für Lovable verifiziert).
- **E-Mail**: MX, SPF, DKIM, DMARC sind **eigene Record-Typen** und von A/CNAME-Änderungen nicht betroffen – solange die Nameserver bei one.com bleiben. Nichts anfassen. Nur ein Wechsel der Nameserver würde Mail brechen; den machen wir nicht.
- **SSL**: Netlify/Vercel stellen Let's-Encrypt-Zertifikate automatisch aus, sobald DNS zeigt. Kurzes Fenster (Minuten) zwischen DNS-Umstellung und Zertifikat. Falls CAA-Records existieren: Let's Encrypt muss erlaubt sein.
- **Risiko**: mittel. Rückweg = A-Records zurück auf `185.158.133.1`.

---

## Option B: Reverse Proxy vor Lovable

Cloudflare (oder ein anderer Proxy) steht vor Lovable, eine Redirect Rule fängt `/discount/*` ab, alles andere wird durchgereicht.

### Variante B1 – Cloudflare mit Nameserver-Wechsel
Erfordert genau das, was du vermeiden willst: NS von one.com auf Cloudflare. Dabei müssen **alle** bestehenden Records (inkl. MX, SPF, DKIM, DMARC, Autodiscover von one.com) vorher exportiert und in Cloudflare nachgebaut werden, sonst fällt E-Mail aus. Cloudflares Scanner findet meist 90 %, nicht 100 %.

### Variante B2 – Cloudflare nur für www per CNAME (ohne NS-Wechsel)
Cloudflare CNAME Setup (Partial/CNAME Setup) ist Enterprise-only. Für Business-Pläne nicht verfügbar. → praktisch ausgeschlossen.

### Variante B3 – kleiner eigener Proxy (Fly.io / Cloudflare Worker auf Worker-Domain)
Löst das Problem nicht: Shopify prüft `www.foquz.de`, und ohne Kontrolle über das Routing dieser Hostnames landet der Request weiter bei Lovable.

**Fazit B**: nur B1 funktioniert, und die kostet den NS-Wechsel inkl. E-Mail-Risiko. Höheres Risiko als Option A.

---

## Option C: Shopify-native Collabs-Links (kein Infrastruktur-Umbau)

Collabs kann statt der Custom-Domain die Shop-Domain für Discount-Links nutzen (`<shop>.myshopify.com/discount/:code?redirect=...`). Das setzt das Rabatt-Cookie direkt in der Checkout-Domain – technisch sogar zuverlässiger als der Umweg über die Storefront. Nachteil: die Links tragen nicht den foquz.de-Markennamen, und laut deiner Rückmeldung besteht Collabs auf `www.foquz.de`. Als Fallback halten, falls A und B abgelehnt werden.

---

## Empfehlung

**Option A mit Netlify** (einfachstes Redirect-Handling, `_redirects`-Datei im Repo, kein Nameserver-Wechsel, E-Mail bleibt bei one.com unberührt).

## Reihenfolge der Umsetzung (nichts davon jetzt ausgeführt)

1. GitHub-Verbindung des Lovable-Projekts prüfen/aktivieren.
2. `netlify.toml` mit der `/discount/*`-Regel ins Repo legen.
3. Netlify-Site anlegen, Env-Variablen setzen, Deploy auf `<site>.netlify.app` verifizieren.
4. Test gegen die Netlify-URL: `curl -I https://<site>.netlify.app/discount/test-discount?redirect=/&dt_id=0` → erwartet 302 + Location.
5. Erst dann DNS bei one.com umstellen (nur A/CNAME für `@` und `www`; MX/SPF/DKIM/DMARC unangetastet).
6. SSL-Ausstellung abwarten, erneut curl-Test gegen `www.foquz.de`.
7. Collabs-Domain-Verifizierung auslösen.

## Technische Details

- Die bestehende Edge Function `supabase/functions/discount-redirect/index.ts` bleibt unverändert nutzbar und liefert bereits korrekt 302 mit `Cache-Control: no-store`.
- Der Redirect hängt `discount=CODE` an die Ziel-URL; `captureAttributionFromSearch()` in `src/lib/attribution.ts` liest ihn aus und `cartDiscountCodesUpdate` wendet ihn auf den Cart an. Diese Kette ist bereits getestet und wird durch den Hosting-Wechsel nicht berührt.
- `redirect`-Parameter wird serverseitig auf interne Hosts begrenzt – keine offenen Weiterleitungen.
- Shopify-Pageview-Events (`src/lib/shopifyAnalytics.ts`, Monorail) laufen clientseitig und sind hostingunabhängig.
