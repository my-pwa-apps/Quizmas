// ==========================================
// QUIZMAS - Game Controller
// Core game logic shared between host and player
// ==========================================

import firebaseService from './firebase-service.js';

class GameController {
    constructor() {
        this.currentGame = null;
        this.gamePin = null;
        this.playerId = null;
        this.isHost = false;
        this.timerInterval = null;
        this.timeRemaining = 0;
        this.callbacks = {};
    }

    // ==========================================
    // Event System
    // ==========================================
    
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    off(event, callback) {
        if (!this.callbacks[event]) return;
        this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.callbacks[event]) return;
        this.callbacks[event].forEach(callback => callback(data));
    }

    // ==========================================
    // Host Functions
    // ==========================================

    async createGame(quizId, settings) {
        try {
            await firebaseService.signInAnonymous();
            const user = firebaseService.getCurrentUser();
            
            const pin = await firebaseService.createGame(user.uid, quizId, settings);
            this.gamePin = pin;
            this.isHost = true;
            
            // Subscribe to game updates
            this.subscribeToGame(pin);
            
            return pin;
        } catch (error) {
            console.error('Failed to create game:', error);
            throw error;
        }
    }

    async startGame() {
        if (!this.isHost || !this.gamePin) {
            throw new Error('Only host can start the game');
        }

        try {
            // Load quiz questions
            const quiz = await firebaseService.getQuiz(this.currentGame.quizId);
            let questions = await firebaseService.getQuizQuestions(this.currentGame.quizId);
            
            if (!questions || questions.length === 0) {
                // If no quiz selected, get random questions
                questions = await firebaseService.getAllQuestions();
            }

            // Shuffle if enabled
            if (this.currentGame.settings.shuffleQuestions) {
                questions = this.shuffleArray([...questions]);
            }

            // Limit question count
            const questionCount = Math.min(
                this.currentGame.settings.questionCount,
                questions.length
            );
            questions = questions.slice(0, questionCount);

            // Prepare questions for game (remove correct answer info from players)
            const gameQuestions = questions.map((q, index) => ({
                index: index,
                text: q.text,
                answers: q.answers,
                correctIndex: q.correctIndex,
                category: q.category,
                mediaType: q.mediaType || 'none',
                mediaUrl: q.mediaUrl || null,
                timeLimit: q.timeLimit || this.currentGame.settings.timePerQuestion,
                explanation: q.explanation || null
            }));

            // Save questions to game
            await firebaseService.setGameQuestions(this.gamePin, gameQuestions);
            
            // Start first question
            await this.advanceToQuestion(0);
            
        } catch (error) {
            console.error('Failed to start game:', error);
            throw error;
        }
    }

    async advanceToQuestion(questionIndex) {
        if (!this.isHost) return;

        if (questionIndex >= this.currentGame.questions.length) {
            // Game finished
            await this.endGame();
            return;
        }

        await firebaseService.advanceQuestion(this.gamePin, questionIndex);
    }

    async showReveal() {
        if (!this.isHost) return;
        await firebaseService.updateGameStatus(this.gamePin, 'reveal');
    }

    async showLeaderboard() {
        if (!this.isHost) return;
        await firebaseService.updateGameStatus(this.gamePin, 'leaderboard');
    }

    async nextQuestion() {
        if (!this.isHost) return;
        const nextIndex = this.currentGame.currentQuestion + 1;
        
        if (nextIndex >= this.currentGame.questions.length) {
            await this.endGame();
        } else {
            await this.advanceToQuestion(nextIndex);
        }
    }

    async endGame() {
        if (!this.isHost) return;
        
        await firebaseService.updateGameStatus(this.gamePin, 'finished');
        
        // Log game to history
        const players = this.getLeaderboard();
        await firebaseService.logGameResult({
            pin: this.gamePin,
            quizId: this.currentGame.quizId,
            questionCount: this.currentGame.questions.length,
            playerCount: players.length,
            topPlayers: players.slice(0, 3),
            duration: Date.now() - (this.currentGame.createdAt || Date.now())
        });
    }

    async cancelGame() {
        if (!this.isHost || !this.gamePin) return;
        
        firebaseService.unsubscribeFromGame(this.gamePin);
        await firebaseService.deleteGame(this.gamePin);
        
        this.currentGame = null;
        this.gamePin = null;
        this.isHost = false;
    }

    // ==========================================
    // Player Functions
    // ==========================================

    async joinGame(pin, playerData) {
        try {
            await firebaseService.signInAnonymous();
            
            const result = await firebaseService.joinGame(pin, playerData);
            this.gamePin = result.gamePin;
            this.playerId = result.playerId;
            this.isHost = false;
            
            // Subscribe to game updates
            this.subscribeToGame(pin);
            
            return result;
        } catch (error) {
            console.error('Failed to join game:', error);
            throw error;
        }
    }

    async submitAnswer(answerIndex) {
        if (this.isHost || !this.playerId) return;

        const question = this.getCurrentQuestion();
        if (!question) return;

        const questionIndex = this.currentGame.currentQuestion;
        const maxTime = question.timeLimit || this.currentGame.settings.timePerQuestion;
        
        await firebaseService.submitAnswer(
            this.gamePin,
            this.playerId,
            questionIndex,
            answerIndex,
            this.timeRemaining,
            maxTime
        );

        // Calculate points locally for immediate feedback
        const isCorrect = answerIndex === question.correctIndex;
        const points = this.calculatePoints(isCorrect, this.timeRemaining, maxTime);
        
        return { isCorrect, points };
    }

    // ==========================================
    // Game State
    // ==========================================

    subscribeToGame(pin) {
        firebaseService.subscribeToGame(pin, (game) => {
            const oldGame = this.currentGame;
            this.currentGame = game;
            
            if (!game) {
                this.emit('gameDeleted', null);
                return;
            }

            // Emit status change events
            if (!oldGame || oldGame.status !== game.status) {
                this.emit('statusChange', game.status);
                this.emit(`status:${game.status}`, game);
            }

            // Emit player join/leave events
            if (oldGame && game.players) {
                const oldPlayerIds = Object.keys(oldGame.players || {});
                const newPlayerIds = Object.keys(game.players);
                
                newPlayerIds.forEach(id => {
                    if (!oldPlayerIds.includes(id)) {
                        this.emit('playerJoined', game.players[id]);
                    }
                });
                
                oldPlayerIds.forEach(id => {
                    if (!newPlayerIds.includes(id)) {
                        this.emit('playerLeft', { id });
                    }
                });
            }

            // Emit question change event
            if (oldGame && oldGame.currentQuestion !== game.currentQuestion) {
                this.emit('questionChange', this.getCurrentQuestion());
            }

            // General update event
            this.emit('gameUpdate', game);
        });
    }

    unsubscribeFromGame() {
        if (this.gamePin) {
            firebaseService.unsubscribeFromGame(this.gamePin);
        }
    }

    getCurrentQuestion() {
        if (!this.currentGame || !this.currentGame.questions) {
            return null;
        }
        return this.currentGame.questions[this.currentGame.currentQuestion];
    }

    getPlayer(playerId) {
        if (!this.currentGame || !this.currentGame.players) {
            return null;
        }
        return this.currentGame.players[playerId];
    }

    getMyPlayer() {
        return this.getPlayer(this.playerId);
    }

    getPlayers() {
        if (!this.currentGame || !this.currentGame.players) {
            return [];
        }
        return Object.values(this.currentGame.players);
    }

    getPlayerCount() {
        return this.getPlayers().length;
    }

    getLeaderboard() {
        return this.getPlayers().sort((a, b) => b.score - a.score);
    }

    getAnswersForQuestion(questionIndex) {
        if (!this.currentGame || !this.currentGame.answers) {
            return {};
        }
        return this.currentGame.answers[questionIndex] || {};
    }

    getAnswerStats(questionIndex) {
        const question = this.currentGame.questions[questionIndex];
        const answers = this.getAnswersForQuestion(questionIndex);
        const players = this.getPlayers();
        
        const stats = {
            total: players.length,
            answered: Object.keys(answers).length,
            correct: 0,
            wrong: 0,
            noAnswer: 0,
            byOption: question.answers.map(() => 0)
        };

        Object.values(answers).forEach(answer => {
            if (answer.answer === question.correctIndex) {
                stats.correct++;
            } else {
                stats.wrong++;
            }
            if (answer.answer >= 0 && answer.answer < stats.byOption.length) {
                stats.byOption[answer.answer]++;
            }
        });

        stats.noAnswer = stats.total - stats.answered;
        
        return stats;
    }

    // ==========================================
    // Timer
    // ==========================================

    startTimer(duration, onTick, onComplete) {
        this.stopTimer();
        
        this.timeRemaining = duration;
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            
            if (onTick) {
                onTick(this.timeRemaining);
            }
            
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                if (onComplete) {
                    onComplete();
                }
            }
        }, 1000);

        // Initial tick
        if (onTick) {
            onTick(this.timeRemaining);
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    getTimeRemaining() {
        return this.timeRemaining;
    }

    // ==========================================
    // Scoring
    // ==========================================

    calculatePoints(isCorrect, timeRemaining, maxTime) {
        if (!isCorrect) {
            return 0;
        }

        // Base points
        const basePoints = 1000;
        
        // Time bonus (0-500 points based on speed)
        const timeRatio = timeRemaining / maxTime;
        const timeBonus = Math.round(timeRatio * 500);
        
        return basePoints + timeBonus;
    }

    async updateScore(playerId, additionalPoints, streakReset = false) {
        const player = this.getPlayer(playerId);
        if (!player) return;

        const newScore = player.score + additionalPoints;
        const newStreak = streakReset ? 0 : player.streak + 1;

        await firebaseService.updatePlayerScore(
            this.gamePin,
            playerId,
            newScore,
            newStreak
        );
    }

    // ==========================================
    // Utilities
    // ==========================================

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getAnswerShapes() {
        return ['▲', '◆', '●', '■'];
    }

    getAnswerColors() {
        return ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
    }
}

// Export singleton
const gameController = new GameController();
export default gameController;
