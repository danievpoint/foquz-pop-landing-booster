# FOQUZ: bestehende Seite und Redesign

- `main`: bisherige Produktseiten; nur freigegebene Änderungen hier vorbereiten und nach Prüfung in Lovable veröffentlichen.
- `redesign`: neue Peach-Party-Produktseite und laufender Umbau; bis zur Freigabe nicht veröffentlichen.
- `backup-original-before-audit-20260427`: historische Sicherung, nicht für laufende Arbeit verwenden.

Lovable synchronisiert den unter Projekteinstellungen → Git → GitHub ausgewählten Branch. Nach einem Wechsel sowohl den Branch als auch den tatsächlich geladenen Code und die Produktvorschau prüfen. Ein Synchronisierungsstatus allein bestätigt nicht die richtige Vorschau.

Änderungen an `main` regelmäßig per Git-Merge in `redesign` übernehmen und Konflikte prüfen. Zum Abschluss `redesign` nach `main` zusammenführen, testen und erst dann ausdrücklich veröffentlichen. Keine alten Dateikopien über neuere Änderungen schreiben.

Shopify-Daten und andere verbundene Dienste werden durch Branches nicht getrennt. Änderungen dort können unabhängig von einer Website-Veröffentlichung wirksam werden.
