# Schatzinsel v3 – spielbarer Kartentest und PWA

Die v3 baut auf der modularen v2 auf. Alle 600 Aufgaben, drei Altersgruppen und drei Themenwelten bleiben im Hauptspiel unverändert. Die eigentliche Karten-Engine und die Spiellogik wurden nicht geändert.

## v3 aus dem Änderungs-ZIP installieren

Das ZIP **`schatzinsel-v3-aenderungen.zip`** enthält ausschließlich neue und geänderte Dateien. Es ersetzt **nicht** die vollständige v2.

1. Die bisherige v2 entpacken bzw. den bestehenden Projektordner öffnen.
2. Den **Inhalt** des v3-ZIPs direkt in den v2-Projektordner entpacken. Dabei vorhandene Dateien ersetzen.
3. Unveränderte Dateien (insbesondere `res/app.js`, `res/karte*.js` und die drei `res/aufgaben-*.js`) unbedingt behalten.

Die Ordnerstruktur ist weiterhin:

```text
index.html                       Hauptspiel / PWA-Startseite
kartentest.html                  Spielbarer Kartentest
README.md
manifest.webmanifest             PWA-Metadaten
sw.js                           PWA-Offline-Cache
res/
  style.css
  kartentest.css
  app.js                         unverändert aus v2
  pwa.js                         Installation und Offline-Registrierung
  karte.js                       unverändert aus v2
  karte-dschungel.js             unverändert aus v2
  karte-unterwasser.js           unverändert aus v2
  karte-weltraum.js              unverändert aus v2
  kartentest.js                  Spielbarer Test
  aufgaben-dschungel.js          unverändert aus v2
  aufgaben-unterwasser.js        unverändert aus v2
  aufgaben-weltraum.js           unverändert aus v2
  icons/
    icon-192.png
    icon-512.png
    apple-touch-icon.png
```

## Kartentest spielen

`kartentest.html` öffnen, Welt und Altersgruppe auswählen. Die leuchtende Truhe anklicken (oder **Aktuelle Truhe öffnen** wählen). Eine echte Aufgabe wird eingeblendet. **Vorlesen**, **Tipp / Lösung** und **Andere Aufgabe** stehen zur Verfügung. **Geschafft** vergibt einen Stern und schaltet die nächste Truhe frei; Teamaufgaben vergeben zusätzlich einen Teamstern. Nach zwölf Stationen erscheint das Finale und es kann eine neue Runde bzw. die nächste Themenwelt gestartet werden.

Die bisherigen Testwerkzeuge bleiben erhalten: Fortschrittsregler, manuelle Teamsterne, Koordinatenraster, Truhen ein- und ausblenden, Neuzeichnen. Ein Wechsel der Altersgruppe oder Themenwelt startet eine neue Testrunde. **Der Kartentest schreibt keine Spielstände in den Browser-Speicher.**

## PWA starten / installieren

**Wichtig: Eine PWA kann nicht von einer `file://`-Adresse installiert werden.** Stelle den Projektordner über **HTTPS** bereit oder starte lokal im Projektordner einen Server:

```bash
python3 -m http.server 8000
```

Öffne anschließend `http://localhost:8000/index.html`.

- Chrome / Edge / Android: Über das Browser-Menü installieren, oder die Schaltfläche **Schatzinsel installieren** verwenden, sobald der Browser sie anbietet.
- iPhone / iPad (Safari): Über **Teilen → Zum Home-Bildschirm** hinzufügen.
- Nach dem ersten vollständigen Laden installiert der Service Worker einen Cache mit dem Spiel, beiden HTML-Seiten, allen Aufgaben, allen Kartenmodulen, Styles und Icons. Danach können Spiel **und** Kartentest offline geladen werden. Die Registrierung benötigt einen Browser mit Service-Worker-Unterstützung.

Die Spielstände im Hauptspiel werden wie bisher lokal auf dem jeweiligen Gerät und in der jeweiligen Browser-Installation gespeichert. Der Testmodus hat davon getrennte, nur temporäre Daten.
