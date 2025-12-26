// ==========================================
// QUIZMAS - Player Controller
// Controls the player view (phone/tablet)
// ==========================================

import gameController from './game-controller.js';
import themeManager from './theme-manager.js';

class PlayerController {
    constructor() {
        this.currentScreen = 'main-menu';
        this.selectedAvatar = '😊';
        this.hasAnswered = false;
        this.sounds = {};
    }

    init() {
        // Initialize theme
        themeManager.init();

        // Load sounds
        this.initSounds();

        // Populate avatars
        this.populateAvatars();

        // Set up event listeners
        this.setupEventListeners();

        // Subscribe to game events
        this.setupGameEvents();

        console.log('Player controller initialized');
    }

    initSounds() {
        this.sounds = {
            correct: document.getElementById('sound-correct'),
            wrong: document.getElementById('sound-wrong'),
            tick: document.getElementById('sound-tick'),
            countdown: document.getElementById('sound-countdown'),
            winner: document.getElementById('sound-winner')
        };
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }

    populateAvatars() {
        const avatars = [
            '😊', '😎', '🤓', '😜', '🥳', '😇',
            '🦊', '🐱', '🐶', '🐼', '🦁', '🐨',
            '🎅', '🤶', '⛄', '🦌', '🎄', '🎁',
            '🦸', '🧙', '👸', '🤴', '🧛', '🤖'
        ];

        const grid = document.getElementById('avatar-grid');
        grid.innerHTML = avatars.map((avatar, index) => `
            <div class="avatar-option ${index === 0 ? 'selected' : ''}" data-avatar="${avatar}">
                ${avatar}
            </div>
        `).join('');

        // Avatar selection
        grid.addEventListener('click', (e) => {
            const option = e.target.closest('.avatar-option');
            if (option) {
                grid.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedAvatar = option.dataset.avatar;
            }
        });
    }

    setupEventListeners() {
        // Main menu buttons
        document.getElementById('btn-join-game').addEventListener('click', () => {
            this.showScreen('join-screen');
        });

        document.getElementById('btn-host-game').addEventListener('click', () => {
            window.location.href = 'host.html';
        });

        document.getElementById('btn-admin').addEventListener('click', () => {
            window.location.href = 'admin.html';
        });

        // Back button
        document.getElementById('btn-back-join').addEventListener('click', () => {
            this.showScreen('main-menu');
        });

        // Join game
        document.getElementById('btn-join-submit').addEventListener('click', () => this.joinGame());

        // Enter key on inputs
        document.getElementById('game-pin').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('player-name').focus();
            }
        });

        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.joinGame();
            }
        });

        // Play again button
        document.getElementById('btn-play-again').addEventListener('click', () => {
            window.location.reload();
        });
    }

    setupGameEvents() {
        gameController.on('statusChange', (status) => this.onStatusChange(status));
        gameController.on('gameUpdate', (game) => this.onGameUpdate(game));
        gameController.on('gameDeleted', () => this.onGameDeleted());
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    showError(message) {
        const errorEl = document.getElementById('join-error');
        errorEl.textContent = message;
        setTimeout(() => {
            errorEl.textContent = '';
        }, 5000);
    }

    // ==========================================
    // Game Flow
    // ==========================================

    async joinGame() {
        const pin = document.getElementById('game-pin').value.trim();
        const name = document.getElementById('player-name').value.trim();

        // Validation
        if (!pin) {
            this.showError('Please enter a game PIN');
            return;
        }

        if (!name) {
            this.showError('Please enter your nickname');
            return;
        }

        if (pin.length !== 6 || isNaN(pin)) {
            this.showError('PIN must be 6 digits');
            return;
        }

        if (name.length < 2) {
            this.showError('Nickname must be at least 2 characters');
            return;
        }

        try {
            await gameController.joinGame(pin, {
                name: name,
                avatar: this.selectedAvatar
            });

            // Show waiting room
            document.getElementById('lobby-avatar').textContent = this.selectedAvatar;
            document.getElementById('lobby-nickname').textContent = name;
            this.showScreen('player-lobby');

        } catch (error) {
            console.error('Failed to join game:', error);
            this.showError(error.message || 'Failed to join game');
        }
    }

    // ==========================================
    // Event Handlers
    // ==========================================

    onStatusChange(status) {
        switch (status) {
            case 'question':
                this.showQuestion();
                break;
            case 'reveal':
                // Don't change screen, just wait for next question
                break;
            case 'leaderboard':
                // Stay on current screen
                break;
            case 'finished':
                this.showResults();
                break;
        }
    }

    onGameUpdate(game) {
        if (!game) return;

        // Update score display
        const player = gameController.getMyPlayer();
        if (player && this.currentScreen === 'player-game') {
            document.getElementById('player-score-display').textContent = `${player.score} pts`;
            document.getElementById('player-streak').textContent = `🔥 ${player.streak}`;
        }
    }

    onGameDeleted() {
        alert('Game has ended');
        window.location.reload();
    }

    // ==========================================
    // Question Display
    // ==========================================

    showQuestion() {
        const question = gameController.getCurrentQuestion();
        if (!question) return;

        this.hasAnswered = false;

        // Hide feedback
        document.getElementById('answer-feedback').classList.add('hidden');

        // Show question area (simplified for mobile)
        const questionArea = document.getElementById('player-question-area');
        questionArea.innerHTML = `
            <div class="player-question-text">${this.escapeHtml(question.text)}</div>
        `;

        // Create answer buttons
        const shapes = gameController.getAnswerShapes();
        const colors = gameController.getAnswerColors();
        const buttonsContainer = document.getElementById('answer-buttons');
        
        buttonsContainer.innerHTML = question.answers.map((answer, index) => `
            <button class="answer-btn" data-index="${index}" style="background: ${colors[index]}">
                <span class="answer-shape">${shapes[index]}</span>
                <span class="answer-text">${this.escapeHtml(answer)}</span>
            </button>
        `).join('');

        // Add click handlers
        buttonsContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => this.submitAnswer(parseInt(btn.dataset.index)));
        });

        // Show screen
        this.showScreen('player-game');

        // Start timer display
        const duration = question.timeLimit || gameController.currentGame.settings.timePerQuestion;
        this.startTimer(duration);
    }

    startTimer(duration) {
        const timerBar = document.getElementById('question-timer-player');
        timerBar.innerHTML = '<div class="timer-bar-inner"></div>';
        const timerInner = timerBar.querySelector('.timer-bar-inner');

        gameController.startTimer(
            duration,
            (remaining) => {
                const percent = (remaining / duration) * 100;
                timerInner.style.width = `${percent}%`;

                // Sound effects for last 5 seconds
                if (remaining <= 5 && remaining > 0) {
                    this.playSound('tick');
                }
            },
            () => {
                // Time's up - if not answered, show timeout
                if (!this.hasAnswered) {
                    this.showFeedback(false, 0, true);
                }
            }
        );
    }

    async submitAnswer(answerIndex) {
        if (this.hasAnswered) return;
        this.hasAnswered = true;

        // Disable all buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.index) === answerIndex) {
                btn.classList.add('selected');
            }
        });

        try {
            const result = await gameController.submitAnswer(answerIndex);
            this.showFeedback(result.isCorrect, result.points);
        } catch (error) {
            console.error('Failed to submit answer:', error);
        }
    }

    showFeedback(isCorrect, points, timeout = false) {
        const feedback = document.getElementById('answer-feedback');
        
        if (timeout) {
            feedback.innerHTML = `
                <div class="feedback-icon">⏰</div>
                <div class="feedback-text">Time's Up!</div>
                <div class="feedback-points">No points</div>
            `;
            feedback.className = 'feedback-overlay feedback-wrong';
        } else if (isCorrect) {
            this.playSound('correct');
            feedback.innerHTML = `
                <div class="feedback-icon">✓</div>
                <div class="feedback-text feedback-correct">Correct!</div>
                <div class="feedback-points">+${points} points</div>
            `;
            feedback.className = 'feedback-overlay feedback-correct';
        } else {
            this.playSound('wrong');
            feedback.innerHTML = `
                <div class="feedback-icon">✗</div>
                <div class="feedback-text feedback-wrong">Wrong!</div>
                <div class="feedback-points">No points</div>
            `;
            feedback.className = 'feedback-overlay feedback-wrong';
        }

        feedback.classList.remove('hidden');
    }

    showResults() {
        const player = gameController.getMyPlayer();
        const leaderboard = gameController.getLeaderboard();
        
        if (!player) return;

        // Find player position
        const position = leaderboard.findIndex(p => p.id === player.id) + 1;

        // Update UI
        document.getElementById('final-score').textContent = player.score;
        document.getElementById('position-value').textContent = `#${position}`;

        // Play sound for top 3
        if (position <= 3) {
            this.playSound('winner');
            themeManager.startConfetti(3000);
        }

        // Update title based on position
        const titles = ['🏆 Champion!', '🥈 Amazing!', '🥉 Great Job!'];
        document.getElementById('results-title').textContent = 
            position <= 3 ? titles[position - 1] : 'Game Over!';

        this.showScreen('player-results');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use in app.js
export default PlayerController;
