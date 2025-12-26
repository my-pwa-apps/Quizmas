# Quizmas - AI Agent Instructions

## Project Overview
Quizmas is a Dutch Kahoot-style multiplayer quiz game with separate views for host (TV), player (mobile), and admin. Built with vanilla JavaScript ES6 modules and Firebase backend.

## Architecture

### Three Entry Points
- `index.html` → Player join/game view → `js/app.js` → `PlayerController`
- `host.html` → TV/Host display → `js/host-controller.js` → `HostController`
- `admin.html` → Quiz management → `js/admin-controller.js` → `AdminController`

### Data Flow
```
Firebase Realtime DB (games, live state) ←→ GameController ←→ Host/Player Controllers
Firebase Firestore (questions, quizzes)  ←→ FirebaseService ←→ AdminController
```

### Key Files
- `js/firebase-service.js` - All Firebase CRUD operations (singleton export)
- `js/game-controller.js` - Core game logic, timer, scoring (shared by host/player)
- `js/question-generator.js` - 150+ Dutch questions with 5 question types

## Question Types
All questions must include `questionType` field:
```javascript
{ questionType: "quiz",      answers: [...], correctIndex: 0 }           // Multiple choice
{ questionType: "truefalse", correctAnswer: true }                       // Boolean
{ questionType: "type",      correctAnswer: "Amsterdam" }                // Free text
{ questionType: "slider",    correctAnswer: 50, sliderMin: 0, sliderMax: 100, tolerance: 5 }
{ questionType: "order",     orderItems: ["First", "Second", "Third"] }  // Correct order
```

## Code Conventions

### Language
- All UI text in **Dutch** (Netherlands audience)
- Comments in English or Dutch are both acceptable
- Category IDs in English (`general`, `nederland`), display names in Dutch

### CSS Patterns
- Use CSS Variables from `:root` in `styles.css` (e.g., `var(--primary)`, `var(--surface)`)
- Answer colors: `--answer-red`, `--answer-blue`, `--answer-yellow`, `--answer-green`
- No inline styles in HTML - use CSS classes instead
- Add `-webkit-` prefixes for Safari (e.g., `-webkit-user-select`)

### JavaScript Patterns
- ES6 modules with explicit imports from Firebase CDN
- Classes exported as singletons: `export default new ClassName()`
- Screen switching via `.screen.active` class toggle
- Event system: `controller.on('event', callback)` pattern in GameController

### Accessibility
- All form elements need `title` or `for`/`id` label connections
- Use semantic HTML where possible

## Firebase Structure

### Realtime Database (`games/{pin}`)
```javascript
{
  hostId, quizId, status, // 'lobby' | 'playing' | 'finished'
  players: { [id]: { name, avatar, score, streak } },
  answers: { [questionIndex]: { [playerId]: { answer, timeRemaining } } }
}
```

### Firestore Collections
- `questions` - Question bank
- `quizzes` - Quiz definitions with question references
- `categories` - Category metadata

## Running Locally
```bash
# Use VS Code Live Server extension, or:
python -m http.server 8080
```

## Adding New Questions
Add to `js/question-generator.js` in the appropriate category method (e.g., `getNederlandVragen()`). Include `difficulty: "easy" | "medium" | "hard"`.

## Testing Changes
1. Open `index.html` in one browser (player)
2. Open `host.html` in another (host/TV)
3. Create game → share PIN → test full flow
