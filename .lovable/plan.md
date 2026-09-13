# Video erst bei vollständiger Sichtbarkeit abspielen

## Umsetzung
- Die mobile Produktvideo-Kachel beobachtet ihre Sichtbarkeit im Browserfenster.
- Das aktive Video startet erst, wenn seine gesamte Fläche sichtbar ist.
- Sobald ein Teil der Videofläche den Bildschirm verlässt oder zu einer anderen Sorte gewechselt wird, pausiert es.
- Poster, Ladeoptimierung und bestehendes Karussell-Verhalten bleiben unverändert.

## Prüfung
- Mobil prüfen, dass das Video beim Anschnitt noch stillsteht und erst vollständig sichtbar startet.
- Prüfen, dass es beim Weiterscrollen pausiert und kein weißes Flackern entsteht.
