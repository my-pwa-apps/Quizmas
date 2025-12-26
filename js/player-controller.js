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
        const questionType = question.questionType || 'quiz';

        // Hide feedback
        document.getElementById('answer-feedback').classList.add('hidden');

        // Show question area (simplified for mobile)
        const questionArea = document.getElementById('player-question-area');
        questionArea.innerHTML = `
            <div class="player-question-text">${this.escapeHtml(question.text)}</div>
        `;

        // Hide all input types
        document.querySelectorAll('[class*="player-input-"]').forEach(el => el.style.display = 'none');

        // Show appropriate input based on question type
        if (questionType === 'quiz') {
            this.setupQuizInput(question);
        } else if (questionType === 'truefalse') {
            this.setupTrueFalseInput();
        } else if (questionType === 'type') {
            this.setupTypeInput();
        } else if (questionType === 'slider') {
            this.setupSliderInput(question);
        } else if (questionType === 'order') {
            this.setupOrderInput(question);
        }

        // Show screen
        this.showScreen('player-game');

        // Start timer display
        const duration = question.timeLimit || gameController.currentGame.settings.timePerQuestion;
        this.startTimer(duration);
    }

    setupQuizInput(question) {
        const shapes = gameController.getAnswerShapes();
        const colors = gameController.getAnswerColors();
        const buttonsContainer = document.getElementById('answer-buttons');
        
        buttonsContainer.innerHTML = question.answers.map((answer, index) => `
            <button class="answer-btn" data-index="${index}" style="background: ${colors[index]}">
                <span class="answer-shape">${shapes[index]}</span>
                <span class="answer-text">${this.escapeHtml(answer)}</span>
            </button>
        `).join('');

        buttonsContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => this.submitAnswer(parseInt(btn.dataset.index)));
        });
        buttonsContainer.style.display = 'grid';
    }

    setupTrueFalseInput() {
        const tfContainer = document.getElementById('tf-buttons');
        tfContainer.style.display = 'grid';

        document.getElementById('btn-true').onclick = () => this.submitAnswer(true);
        document.getElementById('btn-false').onclick = () => this.submitAnswer(false);
    }

    setupTypeInput() {
        const typeContainer = document.getElementById('type-input');
        typeContainer.style.display = 'flex';

        const input = document.getElementById('type-answer-input');
        const submitBtn = document.getElementById('btn-submit-answer');
        
        input.value = '';
        input.focus();
        
        submitBtn.onclick = () => {
            const answer = input.value.trim();
            if (answer) {
                this.submitAnswer(answer);
            }
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        };
    }

    setupSliderInput(question) {
        const sliderContainer = document.getElementById('slider-input');
        sliderContainer.style.display = 'flex';

        const slider = document.getElementById('slider-answer-input');
        const currentValue = document.getElementById('slider-current');
        const minLabel = document.getElementById('player-slider-min');
        const maxLabel = document.getElementById('player-slider-max');
        const submitBtn = document.getElementById('btn-submit-slider');

        const min = question.sliderMin || 0;
        const max = question.sliderMax || 100;
        const mid = Math.round((min + max) / 2);

        slider.min = min;
        slider.max = max;
        slider.value = mid;
        currentValue.textContent = mid;
        minLabel.textContent = min;
        maxLabel.textContent = max;

        slider.oninput = () => {
            currentValue.textContent = slider.value;
        };

        submitBtn.onclick = () => {
            this.submitAnswer(parseInt(slider.value));
        };
    }

    setupOrderInput(question) {
        const orderContainer = document.getElementById('order-input');
        orderContainer.style.display = 'flex';

        const sortableList = document.getElementById('order-sortable');
        const submitBtn = document.getElementById('btn-submit-order');
        
        // Shuffle items
        const items = [...(question.orderItems || [])].sort(() => Math.random() - 0.5);
        
        sortableList.innerHTML = items.map((item, index) => `
            <div class="order-sortable-item" data-value="${this.escapeHtml(item)}" draggable="true">
                <span class="drag-handle">☰</span>
                <span class="order-num">${index + 1}</span>
                <span class="order-text">${this.escapeHtml(item)}</span>
            </div>
        `).join('');

        // Simple drag and drop
        this.initSortable(sortableList);

        submitBtn.onclick = () => {
            const orderedItems = Array.from(sortableList.querySelectorAll('.order-sortable-item'))
                .map(el => el.dataset.value);
            this.submitAnswer(orderedItems);
        };
    }

    initSortable(list) {
        let draggedItem = null;

        list.querySelectorAll('.order-sortable-item').forEach(item => {
            item.addEventListener('dragstart', () => {
                draggedItem = item;
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedItem = null;
                this.updateOrderNumbers(list);
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    const rect = item.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    if (e.clientY < midY) {
                        list.insertBefore(draggedItem, item);
                    } else {
                        list.insertBefore(draggedItem, item.nextSibling);
                    }
                }
            });
        });
    }

    updateOrderNumbers(list) {
        list.querySelectorAll('.order-sortable-item').forEach((item, index) => {
            item.querySelector('.order-num').textContent = index + 1;
        });
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

    async submitAnswer(answerValue) {
        if (this.hasAnswered) return;
        this.hasAnswered = true;

        const question = gameController.getCurrentQuestion();
        const questionType = question?.questionType || 'quiz';

        // Disable all input elements
        if (questionType === 'quiz') {
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.disabled = true;
                if (parseInt(btn.dataset.index) === answerValue) {
                    btn.classList.add('selected');
                }
            });
        } else if (questionType === 'truefalse') {
            document.querySelectorAll('.tf-answer-btn').forEach(btn => {
                btn.disabled = true;
                if ((btn.dataset.answer === 'true') === answerValue) {
                    btn.classList.add('selected');
                }
            });
        } else if (questionType === 'type') {
            document.getElementById('type-answer-input').disabled = true;
            document.getElementById('btn-submit-answer').disabled = true;
        } else if (questionType === 'slider') {
            document.getElementById('slider-answer-input').disabled = true;
            document.getElementById('btn-submit-slider').disabled = true;
        } else if (questionType === 'order') {
            document.querySelectorAll('.order-sortable-item').forEach(item => {
                item.setAttribute('draggable', 'false');
            });
            document.getElementById('btn-submit-order').disabled = true;
        }

        try {
            const result = await gameController.submitAnswer(answerValue);
            this.showFeedback(result.isCorrect, result.points);
        } catch (error) {
            console.error('Kon antwoord niet versturen:', error);
        }
    }

    showFeedback(isCorrect, points, timeout = false) {
        const feedback = document.getElementById('answer-feedback');
        
        if (timeout) {
            feedback.innerHTML = `
                <div class="feedback-icon">⏰</div>
                <div class="feedback-text">Tijd is op!</div>
                <div class="feedback-points">Geen punten</div>
            `;
            feedback.className = 'feedback-overlay feedback-wrong';
        } else if (isCorrect) {
            this.playSound('correct');
            feedback.innerHTML = `
                <div class="feedback-icon">✓</div>
                <div class="feedback-text feedback-correct">Goed!</div>
                <div class="feedback-points">+${points} punten</div>
            `;
            feedback.className = 'feedback-overlay feedback-correct';
        } else {
            this.playSound('wrong');
            feedback.innerHTML = `
                <div class="feedback-icon">✗</div>
                <div class="feedback-text feedback-wrong">Fout!</div>
                <div class="feedback-points">Geen punten</div>
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
        const titles = ['🏆 Kampioen!', '🥈 Geweldig!', '🥉 Goed gedaan!'];
        document.getElementById('results-title').textContent = 
            position <= 3 ? titles[position - 1] : 'Spel Afgelopen!';

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
