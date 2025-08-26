# Copilot Instructions für Lieferando-Clone MPA

## Projekt-Konventionen

- **Pseudo-MPA mit includeHTML.js**: Eine zentrale index.html mit dynamischem Content-Loading über Templates
- Navigation über Hash-URLs (#home, #menu, #basket, #order)
- Für DOM-Zugriffe in allen JavaScript-Dateien immer `getElementById` verwenden. Kein `querySelector` oder `getElementsByClassName`.
- Für Styling in CSS immer Klassen (`.css`) mit Bindestrich verwenden (z.B. `.menu-item`).
- Für JavaScript-Selektoren immer IDs (`id="..."`) im HTML verwenden, im Kamelcase-Stil (z.B. `menuContainer`).
- IDs sind ausschließlich für JavaScript-Zugriffe reserviert.
- Klassen sind ausschließlich für CSS-Styles reserviert.
- Immer `const` und `let` verwenden, niemals `var`.

## Projekt-Struktur

```
/
├── index.html              # Zentrale HTML-Datei mit Content-Container
├── assets/
│   ├── images/            # Restaurant- und Gericht-Bilder
│   └── icons/             # Icons für UI
├── styles/
│   ├── global.css         # Globale Styles und CSS-Variablen
│   ├── layout.css         # Allgemeine Layout-Strukturen
│   ├── components/        # Modulare Komponenten-Styles
│   │   ├── header.css     # Header-spezifische Styles
│   │   ├── footer.css     # Footer-spezifische Styles
│   │   ├── buttons.css    # Button-Komponenten
│   │   ├── cards.css      # Card-Komponenten
│   │   └── forms.css      # Formular-Komponenten
│   └── pages/             # Seiten-spezifische Styles
│       ├── home.css       # Startseite-spezifische Styles
│       ├── menu.css       # Speisekarte-spezifische Styles
│       ├── basket.css     # Warenkorb-spezifische Styles
│       └── order.css      # Bestellbestätigung-spezifische Styles
├── scripts/
│   ├── includeHTML.js    # Template-Loading System
│   ├── navigation.js     # Button-basierte Navigation
│   ├── storage.js        # LocalStorage-Verwaltung
│   ├── cart.js           # Warenkorb-Logik
│   ├── utils.js          # Hilfsfunktionen
│   ├── home.js           # Startseite-spezifische Logik
│   ├── menu.js           # Speisekarte-spezifische Logik
│   ├── basket.js         # Warenkorb-spezifische Logik
│   └── order.js          # Bestellbestätigung-spezifische Logik
└── templates/
    ├── header.html       # Header-Template
    ├── footer.html       # Footer-Template
    ├── home-content.html # Startseite-Content
    ├── menu-content.html # Speisekarte-Content
    ├── basket-content.html # Warenkorb-Content
    └── order-content.html # Bestellbestätigung-Content
```

## includeHTML.js System

- **Template-Loading**: HTML-Templates werden dynamisch über `includeHTML()` geladen
- **Button-Navigation**: Einfache Button/Link-basierte Navigation ohne URL-Änderung
- **Content-Container**: Zentraler `<div id="content">` für dynamische Inhalte
- **Shared Components**: Header und Footer werden einmalig geladen
- **Page-specific Scripts**: Verschiedene JS-Module für verschiedene "Seiten"

## Lieferando-Features

- **Restaurant-Auswahl**: Keine
<!-- - **Speisekarte**: Kategorisierte Gerichte (Pizza, Pasta, Salate, Desserts) -->
- **Warenkorb**: Hinzufügen, Entfernen, Menge ändern
- **Bestellprozess**: Bestellbestätigung
- **Persistierung**: LocalStorage für Warenkorb zwischen Seitenaufrufen

## JavaScript-Funktionsrichtlinien

- Jede Funktion darf maximal 14 Zeilen lang sein.
- Jede Funktion soll nur eine einzige, klar definierte Aufgabe erfüllen.
- Komplexe Funktionen in kleinere Hilfsfunktionen aufteilen.
- Keine verschachtelten Funktionen verwenden.
- Bei Überschreitung der Zeilenbegrenzung: Funktion in mehrere spezialisierte Funktionen aufteilen.
- Arrow Functions bevorzugen, außer bei Konstruktoren oder Event Handlers die `this` benötigen.

## JSDoc-Anforderungen

- Alle JavaScript-Funktionen müssen JSDoc-Kommentare auf Deutsch haben.
- JSDoc-Format verwenden: `/** */`
- Kurze, prägnante Beschreibung der Funktionsaufgabe.
- Parameter mit `@param {type} name - Beschreibung` dokumentieren.
- Rückgabewerte mit `@returns {type} Beschreibung` dokumentieren.
- Deutsche Beschreibungen und Parameter-Erklärungen verwenden.
- Bei async Funktionen: `@async` verwenden.

## State Management Pattern

- LocalStorage für Warenkorb-Persistierung zwischen Seitenaufrufen nutzen.
- Einheitliche Datenstruktur für Warenkorb-Items.
- Shared JavaScript-Module für gemeinsame Funktionalitäten.
- Button-basierte Navigation für Seitenwechsel.

## Error Handling

- Try-catch Blöcke für potentiell fehlerhafte Operationen verwenden.
- Aussagekräftige Fehlermeldungen in deutscher Sprache.
- Console.error für Debugging-Informationen nutzen.

## Weitere Best Practices

- Keine Inline-Styles oder Inline-Eventhandler im HTML.
- Keine Magic Numbers oder Strings – stattdessen Konstanten verwenden.
- **ECMAScript Modules**: Ausschließlich moderne ES6+ Module verwenden (`import`/`export`). Keine CommonJS (`require`/`module.exports`). Target: `module: "es2020"`.
- **CSS Custom Properties (Variablen)**: Alle Farben über CSS-Variablen im :root definieren. Keine Hex-Codes direkt im CSS verwenden.
- **Relative Einheiten**: Immer `rem` für Größen, Abstände und Schriftgrößen verwenden. Keine `px` außer bei Borders (1px), box-shadow und @media. Auf zwei Dezimalstellen runden.
- Konsistente Farbpalette: Haupt-, Sekundär-, Akzent- und Neutralfarben definieren.
- Komponenten und Funktionen klar benennen.
- Keine doppelten IDs oder Klassennamen.
- **Mobile First Design**: Styles zuerst für mobile Geräte entwickeln, dann mit Media Queries für größere Bildschirme erweitern.
- Responsive Design mit CSS sicherstellen - Breakpoints: 768px (Tablet), 1024px (Desktop), 1200px (Large Desktop).
- Touch-freundliche Buttons und Interaktionselemente (min. 2.75rem Höhe).
- Accessibility (a11y) beachten: Semantisches HTML, ARIA-Attribute wo nötig.
- Konsistente Code-Formatierung (z.B. Prettier, EditorConfig).
- Keine externen Frameworks oder Libraries verwenden.
- **Navigation**: Button-basierte Navigation mit `loadPage()` Funktionen statt Hash-URLs.

## Modulare CSS-Architektur

- **Komponenten-basierte Styles**: Jede UI-Komponente hat eigene CSS-Datei
- **BEM-ähnliche Namenskonvention**: `.header`, `.header__logo`, `.header__nav`
- **CSS Custom Properties**: Zentrale Design-Tokens in global.css
- **Import-Reihenfolge**: global.css → layout.css → components → pages
- **Keine CSS-Duplikation**: Gemeinsame Styles in globalen Dateien
- **Responsive Breakpoints**: Konsistent in allen Komponenten verwenden
