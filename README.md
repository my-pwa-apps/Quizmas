# Quizmas 🎄

A Kahoot-style quiz game built for fun gatherings, parties, and educational events!

## Features

- **Multi-player Quiz Game**: Host displays on TV/large screen, players join via phone/tablet
- **Real-time Sync**: Powered by Firebase Realtime Database
- **Seasonal Themes**: Automatic theming based on calendar (Christmas, Halloween, etc.)
- **Multiple Question Types**: Text, images, videos, and audio
- **Auto-Generated Questions**: Built-in question generator with 150+ questions across 13 categories
- **Admin Panel**: Create and manage quizzes, questions, and categories
- **Mobile-First Design**: Beautiful, responsive UI for all devices

## Getting Started

### Prerequisites

- A web server (or use VS Code Live Server extension)
- Firebase account (already configured)

### Running Locally

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Quizmas
   ```

2. **Start a local server**
   
   Using VS Code Live Server:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"
   
   Or using Python:
   ```bash
   python -m http.server 8080
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8080` (or the Live Server URL)

### Hosting a Game

1. Open `host.html` in a browser on the TV/main display
2. Select a quiz and configure settings
3. Click "Create Game" to get a PIN
4. Share the PIN with players

### Joining a Game

1. Open `index.html` on a phone/tablet
2. Click "Join Game"
3. Enter the PIN and your nickname
4. Choose an avatar and join!

### Admin Panel

1. Open `admin.html`
2. Login with:
   - Email: `admin@quizmas.app`
   - Password: `admin123`
3. Create questions, quizzes, and categories

## Project Structure

```
Quizmas/
├── index.html          # Player join page
├── host.html           # Host/TV display
├── admin.html          # Admin panel
├── css/
│   ├── styles.css      # Main styles
│   ├── themes.css      # Seasonal themes
│   ├── host.css        # Host-specific styles
│   └── admin.css       # Admin panel styles
├── js/
│   ├── firebase-config.js    # Firebase configuration
│   ├── firebase-service.js   # Firebase API layer
│   ├── theme-manager.js      # Seasonal theme handler
│   ├── game-controller.js    # Core game logic
│   ├── host-controller.js    # Host view controller
│   ├── player-controller.js  # Player view controller
│   ├── admin-controller.js   # Admin panel controller
│   ├── question-generator.js # Auto question generator
│   └── app.js               # Main app entry
└── assets/
    ├── sounds/         # Audio files
    └── README.md       # Asset documentation
```

## Seasonal Themes

The app automatically applies themes based on the current date:

| Theme | Dates |
|-------|-------|
| 🎄 Christmas | Dec 20-26 |
| 🎆 New Year | Dec 27 - Jan 5 |
| 💕 Valentine's | Feb 10-14 |
| ☘️ St. Patrick's | Mar 14-17 |
| 🐰 Easter | Variable |
| 🎃 Halloween | Oct 25-31 |
| 🦃 Thanksgiving | Nov 20-28 |
| ☀️ Summer | Jun 21 - Aug 31 |

## Question Categories

- 🎯 General Knowledge
- 📜 History
- 🌍 Geography
- 🔬 Science
- ⚽ Sports
- 🎵 Music
- 🎬 Movies & TV
- 📚 Literature
- 🎨 Art
- 🍕 Food & Drink
- 🦁 Nature & Animals
- 💻 Technology
- 🎄 Christmas Special

## Firebase Setup

The app uses Firebase for:
- **Realtime Database**: Game state, players, answers
- **Firestore**: Questions, quizzes, categories
- **Authentication**: Anonymous players, admin login

Firebase is pre-configured. If you need to use your own Firebase project:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Realtime Database and Firestore
3. Update the config in `js/firebase-config.js`
4. Set up security rules (see below)

### Security Rules

**Realtime Database Rules:**
```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

**Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Note**: These are development rules. For production, implement proper authentication rules.

## Customization

### Adding New Questions

1. Go to Admin Panel → Questions
2. Click "New Question"
3. Fill in the question details
4. Add answers and mark the correct one
5. Save

### Creating Quizzes

1. Go to Admin Panel → Quizzes
2. Click "New Quiz"
3. Name your quiz
4. Select questions to include
5. Save

### Adding Sound Effects

Place MP3 files in `assets/sounds/`:
- `correct.mp3` - Correct answer sound
- `wrong.mp3` - Wrong answer sound
- `countdown.mp3` - Timer countdown
- `winner.mp3` - Victory celebration

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Styling**: Custom CSS with CSS Variables
- **Backend**: Firebase (Realtime Database + Firestore)
- **Fonts**: Google Fonts (Fredoka One, Nunito)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- Inspired by Kahoot!
- Built with ❤️ for family game nights
- Emoji graphics from Unicode standard

---

🎄 **Happy Quizzing!** 🎄
