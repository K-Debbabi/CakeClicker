# 🍰 Kuchen Clicker

**WMC-Schulprojekt | Klasse 2AHIF**

Ein vollständiges Clicker-Spiel im Stil von Cookie Clicker – nur mit Kuchen-Thema. Entwickelt mit reinem HTML, CSS und Vanilla JavaScript, ohne externe Frameworks oder Build-Tools.

---

## Spielbeschreibung

In Kuchen Clicker baust du dein Backimperium von einem einfachen Hausbackofen bis hin zur magischen Kuchenmaschine aus. Klicke auf den Kuchen, um Kuchen zu backen – kaufe Gebäude für passives Einkommen und Upgrades um deine Produktion zu vervielfachen.

---

## Starten

Einfach `index.html` im Browser öffnen. Kein Server, kein Build-Tool notwendig.

> ⚠️ Für Google Fonts (Nunito) wird eine Internetverbindung benötigt. Das Spiel funktioniert auch offline – dann wird die System-Schriftart verwendet.

---

## Spielmechaniken

### Kuchen-Klicken
Jeder Klick auf den Kuchen produziert `cookiesPerClick` Kuchen. Dieser Wert startet bei 1 und kann durch Upgrades multipliziert werden.

### Gebäude (passives Einkommen)

| Gebäude | Basis-CPS | Basispreis |
|---|---|---|
| 🔥 Hausbackofen | 0,1 / s | 15 |
| 🏠 Kleine Bäckerei | 0,5 / s | 100 |
| 🎂 Konditorei | 4 / s | 500 |
| 🏭 Kuchenfabrik | 20 / s | 3.000 |
| ✨ Magische Kuchenmaschine | 100 / s | 20.000 |
| 🌀 Kuchenportal | 400 / s | 100.000 |
| ⏳ Zeitbäckerei | 1.600 / s | 500.000 |

Der Preis jedes Gebäudes steigt mit jedem Kauf um Faktor 1,15 (Cookie-Clicker-Formel).

### Upgrades (18 gesamt)

Upgrades verbessern entweder:
- **Klick-Stärke** (z. B. „Bessere Butter": ×2)
- **Einzelne Gebäude** (z. B. „Backschule": Hausbackofen ×2)
- **Alle Gebäude** (z. B. „Geheimrezept": alle ×1,5)

Upgrades werden sichtbar sobald ihre Bedingung erfüllt ist (z. B. erstes Gebäude gekauft, bestimmte Gesamt-Kuchen-Zahl erreicht).

### Achievements (15 gesamt)

| Achievement | Bedingung |
|---|---|
| 👆 Erster Bissen | 1 Klick |
| 💪 Fleißiger Bäcker | 100 Klicks |
| 🖱️ Klick-Profi | 1.000 Klicks |
| 🏗️ Erstes Gebäude | 1 Gebäude gekauft |
| 🏠 Bäckerei-Besitzer | 5 Gebäude besitzen |
| 🏙️ Großbetrieb | 25 Gebäude besitzen |
| 🍰 1.000 Kuchen | 1.000 Kuchen gebacken |
| 🎂 10.000 Kuchen | 10.000 Kuchen gebacken |
| 💰 Kuchenmillionär | 1.000.000 Kuchen gebacken |
| 👑 Kuchenmilliardär | 1.000.000.000 Kuchen gebacken |
| ⬆️ Upgrade-Enthusiast | 1. Upgrade gekauft |
| 🌟 Upgrade-Sammler | 5 Upgrades gekauft |
| ⚡ Fleißige Produktion | 10 Kuchen/s |
| 🚀 Kuchenmaschinerie | 100 Kuchen/s |
| 🎓 Konditor-Meister | Konditorei besitzen |

### Speichern & Laden
- **Auto-Save** alle 30 Sekunden in `localStorage`
- **Manuelles Speichern** über den Speichern-Button
- **Offline-Progress**: Beim nächsten Spielstart werden Kuchen nachberechnet (max. 8 Stunden)
- **Reset**: Bestätigungsdialog vor dem Löschen

---

## Dateistruktur

```
kuchen-clicker/
├── index.html              # HTML-Struktur (3-spaltig)
├── css/
│   ├── main.css            # Layout, Farben, Statistiken, Buttons
│   ├── shop.css            # Shop-Karten, Tab-Navigation
│   └── animations.css      # Alle CSS-Animationen
├── js/
│   ├── game.js             # Spiellogik, CONFIG, gameState, Tick
│   ├── shop.js             # Shop rendern, Käufe verarbeiten
│   ├── upgrades.js         # Upgrade-Definitionen (Array)
│   ├── save.js             # localStorage speichern/laden
│   └── ui.js               # DOM-Updates, Animationen, Events
├── assets/
│   ├── images/             # (leer – Emojis werden direkt verwendet)
│   └── sounds/             # (leer – Erweiterungspotenzial)
└── README.md
```

---

## Technische Umsetzung

### Architektur
Das Spiel verwendet das **Module-Pattern** (IIFE: Immediately Invoked Function Expression): Jede JS-Datei exportiert ein Objekt (`Game`, `Shop`, `Save`, `UI`) mit klar definierten öffentlichen Methoden. Der gesamte veränderliche Zustand liegt im zentralen `gameState`-Objekt.

### Ladereihenfolge (wichtig)
```
game.js → upgrades.js → save.js → shop.js → ui.js
```
`game.js` muss zuerst geladen werden (definiert `CONFIG`, `BUILDINGS`, `gameState`).
`ui.js` muss zuletzt geladen werden (startet das Spiel über `DOMContentLoaded`).

### Tick-System
Alle 100ms (`CONFIG.TICK_INTERVAL_MS`) wird `Game._tick()` aufgerufen:
- Passives Einkommen: `cookiesPerSecond × 0.1` Kuchen
- Achievement-Check
- UI-Update (Stats immer, Shop alle 5 Ticks)

### Preis-Formel
```
aktuellerPreis = basisPreis × 1.15 ^ anzahlGekauft
```

### Offline-Progress-Formel
```
offlineKuchen = min(abwesenheitSekunden, 28800) × cookiesPerSecond
```

---

## Design

- **Farbpalette**: Creme (`#FFF8F0`), Rosa (`#F9A8D4`), Braun (`#92400E`), Gold (`#F59E0B`)
- **Schrift**: Google Fonts „Nunito" (400, 600, 700, 800, 900)
- **Layout**: CSS Grid (3 Spalten auf Desktop, 2 Spalten auf Tablet ≤900px, 1 Spalte auf Mobil ≤600px)
- **Animationen**: Alle in `animations.css` – Kuchen-Wackeln, Float-Zahlen, Partikel, Achievement-Toast, Milestone-Puls

---

## Erweiterungspotenzial

Für die Weiterentwicklung (z. B. für weitere Projekte oder die Projektdokumentation) wären folgende Features interessant:

- **Prestige-System**: Nach 1 Trillion Kuchen kann man neu starten und erhält permanente Boni
- **Goldene Kuchen**: Zufällig erscheinende Sonder-Kuchen mit temporären Boni (×7 Produktion für 77 Sekunden)
- **Saisonale Events**: Weihnachts-Kuchen, Geburtstags-Torte etc.
- **Sound-Effekte**: Web Audio API für Klick-Sounds und Achievement-Fanfare
- **Statistik-Seite**: Detaillierte Auswertung aller Kennzahlen
- **Tooltips**: Erweiterte Informationen über vergangene Produktionszahlen
- **Cloud-Save**: Spielstand per QR-Code exportieren/importieren
- **Mehrsprachigkeit**: i18n-System für weitere Sprachen

---

## Verwendete Technologien

| Technologie | Verwendung |
|---|---|
| HTML5 | Struktur, semantische Tags, `<dialog>` |
| CSS3 | Grid, Custom Properties, Animationen, `@keyframes` |
| Vanilla JavaScript (ES6+) | Spiellogik, DOM-Manipulation, localStorage |
| Google Fonts CDN | Nunito-Schriftart |

Keine externen JavaScript-Libraries, kein Framework, kein Build-Tool.

---

*Erstellt als WMC-Schulprojekt, Klasse 2AHIF*
