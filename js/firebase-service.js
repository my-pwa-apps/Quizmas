// ==========================================
// QUIZMAS - Firebase Service Layer
// Handles all Firebase operations
// ==========================================

import { database, firestore, auth } from './firebase-config.js';
import { 
    ref, 
    set, 
    get, 
    push, 
    update, 
    remove, 
    onValue, 
    off,
    serverTimestamp as rtdbTimestamp,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { 
    signInAnonymously, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

class FirebaseService {
    constructor() {
        this.listeners = new Map();
        this.currentUser = null;
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
        });
    }

    // ==========================================
    // Authentication
    // ==========================================
    
    async signInAnonymous() {
        try {
            const result = await signInAnonymously(auth);
            return result.user;
        } catch (error) {
            console.error('Anonymous sign-in failed:', error);
            throw error;
        }
    }

    async signInAdmin(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error('Admin sign-in failed:', error);
            throw error;
        }
    }

    async signOutUser() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Sign-out failed:', error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // ==========================================
    // Game Management (Realtime Database)
    // ==========================================

    generateGamePin() {
        // Generate a 6-digit PIN
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async createGame(hostId, quizId, settings) {
        const pin = this.generateGamePin();
        const gameRef = ref(database, `games/${pin}`);
        
        const gameData = {
            pin: pin,
            hostId: hostId,
            quizId: quizId,
            status: 'lobby', // lobby, playing, question, reveal, leaderboard, finished
            settings: {
                questionCount: settings.questionCount || 10,
                timePerQuestion: settings.timePerQuestion || 20,
                shuffleQuestions: settings.shuffleQuestions ?? true,
                showLeaderboard: settings.showLeaderboard ?? true
            },
            players: {},
            currentQuestion: 0,
            questions: [],
            answers: {},
            createdAt: rtdbTimestamp()
        };

        await set(gameRef, gameData);
        return pin;
    }

    async joinGame(pin, playerData) {
        const gameRef = ref(database, `games/${pin}`);
        const snapshot = await get(gameRef);
        
        if (!snapshot.exists()) {
            throw new Error('Game not found');
        }

        const game = snapshot.val();
        if (game.status !== 'lobby') {
            throw new Error('Game has already started');
        }

        // Add player to game
        const playerId = push(ref(database, `games/${pin}/players`)).key;
        const playerRef = ref(database, `games/${pin}/players/${playerId}`);
        
        await set(playerRef, {
            id: playerId,
            name: playerData.name,
            avatar: playerData.avatar,
            score: 0,
            streak: 0,
            joinedAt: rtdbTimestamp()
        });

        // Set up disconnect handler to remove player if they leave
        onDisconnect(playerRef).remove();

        return { gamePin: pin, playerId: playerId };
    }

    async getGame(pin) {
        const gameRef = ref(database, `games/${pin}`);
        const snapshot = await get(gameRef);
        
        if (!snapshot.exists()) {
            return null;
        }
        
        return snapshot.val();
    }

    subscribeToGame(pin, callback) {
        const gameRef = ref(database, `games/${pin}`);
        const listener = onValue(gameRef, (snapshot) => {
            callback(snapshot.val());
        });
        
        this.listeners.set(`game_${pin}`, { ref: gameRef, listener });
        return listener;
    }

    unsubscribeFromGame(pin) {
        const key = `game_${pin}`;
        if (this.listeners.has(key)) {
            const { ref: gameRef } = this.listeners.get(key);
            off(gameRef);
            this.listeners.delete(key);
        }
    }

    async updateGameStatus(pin, status) {
        const gameRef = ref(database, `games/${pin}/status`);
        await set(gameRef, status);
    }

    async setGameQuestions(pin, questions) {
        const gameRef = ref(database, `games/${pin}/questions`);
        await set(gameRef, questions);
    }

    async advanceQuestion(pin, questionIndex) {
        const updates = {
            [`games/${pin}/currentQuestion`]: questionIndex,
            [`games/${pin}/status`]: 'question'
        };
        await update(ref(database), updates);
    }

    async submitAnswer(pin, playerId, questionIndex, answerIndex, timeRemaining, maxTime) {
        const answerRef = ref(database, `games/${pin}/answers/${questionIndex}/${playerId}`);
        
        await set(answerRef, {
            answer: answerIndex,
            timeRemaining: timeRemaining,
            submittedAt: rtdbTimestamp()
        });
    }

    async updatePlayerScore(pin, playerId, score, streak) {
        const updates = {
            [`games/${pin}/players/${playerId}/score`]: score,
            [`games/${pin}/players/${playerId}/streak`]: streak
        };
        await update(ref(database), updates);
    }

    async deleteGame(pin) {
        const gameRef = ref(database, `games/${pin}`);
        await remove(gameRef);
    }

    // ==========================================
    // Questions (Firestore)
    // ==========================================

    async createQuestion(questionData) {
        const questionsRef = collection(firestore, 'questions');
        const docRef = await addDoc(questionsRef, {
            ...questionData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }

    async getQuestion(questionId) {
        const docRef = doc(firestore, 'questions', questionId);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
            return null;
        }
        
        return { id: snapshot.id, ...snapshot.data() };
    }

    async getAllQuestions() {
        const questionsRef = collection(firestore, 'questions');
        const snapshot = await getDocs(questionsRef);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async getQuestionsByCategory(categoryId) {
        const questionsRef = collection(firestore, 'questions');
        const q = query(questionsRef, where('category', '==', categoryId));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async updateQuestion(questionId, questionData) {
        const docRef = doc(firestore, 'questions', questionId);
        await updateDoc(docRef, {
            ...questionData,
            updatedAt: serverTimestamp()
        });
    }

    async deleteQuestion(questionId) {
        const docRef = doc(firestore, 'questions', questionId);
        await deleteDoc(docRef);
    }

    // ==========================================
    // Quizzes (Firestore)
    // ==========================================

    async createQuiz(quizData) {
        const quizzesRef = collection(firestore, 'quizzes');
        const docRef = await addDoc(quizzesRef, {
            ...quizData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }

    async getQuiz(quizId) {
        const docRef = doc(firestore, 'quizzes', quizId);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
            return null;
        }
        
        return { id: snapshot.id, ...snapshot.data() };
    }

    async getAllQuizzes() {
        const quizzesRef = collection(firestore, 'quizzes');
        const snapshot = await getDocs(quizzesRef);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async updateQuiz(quizId, quizData) {
        const docRef = doc(firestore, 'quizzes', quizId);
        await updateDoc(docRef, {
            ...quizData,
            updatedAt: serverTimestamp()
        });
    }

    async deleteQuiz(quizId) {
        const docRef = doc(firestore, 'quizzes', quizId);
        await deleteDoc(docRef);
    }

    async getQuizQuestions(quizId) {
        const quiz = await this.getQuiz(quizId);
        if (!quiz || !quiz.questionIds) {
            return [];
        }

        const questions = [];
        for (const qId of quiz.questionIds) {
            const question = await this.getQuestion(qId);
            if (question) {
                questions.push(question);
            }
        }
        
        return questions;
    }

    // ==========================================
    // Categories (Firestore)
    // ==========================================

    async createCategory(categoryData) {
        const categoriesRef = collection(firestore, 'categories');
        const docRef = await addDoc(categoriesRef, {
            ...categoryData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }

    async getAllCategories() {
        const categoriesRef = collection(firestore, 'categories');
        const snapshot = await getDocs(categoriesRef);
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async updateCategory(categoryId, categoryData) {
        const docRef = doc(firestore, 'categories', categoryId);
        await updateDoc(docRef, categoryData);
    }

    async deleteCategory(categoryId) {
        const docRef = doc(firestore, 'categories', categoryId);
        await deleteDoc(docRef);
    }

    // ==========================================
    // Statistics (Firestore)
    // ==========================================

    async logGameResult(gameData) {
        const gamesRef = collection(firestore, 'gameHistory');
        await addDoc(gamesRef, {
            ...gameData,
            playedAt: serverTimestamp()
        });
    }

    async getGameHistory(limit = 20) {
        const gamesRef = collection(firestore, 'gameHistory');
        const q = query(gamesRef, orderBy('playedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.slice(0, limit).map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async getStatistics() {
        const stats = {
            totalGames: 0,
            totalPlayers: 0,
            totalQuestions: 0,
            totalQuizzes: 0
        };

        try {
            // Count questions
            const questionsSnapshot = await getDocs(collection(firestore, 'questions'));
            stats.totalQuestions = questionsSnapshot.size;

            // Count quizzes
            const quizzesSnapshot = await getDocs(collection(firestore, 'quizzes'));
            stats.totalQuizzes = quizzesSnapshot.size;

            // Count game history
            const gamesSnapshot = await getDocs(collection(firestore, 'gameHistory'));
            stats.totalGames = gamesSnapshot.size;
            
            // Sum players from game history
            gamesSnapshot.docs.forEach(doc => {
                const game = doc.data();
                stats.totalPlayers += game.playerCount || 0;
            });
        } catch (error) {
            console.error('Error getting statistics:', error);
        }

        return stats;
    }

    // ==========================================
    // Initial Data Setup
    // ==========================================

    async initializeDefaultData() {
        // Check if categories exist
        const categories = await this.getAllCategories();
        
        if (categories.length === 0) {
            // Create default categories
            const defaultCategories = [
                { name: 'General Knowledge', icon: '🎯', color: '#6366f1' },
                { name: 'History', icon: '📜', color: '#8b5cf6' },
                { name: 'Geography', icon: '🌍', color: '#10b981' },
                { name: 'Science', icon: '🔬', color: '#3b82f6' },
                { name: 'Sports', icon: '⚽', color: '#f59e0b' },
                { name: 'Music', icon: '🎵', color: '#ec4899' },
                { name: 'Movies & TV', icon: '🎬', color: '#ef4444' },
                { name: 'Literature', icon: '📚', color: '#84cc16' },
                { name: 'Art', icon: '🎨', color: '#f97316' },
                { name: 'Food & Drink', icon: '🍕', color: '#14b8a6' },
                { name: 'Nature & Animals', icon: '🦁', color: '#22c55e' },
                { name: 'Technology', icon: '💻', color: '#0ea5e9' },
                { name: 'Christmas', icon: '🎄', color: '#dc2626' }
            ];

            for (const cat of defaultCategories) {
                await this.createCategory(cat);
            }
        }

        // Check if there are any questions
        const questions = await this.getAllQuestions();
        
        if (questions.length === 0) {
            // Import sample questions
            await this.importSampleQuestions();
        }
    }

    async importSampleQuestions() {
        // This will be populated with sample questions
        // See question-data.js for the sample data
        console.log('Sample questions would be imported here');
    }
}

// Export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
