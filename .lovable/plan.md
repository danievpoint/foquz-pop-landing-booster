# Gezielte Warenkorbkorrekturen

- Set-Upsells ersetzen bezahlte Dosen und vorhandene Sets in einem Schritt. Normale Käufe bleiben additiv.
- Eine gemeinsame Vollständigkeitsprüfung steuert Set-Upgrades, Gratisversand und Zugaben; alte Bundle-Positionen bleiben kompatibel.
- Warenkorb validiert und versioniert über Reload speichern. Abgebrochene oder nur abgelaufene Kassen dürfen ihn nicht löschen.
- Preise und Kassenlinks strikt an aktuelle Positionen und Rabattcode binden; während Neuberechnung keine alten Shopify-Summen anzeigen.
- Set-Dosen anhand ihrer Sorte verlinken. Thai Style auf der Startseite neutral zu Details verlinken, auf Produktseiten weiter einzeln gesperrt.
- Regressionstests für Upgrade, Vollständigkeit, Reload und verzögerte Preisantworten sowie Desktop-/Mobilprüfung durchführen.

## Grenzen
Keine Veröffentlichung, Shopify-Konfiguration oder Rabattdarstellungsänderung. Produktdetail-Vorauswahl, Bilder/Galerie, Mischungen, Stock-Fallbacks und Bundle-Beschreibungen bleiben unverändert. Ein tatsächlich abgeschlossener Kauf wird nicht durch eine echte Bestellung getestet; fehlende sichere Abschlussnachweise werden ausdrücklich benannt.

## Technische Umsetzung
Gemeinsame reine Warenkorbregeln und Speicher-Validierung neben dem bestehenden CartContext. Asynchrone Ergebnisse erhalten einen Cart-/Code-Schlüssel; ältere Antworten dürfen weder Summen noch Links oder Codes überschreiben. Build und Typecheck übernimmt die Projektprüfung; relevante Tests werden separat ausgeführt.