Plan: Technische Fixes und Optimierungen (Locked Production Design)

Projektstatus:

Das aktuelle UI gilt als visuell freigegeben und ist locked production design. Es dürfen ausschließlich technische Fixes und technische Optimierungen umgesetzt werden. Design, Layout, Responsive-Verhalten, Abstände, Größen, Reihenfolge der Sektionen, Branding und allgemeines Erscheinungsbild dürfen nicht verändert werden.

1. .gitignore / Repo-Hygiene

Geplante Änderungen:

- .env, .env.*, .env.local und .env.*.local zu .gitignore hinzufügen

- Sicherstellen, dass diese Dateien künftig nicht mehr versioniert werden

Wichtiger Hinweis:

- .env gehört nicht in ein öffentliches Repository, auch dann nicht, wenn dort ausschließlich publishable Frontend-Werte enthalten sind

- Falls die Datei nur öffentliche/publishable Werte wie VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY enthält, ist das Risiko geringer, aber die Datei soll dennoch aus der Versionskontrolle entfernt werden

- Falls versehentlich mehr als nur öffentliche Frontend-Werte enthalten waren, müssen die betroffenen Keys separat geprüft und gegebenenfalls rotiert werden

2. src/components/ProductGrid.tsx — Video-Logik, Cleanup und Stabilität

Geprüfte Punkte:

- foquzLogo wird importiert, aber nicht verwendet

- slideVariantsInstant und slideVariantsSmooth sind definiert, aber ungenutzt

- DesktopHoverVideo nutzt aktuell DOM-Traversierung über .closest('.group') und registriert Event-Listener indirekt am Parent-Element

- Dieses Pattern ist fragil, da es von einer CSS-Klasse abhängt und unnötig außerhalb des sauberen React-Event-Modells arbeitet

Geplante Änderungen:

- ungenutzten Import entfernen

- ungenutzte Variablen entfernen

- DesktopHoverVideo so umbauen, dass Hover-Verhalten direkt über React-Events auf dem zuständigen Container gesteuert wird

- keine manuellen addEventListener-Aufrufe im ref-Callback

- keine DOM-Traversierung via .closest()

- keine doppelten Listener

- kein Leak-Risiko

- identisches sichtbares Verhalten beibehalten:

  - Desktop: Hover startet das Video zuverlässig

  - Mouseleave pausiert oder setzt es wie bisher zurück

  - kein sichtbarer UI-Unterschied

Mobile / iPhone:

- bestehende Video-Konfiguration prüfen

- controls explizit auf false setzen, sofern noch nicht explizit vorhanden

- playsInline, muted, loop, disablePictureInPicture und controlsList beibehalten, soweit bereits korrekt eingesetzt

- Ziel: bestmögliches Inline-Video ohne Standard-Controls und ohne unnötige native UI, soweit browserseitig möglich

3. src/components/HeroSection.tsx — Preload-Stabilität

Geprüfte Punkte:

- prüfen, ob Hero-Preload mehrfach initialisiert wird

- prüfen, ob die Promise-Logik sauber geteilt wird

- prüfen, ob unnötige Doppel-Ladevorgänge oder instabile Mount-Effekte vorliegen

Aktueller Befund:

- heroImagePromise wird als Modul-Level-Singleton aufgebaut

- useHeroReady verwendet die bestehende Promise-Struktur effizient

Geplante Änderung:

- nur dann Änderungen vornehmen, wenn bei der finalen Prüfung ein echter technischer Fehler oder unnötige Doppel-Initialisierung nachweisbar ist

- andernfalls keine Änderung

4. src/pages/Index.tsx — Loading Gate / Scroll-Lock

Geprüfte Punkte:

- prüfen, ob Scroll-Lock sauber gesetzt und wieder aufgeräumt wird

- prüfen, ob das Loading-Gate unnötige Seiteneffekte erzeugt

- prüfen, ob Cleanup bei Unmount korrekt ist

Aktueller Befund:

- Scroll-Lock/Unlock-Logik wirkt technisch sauber

- Cleanup ist vorhanden

- gewünschter Full-Load-Ansatz bleibt unverändert

Geplante Änderung:

- keine Änderung, sofern die Prüfung keine echte technische Unsauberkeit ergibt

5. src/contexts/CartContext.tsx — Konfetti und Cart-Stabilität

Geprüfte Punkte:

- prüfen, ob Konfetti-Canvas mehrfach erzeugt wird

- prüfen, ob unnötige Mehrfachausführungen möglich sind

- prüfen, ob vermeidbare Re-Renders oder Cleanup-Probleme bestehen

Aktueller Befund:

- Konfetti soll vollständig erhalten bleiben

- Singleton-/Callback-Struktur wirkt grundsätzlich stabil

Geplante Änderung:

- nur dann technische Anpassungen, wenn reale Mehrfachinitialisierungen, Leaks oder unnötige Seiteneffekte gefunden werden

- keine sichtbare Veränderung des Effekts

- kein Abschwächen oder Entfernen des Konfettis

6. vite.config.ts — Produktions-Build

Geprüfte Punkte:

- prüfen, ob bereits manualChunks oder vergleichbares Splitting konfiguriert ist

- vorhandene Produktionsoptimierung kurz dokumentieren

- bewerten, ob weitere Chunk-Aufteilung ohne visuelle oder funktionale Risiken sinnvoll ist

Geplante Änderung:

- falls manualChunks bereits sinnvoll gesetzt sind, keine unnötigen Änderungen

- falls noch offensichtliche, risikoarme Produktionsoptimierungen fehlen, diese ergänzen

- kein Eingriff in Render-Logik, UX-Ablauf oder sichtbares Verhalten

Wichtig:

- wenn keine Änderung nötig ist, kurz benennen, welche Chunks bereits existieren oder warum weitere Eingriffe keinen sinnvollen Nutzen ohne Risiko bringen würden

7. package.json — Dependency-Prüfung

Geprüfte Punkte:

- prüfen, welche Dependencies tatsächlich genutzt werden

- nur sicher ungenutzte Pakete entfernen

- keine spekulativen Bereinigungen

Geplante Änderung:

- nur dann Pakete entfernen, wenn ihre Nichtverwendung eindeutig nachweisbar ist

- im Zweifel keine Entfernung

- kein Risiko für UI, Build oder Laufzeitverhalten eingehen

Zusammenfassung der geplanten Änderungen

Datei: .gitignore

Änderung:

- .env-relevante Einträge ergänzen

Visueller Impact:

- keiner

Datei: src/components/ProductGrid.tsx

Änderung:

- ungenutzten Import entfernen

- ungenutzte Variablen entfernen

- Hover-Video-Logik auf saubere React-Events umstellen

- Mobile-Video-Konfiguration explizit absichern

Visueller Impact:

- keiner, Verhalten bleibt identisch

Datei: src/components/HeroSection.tsx

Änderung:

- nur bei nachweisbarem technischem Problem

Visueller Impact:

- keiner

Datei: src/pages/Index.tsx

Änderung:

- nur bei nachweisbarem technischem Problem

Visueller Impact:

- keiner

Datei: src/contexts/CartContext.tsx

Änderung:

- nur bei nachweisbarem technischem Problem

Visueller Impact:

- keiner, Konfetti bleibt unverändert

Datei: vite.config.ts

Änderung:

- nur falls sichere produktionsseitige Optimierung fehlt

Visueller Impact:

- keiner

Datei: package.json

Änderung:

- nur sicher ungenutzte Dependencies entfernen

Visueller Impact:

- keiner

Bewusst unverändert

- Full-Load-Initialzustand

- Konfetti beim Add-to-Cart

- Produktvideos als Conversion-Element

- Hero-Inszenierung

- visuelles Design

- Layout

- Responsive-Verhalten

- Reihenfolge und Struktur der Seite

- Texte und Branding

Browser-Einschränkungen

- iOS Safari und verwandte Browser können bestimmte native Video-Overlays nicht in jedem Fall zu 100 Prozent unterdrücken

- Die bestmögliche technische Variante ist:

  - playsInline

  - muted

  - loop

  - controls={false}

  - disablePictureInPicture

  - controlsList

- Falls browserseitig Rest-UI erscheint, soll die bestmögliche kompatible Lösung verwendet werden, ohne Designänderung

Arbeitsweise

1. Zuerst kurz bestätigen, welche Dateien tatsächlich geprüft wurden

2. Dann die Änderungen Datei für Datei umsetzen

3. Am Ende kurz zusammenfassen:

- was wirklich geändert wurde

- was geprüft, aber bewusst nicht geändert wurde

- ob irgendeine technische Browser-Grenze besteht

Definition of done

- .env-relevante Dateien sind sauber über .gitignore geschützt

- .env ist nicht mehr Teil der Versionskontrolle

- Produktvideo-Hover-Logik ist React-konform und stabil

- keine unnötigen Event-Listener-Leaks

- Mobile/iPhone-Videoverhalten ist bestmöglich inline und ohne Standard-Controls umgesetzt

- keine sichtbare Änderung an Design, Layout oder Responsive-Verhalten

- vorhandene UX bleibt vollständig erhalten