// ==========================================
// QUIZMAS - Host Controller
// Controls the host/TV display
// ==========================================

import gameController from './game-controller.js';
import firebaseService from './firebase-service.js';
import themeManager from './theme-manager.js';

class HostController {
    constructor() {
        this.currentScreen = 'host-setup';
        this.questionCount = 10;
        this.sounds = {};
    }

    async init() {
        // Initialize theme
        themeManager.init();

        // Load sounds
        this.initSounds();

        // Load quizzes
        await this.loadQuizzes();

        // Set up event listeners
        this.setupEventListeners();

        // Subscribe to game events
        this.setupGameEvents();

        console.log('Host controller initialized');
    }

    initSounds() {
        this.sounds = {
            join: document.getElementById('sound-join'),
            countdown: document.getElementById('sound-countdown'),
            timesUp: document.getElementById('sound-times-up'),
            reveal: document.getElementById('sound-reveal'),
            winner: document.getElementById('sound-winner'),
            bgMusic: document.getElementById('bg-music')
        };
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {}); // Ignore autoplay errors
        }
    }

    async loadQuizzes() {
        try {
            const quizzes = await firebaseService.getAllQuizzes();
            const select = document.getElementById('quiz-select');
            
            select.innerHTML = '<option value="">-- Select a Quiz --</option>';
            select.innerHTML += '<option value="random">🎲 Random Questions</option>';
            
            quizzes.forEach(quiz => {
                const option = document.createElement('option');
                option.value = quiz.id;
                option.textContent = `${quiz.name} (${quiz.questionIds?.length || 0} questions)`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load quizzes:', error);
        }
    }

    setupEventListeners() {
        // Question count controls
        document.getElementById('btn-q-minus').addEventListener('click', () => {
            if (this.questionCount > 1) {
                this.questionCount--;
                document.getElementById('question-count').textContent = this.questionCount;
            }
        });

        document.getElementById('btn-q-plus').addEventListener('click', () => {
            if (this.questionCount < 50) {
                this.questionCount++;
                document.getElementById('question-count').textContent = this.questionCount;
            }
        });

        // Create game button
        document.getElementById('btn-create-game').addEventListener('click', () => this.createGame());

        // Start game button
        document.getElementById('btn-start-game').addEventListener('click', () => this.startGame());

        // Cancel game button
        document.getElementById('btn-cancel-game').addEventListener('click', () => this.cancelGame());

        // Next question button
        document.getElementById('btn-next-question').addEventListener('click', () => this.nextAfterReveal());

        // Continue from leaderboard
        document.getElementById('btn-continue').addEventListener('click', () => this.continueFromLeaderboard());

        // New game button
        document.getElementById('btn-new-game').addEventListener('click', () => this.newGame());

        // Home button
        document.getElementById('btn-home').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    setupGameEvents() {
        gameController.on('gameUpdate', (game) => this.onGameUpdate(game));
        gameController.on('playerJoined', (player) => this.onPlayerJoined(player));
        gameController.on('playerLeft', (player) => this.onPlayerLeft(player));
        gameController.on('statusChange', (status) => this.onStatusChange(status));
        gameController.on('gameDeleted', () => this.onGameDeleted());
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    // ==========================================
    // Game Flow
    // ==========================================

    async createGame() {
        const quizId = document.getElementById('quiz-select').value;
        const timePerQuestion = parseInt(document.getElementById('time-select').value);
        const shuffleQuestions = document.getElementById('shuffle-questions').checked;
        const showLeaderboard = document.getElementById('show-leaderboard').checked;

        const settings = {
            questionCount: this.questionCount,
            timePerQuestion: timePerQuestion,
            shuffleQuestions: shuffleQuestions,
            showLeaderboard: showLeaderboard
        };

        try {
            const pin = await gameController.createGame(quizId || 'random', settings);
            
            // Show lobby
            document.getElementById('game-pin-display').textContent = pin;
            this.showScreen('host-lobby');
            this.updatePlayersList();

        } catch (error) {
            console.error('Failed to create game:', error);
            alert('Failed to create game. Please try again.');
        }
    }

    async startGame() {
        const playerCount = gameController.getPlayerCount();
        if (playerCount < 1) {
            alert('Wait for at least 1 player to join!');
            return;
        }

        try {
            await gameController.startGame();
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Failed to start game: ' + error.message);
        }
    }

    async cancelGame() {
        if (confirm('Are you sure you want to cancel this game?')) {
            await gameController.cancelGame();
            this.showScreen('host-setup');
        }
    }

    async nextAfterReveal() {
        const game = gameController.currentGame;
        
        if (game.settings.showLeaderboard) {
            await gameController.showLeaderboard();
        } else {
            await gameController.nextQuestion();
        }
    }

    async continueFromLeaderboard() {
        await gameController.nextQuestion();
    }

    newGame() {
        window.location.reload();
    }

    // ==========================================
    // Event Handlers
    // ==========================================

    onGameUpdate(game) {
        if (!game) return;

        // Update player count in lobby
        if (this.currentScreen === 'host-lobby') {
            this.updatePlayersList();
        }

        // Update answer count during question
        if (this.currentScreen === 'host-question' && game.answers) {
            const questionIndex = game.currentQuestion;
            const answers = game.answers[questionIndex] || {};
            const answered = Object.keys(answers).length;
            const total = gameController.getPlayerCount();
            document.getElementById('answers-received').textContent = `${answered} / ${total} answered`;
        }
    }

    onPlayerJoined(player) {
        this.playSound('join');
        this.updatePlayersList();
    }

    onPlayerLeft(player) {
        this.updatePlayersList();
    }

    onStatusChange(status) {
        switch (status) {
            case 'question':
                this.showQuestion();
                break;
            case 'reveal':
                this.showReveal();
                break;
            case 'leaderboard':
                this.showLeaderboard();
                break;
            case 'finished':
                this.showFinalResults();
                break;
        }
    }

    onGameDeleted() {
        alert('Game has been cancelled');
        this.showScreen('host-setup');
    }

    // ==========================================
    // UI Updates
    // ==========================================

    updatePlayersList() {
        const players = gameController.getPlayers();
        const grid = document.getElementById('players-grid');
        const countSpan = document.getElementById('player-count');
        const startBtn = document.getElementById('btn-start-game');

        countSpan.textContent = players.length;
        startBtn.disabled = players.length < 1;

        grid.innerHTML = players.map(player => `
            <div class="player-card">
                <span class="avatar">${player.avatar}</span>
                <span class="name">${this.escapeHtml(player.name)}</span>
            </div>
        `).join('');
    }

    showQuestion() {
        const game = gameController.currentGame;
        const question = gameController.getCurrentQuestion();
        
        if (!question) return;

        const questionType = question.questionType || 'quiz';

        // Update question number
        document.getElementById('question-number').textContent = 
            `${game.currentQuestion + 1}/${game.questions.length}`;

        // Update category
        document.getElementById('category-badge').textContent = question.category || 'Algemeen';

        // Update question text
        document.getElementById('question-text').textContent = question.text;

        // Update media
        const mediaContainer = document.getElementById('question-media');
        if (question.mediaType && question.mediaType !== 'none' && question.mediaUrl) {
            mediaContainer.classList.remove('hidden');
            mediaContainer.innerHTML = this.renderMedia(question.mediaType, question.mediaUrl);
        } else {
            mediaContainer.classList.add('hidden');
            mediaContainer.innerHTML = '';
        }

        // Hide all question type displays
        document.querySelectorAll('.answers-display').forEach(el => el.style.display = 'none');

        // Show the appropriate display for question type
        if (questionType === 'quiz') {
            const shapes = gameController.getAnswerShapes();
            const answersContainer = document.getElementById('host-answers');
            answersContainer.innerHTML = question.answers.map((answer, index) => `
                <div class="answer-option">
                    <span class="shape">${shapes[index]}</span>
                    <span class="text">${this.escapeHtml(answer)}</span>
                </div>
            `).join('');
            answersContainer.style.display = 'grid';
        } else if (questionType === 'truefalse') {
            document.getElementById('host-truefalse').style.display = 'block';
        } else if (questionType === 'type') {
            document.getElementById('host-type').style.display = 'block';
        } else if (questionType === 'slider') {
            const sliderContainer = document.getElementById('host-slider');
            document.getElementById('slider-min').textContent = question.sliderMin || 0;
            document.getElementById('slider-max').textContent = question.sliderMax || 100;
            sliderContainer.style.display = 'block';
        } else if (questionType === 'order') {
            const orderContainer = document.getElementById('order-items-display');
            // Shuffle items for display
            const shuffled = [...(question.orderItems || [])].sort(() => Math.random() - 0.5);
            orderContainer.innerHTML = shuffled.map(item => `
                <div class="order-item-display">${this.escapeHtml(item)}</div>
            `).join('');
            document.getElementById('host-order').style.display = 'block';
        }

        // Reset answer count
        document.getElementById('answers-received').textContent = 
            `0 / ${gameController.getPlayerCount()} beantwoord`;

        // Show screen
        this.showScreen('host-question');

        // Start timer
        const duration = question.timeLimit || game.settings.timePerQuestion;
        this.startQuestionTimer(duration);
    }

    startQuestionTimer(duration) {
        const timerCircle = document.getElementById('host-timer');
        const timerValue = document.getElementById('timer-value');

        gameController.startTimer(
            duration,
            (remaining) => {
                timerValue.textContent = remaining;
                
                // Update visual
                const percent = (remaining / duration) * 100;
                timerCircle.style.background = 
                    `conic-gradient(var(--primary) ${percent}%, var(--surface) ${percent}%)`;

                // Warning states
                timerCircle.classList.remove('warning', 'danger');
                if (remaining <= 5) {
                    timerCircle.classList.add('danger');
                } else if (remaining <= 10) {
                    timerCircle.classList.add('warning');
                }

                // Countdown sound
                if (remaining <= 5 && remaining > 0) {
                    this.playSound('countdown');
                }
            },
            () => {
                // Timer complete - show reveal
                this.playSound('timesUp');
                setTimeout(() => {
                    gameController.showReveal();
                }, 1000);
            }
        );
    }

    showReveal() {
        const game = gameController.currentGame;
        const question = gameController.getCurrentQuestion();
        const questionIndex = game.currentQuestion;
        
        if (!question) return;

        const questionType = question.questionType || 'quiz';

        gameController.stopTimer();

        // Update question
        document.getElementById('reveal-question').textContent = question.text;

        // Hide all reveal types
        document.querySelectorAll('.answers-reveal').forEach(el => el.style.display = 'none');

        // Show the appropriate reveal for question type
        if (questionType === 'quiz') {
            const shapes = gameController.getAnswerShapes();
            const answersContainer = document.getElementById('reveal-answers');
            answersContainer.innerHTML = question.answers.map((answer, index) => `
                <div class="answer-option ${index === question.correctIndex ? 'correct' : ''}">
                    <span class="shape">${shapes[index]}</span>
                    <span class="text">${this.escapeHtml(answer)}</span>
                </div>
            `).join('');
            answersContainer.style.display = 'grid';
        } else if (questionType === 'truefalse') {
            const correctAnswer = question.correctAnswer === true;
            document.getElementById('reveal-tf-true').classList.toggle('correct', correctAnswer);
            document.getElementById('reveal-tf-false').classList.toggle('correct', !correctAnswer);
            document.getElementById('reveal-truefalse').style.display = 'block';
        } else if (questionType === 'type') {
            document.getElementById('reveal-correct-answer').textContent = question.correctAnswer;
            // Show player answers
            const answers = gameController.getAnswersForQuestion(questionIndex);
            const listContainer = document.getElementById('player-answers-list');
            listContainer.innerHTML = Object.values(answers).map(a => {
                const isCorrect = this.checkTypeAnswer(a.answer, question.correctAnswer);
                return `<div class="player-answer-chip ${isCorrect ? 'correct' : 'wrong'}">${this.escapeHtml(a.answer)}</div>`;
            }).join('');
            document.getElementById('reveal-type').style.display = 'block';
        } else if (questionType === 'slider') {
            const min = question.sliderMin || 0;
            const max = question.sliderMax || 100;
            const correct = question.correctAnswer || 50;
            const tolerance = question.tolerance || 5;
            
            document.getElementById('reveal-slider-answer').textContent = correct;
            document.getElementById('reveal-slider-min').textContent = min;
            document.getElementById('reveal-slider-max').textContent = max;
            
            const range = max - min;
            const correctPercent = ((correct - min) / range) * 100;
            const tolerancePercent = (tolerance / range) * 100;
            
            document.getElementById('reveal-correct-marker').style.left = `${correctPercent}%`;
            document.getElementById('reveal-tolerance-zone').style.left = `${correctPercent - tolerancePercent}%`;
            document.getElementById('reveal-tolerance-zone').style.width = `${tolerancePercent * 2}%`;
            
            document.getElementById('reveal-slider').style.display = 'block';
        } else if (questionType === 'order') {
            const correctOrder = question.orderItems || [];
            const orderList = document.getElementById('reveal-correct-order');
            orderList.innerHTML = correctOrder.map((item, index) => `
                <div class="correct-order-item">
                    <span class="order-position">${index + 1}</span>
                    <span>${this.escapeHtml(item)}</span>
                </div>
            `).join('');
            document.getElementById('reveal-order').style.display = 'block';
        }

        // Calculate stats
        const stats = gameController.getAnswerStats(questionIndex);
        document.getElementById('correct-count').textContent = stats.correct;
        document.getElementById('wrong-count').textContent = stats.wrong;
        document.getElementById('no-answer-count').textContent = stats.noAnswer;

        // Update scores
        this.calculateAndUpdateScores(questionIndex, question);

        // Play reveal sound
        this.playSound('reveal');

        this.showScreen('host-reveal');
    }

    checkTypeAnswer(playerAnswer, correctAnswer) {
        if (!playerAnswer || !correctAnswer) return false;
        const normalize = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        return normalize(playerAnswer) === normalize(correctAnswer);
    }

    async calculateAndUpdateScores(questionIndex, question) {
        const answers = gameController.getAnswersForQuestion(questionIndex);
        const maxTime = question.timeLimit || gameController.currentGame.settings.timePerQuestion;
        const questionType = question.questionType || 'quiz';

        for (const [playerId, answer] of Object.entries(answers)) {
            let isCorrect = false;
            
            if (questionType === 'quiz') {
                isCorrect = answer.answer === question.correctIndex;
            } else if (questionType === 'truefalse') {
                isCorrect = answer.answer === question.correctAnswer;
            } else if (questionType === 'type') {
                isCorrect = this.checkTypeAnswer(answer.answer, question.correctAnswer);
            } else if (questionType === 'slider') {
                const tolerance = question.tolerance || 5;
                const diff = Math.abs(answer.answer - question.correctAnswer);
                isCorrect = diff <= tolerance;
            } else if (questionType === 'order') {
                const correctOrder = question.orderItems || [];
                const playerOrder = answer.answer || [];
                isCorrect = JSON.stringify(correctOrder) === JSON.stringify(playerOrder);
            }
            
            const points = gameController.calculatePoints(isCorrect, answer.timeRemaining, maxTime);
            await gameController.updateScore(playerId, points, !isCorrect);
        }

        // Players who didn't answer get streak reset
        const players = gameController.getPlayers();
        for (const player of players) {
            if (!answers[player.id]) {
                await gameController.updateScore(player.id, 0, true);
            }
        }
    }

    showLeaderboard() {
        const leaderboard = gameController.getLeaderboard();
        const listContainer = document.getElementById('leaderboard-list');

        listContainer.innerHTML = leaderboard.slice(0, 5).map((player, index) => `
            <div class="leaderboard-item">
                <span class="rank">${index + 1}</span>
                <span class="avatar">${player.avatar}</span>
                <span class="name">${this.escapeHtml(player.name)}</span>
                <span class="score">${player.score}</span>
            </div>
        `).join('');

        this.showScreen('host-leaderboard');
    }

    showFinalResults() {
        const leaderboard = gameController.getLeaderboard();
        
        // Update podium
        if (leaderboard[0]) {
            document.querySelector('#first-place .podium-avatar').textContent = leaderboard[0].avatar;
            document.querySelector('#first-place .podium-name').textContent = leaderboard[0].name;
            document.querySelector('#first-place .podium-score').textContent = leaderboard[0].score;
        }
        
        if (leaderboard[1]) {
            document.querySelector('#second-place .podium-avatar').textContent = leaderboard[1].avatar;
            document.querySelector('#second-place .podium-name').textContent = leaderboard[1].name;
            document.querySelector('#second-place .podium-score').textContent = leaderboard[1].score;
        }
        
        if (leaderboard[2]) {
            document.querySelector('#third-place .podium-avatar').textContent = leaderboard[2].avatar;
            document.querySelector('#third-place .podium-name').textContent = leaderboard[2].name;
            document.querySelector('#third-place .podium-score').textContent = leaderboard[2].score;
        }

        // Full results list
        const allResults = document.getElementById('all-results');
        allResults.innerHTML = leaderboard.map((player, index) => `
            <div class="leaderboard-item">
                <span class="rank">${index + 1}</span>
                <span class="avatar">${player.avatar}</span>
                <span class="name">${this.escapeHtml(player.name)}</span>
                <span class="score">${player.score}</span>
            </div>
        `).join('');

        // Play winner sound
        this.playSound('winner');

        // Celebration confetti
        themeManager.startConfetti(5000);

        this.showScreen('host-final');
    }

    renderMedia(type, url) {
        switch (type) {
            case 'image':
                return `<img src="${url}" alt="Question image" />`;
            case 'video':
                // Handle YouTube URLs
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    const videoId = this.extractYouTubeId(url);
                    return `<iframe width="560" height="300" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe>`;
                }
                return `<video src="${url}" autoplay muted></video>`;
            case 'audio':
                return `<audio src="${url}" controls autoplay></audio>`;
            default:
                return '';
        }
    }

    extractYouTubeId(url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^?&]+)/);
        return match ? match[1] : url;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const hostController = new HostController();
    hostController.init();
});
