# Quizmas 🎄

Een Kahoot-stijl quizspel voor gezellige familiebijeenkomsten en feestjes!

## Functies

- **Multiplayer Quiz Spel**: Host toont op TV/groot scherm, spelers doen mee via telefoon/tablet
- **Real-time Sync**: Aangedreven door Firebase Realtime Database
- **Seizoensthema's**: Automatische thema's op basis van kalender (Kerst, Halloween, etc.)
- **Meerdere Vraagtypen**: Quiz, Waar/Niet Waar, Type Antwoord, Slider, Volgorde
- **Auto-Gegenereerde Vragen**: Ingebouwde vragengenerator met 150+ Nederlandse vragen in 14 categorieën
- **Beheerpaneel**: Maak en beheer quizzen, vragen en categorieën
- **Mobile-First Ontwerp**: Mooie, responsive UI voor alle apparaten

## Aan de Slag

### Vereisten

- Een webserver (of gebruik VS Code Live Server extensie)
- Firebase account (al geconfigureerd)

### Lokaal Draaien

1. **Clone de repository**
   ```bash
   git clone <repo-url>
   cd Quizmas
   ```

2. **Start een lokale server**
   
   Met VS Code Live Server:
   - Installeer de "Live Server" extensie
   - Rechts-klik op `index.html` en selecteer "Open with Live Server"
   
   Of met Python:
   ```bash
   python -m http.server 8080
   ```

3. **Open in browser**
   - Ga naar `http://localhost:8080` (of de Live Server URL)

### Een Spel Hosten

1. Open `host.html` in een browser op de TV/hoofdscherm
2. Selecteer een quiz en configureer instellingen
3. Klik "Maak Spel" om een PIN te krijgen
4. Deel de PIN met spelers

### Meedoen met een Spel

1. Open `index.html` op een telefoon/tablet
2. Klik "Meedoen"
3. Voer de PIN en je bijnaam in
4. Kies een avatar en doe mee!

### Beheerpaneel

1. Open `admin.html`
2. Log in met:
   - Email: `admin@quizmas.app`
   - Wachtwoord: `admin123`
3. Maak vragen, quizzen en categorieën

## Projectstructuur

```
Quizmas/
├── index.html          # Speler join pagina
├── host.html           # Host/TV weergave
├── admin.html          # Beheerpaneel
├── css/
│   ├── styles.css      # Hoofdstijlen
│   ├── themes.css      # Seizoensthema's
│   ├── host.css        # Host-specifieke stijlen
│   └── admin.css       # Beheerpaneel stijlen
├── js/
│   ├── firebase-config.js    # Firebase configuratie
│   ├── firebase-service.js   # Firebase API laag
│   ├── theme-manager.js      # Seizoensthema handler
│   ├── game-controller.js    # Kern spellogica
│   ├── host-controller.js    # Host view controller
│   ├── player-controller.js  # Speler view controller
│   ├── admin-controller.js   # Beheerpaneel controller
│   ├── question-generator.js # Auto vragengenerator
│   └── app.js               # Main app entry
└── assets/
    └── sounds/         # Geluidsbestanden
```

## Vraagtypen

| Type | Beschrijving |
|------|-------------|
| 🎯 Quiz | Meerkeuze met 2-4 antwoorden |
| ✓/✗ Waar/Niet Waar | Simpele ja/nee vragen |
| ⌨️ Type Antwoord | Vrij tekstveld |
| 🎚️ Slider | Schat een getal |
| ↕️ Volgorde | Zet items in juiste volgorde |

## Seizoensthema's

De app past automatisch thema's toe op basis van de datum:

| Thema | Datums |
|-------|--------|
| 🎄 Kerst | Dec 20-26 |
| 🎆 Nieuwjaar | Dec 27 - Jan 5 |
| 💕 Valentijn | Feb 10-14 |
| 🐰 Pasen | Variabel |
| 🎃 Halloween | Okt 25-31 |
| ☀️ Zomer | Jun 21 - Aug 31 |

## Vraagcategorieën

- 🎯 Algemene Kennis
- 🇳🇱 Nederland
- 📜 Geschiedenis
- 🌍 Aardrijkskunde
- 🔬 Wetenschap
- ⚽ Sport
- 🎵 Muziek
- 🎬 Films & TV
- 📚 Literatuur
- 🎨 Kunst
- 🍕 Eten & Drinken
- 🦁 Natuur & Dieren
- 💻 Technologie
- 🎄 Kerst Speciaal

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Styling**: Custom CSS met CSS Variables
- **Backend**: Firebase (Realtime Database + Firestore)
- **Fonts**: Google Fonts (Fredoka One, Nunito)

## Browser Ondersteuning

- Chrome (aanbevolen)
- Firefox
- Safari
- Edge

---

🎄 **Veel Quiz Plezier!** 🎄
