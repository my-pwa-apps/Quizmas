// ==========================================
// QUIZMAS - Admin Controller
// Controls the admin panel
// ==========================================

import firebaseService from './firebase-service.js';
import themeManager from './theme-manager.js';
import questionGenerator from './question-generator.js';

class AdminController {
    constructor() {
        this.currentTab = 'quizzes';
        this.categories = [];
        this.questions = [];
        this.quizzes = [];
        this.editingQuestionId = null;
        this.editingQuizId = null;
        this.generatedQuestions = [];
    }

    async init() {
        // Initialize theme
        themeManager.init();

        // Check authentication
        const loggedIn = await this.checkAuth();
        
        if (!loggedIn) {
            this.setupLoginListeners();
        } else {
            await this.loadDashboard();
        }

        console.log('Admin controller initialized');
    }

    async checkAuth() {
        // For demo purposes, check localStorage
        const isLoggedIn = localStorage.getItem('quizmas_admin_logged_in');
        
        if (isLoggedIn) {
            this.showScreen('admin-dashboard');
            return true;
        }
        
        return false;
    }

    setupLoginListeners() {
        document.getElementById('btn-admin-login').addEventListener('click', () => this.login());
        
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.login();
            }
        });
    }

    async login() {
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;

        // Simple demo login
        if (email === 'admin@quizmas.app' && password === 'admin123') {
            localStorage.setItem('quizmas_admin_logged_in', 'true');
            this.showScreen('admin-dashboard');
            await this.loadDashboard();
        } else {
            document.getElementById('login-error').textContent = 'Invalid email or password';
        }
    }

    logout() {
        localStorage.removeItem('quizmas_admin_logged_in');
        window.location.reload();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    async loadDashboard() {
        // Set up navigation
        this.setupNavigation();
        
        // Set up all listeners
        this.setupQuizListeners();
        this.setupQuestionListeners();
        this.setupCategoryListeners();
        this.setupGenerateListeners();
        
        // Logout button
        document.getElementById('btn-logout').addEventListener('click', () => this.logout());

        // Initialize default data if needed
        await firebaseService.initializeDefaultData();

        // Load all data
        await this.loadAllData();

        // Load stats
        await this.loadStatistics();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Show corresponding tab
                const tabId = btn.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.getElementById(`tab-${tabId}`).classList.add('active');
                
                this.currentTab = tabId;
            });
        });
    }

    async loadAllData() {
        try {
            // Load categories
            this.categories = await firebaseService.getAllCategories();
            this.populateCategorySelects();
            this.renderCategories();

            // Load questions
            this.questions = await firebaseService.getAllQuestions();
            this.renderQuestions();

            // Load quizzes
            this.quizzes = await firebaseService.getAllQuizzes();
            this.renderQuizzes();

        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    // ==========================================
    // Categories
    // ==========================================

    setupCategoryListeners() {
        document.getElementById('btn-new-category').addEventListener('click', () => {
            this.openCategoryModal();
        });

        document.getElementById('close-category-modal').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        document.getElementById('btn-save-category').addEventListener('click', () => {
            this.saveCategory();
        });
    }

    populateCategorySelects() {
        const selects = [
            document.getElementById('q-category'),
            document.getElementById('filter-category'),
            document.getElementById('quiz-filter-category')
        ];

        selects.forEach(select => {
            if (!select) return;
            
            const currentValue = select.value;
            select.innerHTML = '<option value="">All Categories</option>';
            
            this.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = `${cat.icon} ${cat.name}`;
                select.appendChild(option);
            });

            if (currentValue) {
                select.value = currentValue;
            }
        });
    }

    renderCategories() {
        const container = document.getElementById('categories-list');
        
        container.innerHTML = this.categories.map(cat => `
            <div class="category-card" data-id="${cat.id}">
                <div class="category-color" style="background: ${cat.color}"></div>
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${this.getQuestionCountForCategory(cat.id)} questions</div>
            </div>
        `).join('');
    }

    getQuestionCountForCategory(categoryId) {
        return this.questions.filter(q => q.category === categoryId).length;
    }

    openCategoryModal() {
        document.getElementById('cat-name').value = '';
        document.getElementById('cat-icon').value = '🎯';
        document.getElementById('cat-color').value = '#6366f1';
        document.getElementById('category-modal').classList.add('active');
    }

    closeCategoryModal() {
        document.getElementById('category-modal').classList.remove('active');
    }

    async saveCategory() {
        const name = document.getElementById('cat-name').value.trim();
        const icon = document.getElementById('cat-icon').value.trim() || '🎯';
        const color = document.getElementById('cat-color').value;

        if (!name) {
            alert('Please enter a category name');
            return;
        }

        try {
            await firebaseService.createCategory({ name, icon, color });
            this.closeCategoryModal();
            await this.loadAllData();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category');
        }
    }

    // ==========================================
    // Questions
    // ==========================================

    setupQuestionListeners() {
        document.getElementById('btn-new-question').addEventListener('click', () => {
            this.openQuestionModal();
        });

        document.getElementById('close-question-modal').addEventListener('click', () => {
            this.closeQuestionModal();
        });

        document.getElementById('btn-save-question').addEventListener('click', () => {
            this.saveQuestion();
        });

        document.getElementById('btn-cancel-question').addEventListener('click', () => {
            this.closeQuestionModal();
        });

        // Question type selector
        document.querySelectorAll('.qtype-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.qtype-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchQuestionType(btn.dataset.type);
            });
        });

        // True/False button handlers
        document.querySelectorAll('.tf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Order items - add/remove
        document.getElementById('btn-add-order-item')?.addEventListener('click', () => {
            this.addOrderItem();
        });

        // Media type selector
        document.querySelectorAll('.media-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.media-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const mediaInput = document.getElementById('media-input-container');
                if (btn.dataset.type === 'none') {
                    mediaInput.classList.add('hidden');
                } else {
                    mediaInput.classList.remove('hidden');
                }
            });
        });

        // Filters
        document.getElementById('filter-category').addEventListener('change', () => this.filterQuestions());
        document.getElementById('filter-type').addEventListener('change', () => this.filterQuestions());
        document.getElementById('search-questions').addEventListener('input', () => this.filterQuestions());
    }

    switchQuestionType(type) {
        // Hide all answer editors
        document.querySelectorAll('.answer-editor').forEach(editor => {
            editor.style.display = 'none';
        });
        
        // Show the selected type's editor
        const editorId = {
            'quiz': 'quiz-answers',
            'truefalse': 'truefalse-answer',
            'type': 'type-answer',
            'slider': 'slider-answer',
            'order': 'order-answer'
        }[type];
        
        const editor = document.getElementById(editorId);
        if (editor) {
            editor.style.display = 'block';
        }
    }

    addOrderItem() {
        const list = document.getElementById('order-items-list');
        if (!list) return;
        
        const count = list.querySelectorAll('.order-item').length + 1;
        const item = document.createElement('div');
        item.className = 'order-item';
        item.innerHTML = `
            <span class="order-num">${count}</span>
            <input type="text" class="order-item-input" placeholder="Item ${count}...">
            <button type="button" class="btn-remove-order" onclick="this.parentElement.remove()">×</button>
        `;
        list.appendChild(item);
    }

    removeOrderItem(button) {
        button.parentElement.remove();
        // Renumber items
        const list = document.getElementById('order-items-list');
        list.querySelectorAll('.order-item').forEach((item, index) => {
            item.querySelector('.order-num').textContent = index + 1;
        });
    }

    renderQuestions() {
        const container = document.getElementById('questions-list');
        
        container.innerHTML = this.questions.map(q => {
            const category = this.categories.find(c => c.id === q.category);
            const categoryName = category ? category.name : 'Uncategorized';
            const typeIcon = this.getMediaTypeIcon(q.mediaType);
            
            return `
                <div class="question-card" data-id="${q.id}">
                    <div class="question-type-icon">${typeIcon}</div>
                    <div class="question-info">
                        <div class="question-text-preview">${this.escapeHtml(q.text)}</div>
                        <div class="question-meta">
                            <span>${categoryName}</span>
                            <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
                        </div>
                    </div>
                    <div class="quiz-actions">
                        <button class="btn-icon-only edit-question" data-id="${q.id}" title="Edit">✏️</button>
                        <button class="btn-icon-only delete delete-question" data-id="${q.id}" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        container.querySelectorAll('.edit-question').forEach(btn => {
            btn.addEventListener('click', () => this.editQuestion(btn.dataset.id));
        });

        container.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', () => this.deleteQuestion(btn.dataset.id));
        });
    }

    getMediaTypeIcon(mediaType) {
        switch (mediaType) {
            case 'image': return '🖼️';
            case 'video': return '🎬';
            case 'audio': return '🎵';
            default: return '📝';
        }
    }

    filterQuestions() {
        const categoryFilter = document.getElementById('filter-category').value;
        const typeFilter = document.getElementById('filter-type').value;
        const searchTerm = document.getElementById('search-questions').value.toLowerCase();

        const filtered = this.questions.filter(q => {
            if (categoryFilter && q.category !== categoryFilter) return false;
            if (typeFilter && (q.mediaType || 'text') !== typeFilter) return false;
            if (searchTerm && !q.text.toLowerCase().includes(searchTerm)) return false;
            return true;
        });

        // Re-render with filtered list
        const container = document.getElementById('questions-list');
        container.innerHTML = filtered.map(q => {
            const category = this.categories.find(c => c.id === q.category);
            const categoryName = category ? category.name : 'Uncategorized';
            const typeIcon = this.getMediaTypeIcon(q.mediaType);
            
            return `
                <div class="question-card" data-id="${q.id}">
                    <div class="question-type-icon">${typeIcon}</div>
                    <div class="question-info">
                        <div class="question-text-preview">${this.escapeHtml(q.text)}</div>
                        <div class="question-meta">
                            <span>${categoryName}</span>
                            <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
                        </div>
                    </div>
                    <div class="quiz-actions">
                        <button class="btn-icon-only edit-question" data-id="${q.id}" title="Edit">✏️</button>
                        <button class="btn-icon-only delete delete-question" data-id="${q.id}" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openQuestionModal(question = null) {
        this.editingQuestionId = question ? question.id : null;
        
        document.getElementById('modal-title').textContent = question ? 'Vraag Bewerken' : 'Nieuwe Vraag';
        
        // Reset form
        document.getElementById('q-category').value = question?.category || '';
        document.getElementById('q-difficulty').value = question?.difficulty || 'medium';
        document.getElementById('q-text').value = question?.text || '';
        document.getElementById('q-explanation').value = question?.explanation || '';
        document.getElementById('q-time').value = question?.timeLimit || 20;

        // Question type
        const questionType = question?.questionType || 'quiz';
        document.querySelectorAll('.qtype-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === questionType);
        });
        this.switchQuestionType(questionType);

        // Media
        document.querySelectorAll('.media-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === (question?.mediaType || 'none'));
        });
        document.getElementById('q-media-url').value = question?.mediaUrl || '';
        document.getElementById('media-input-container').classList.toggle('hidden', !question?.mediaType || question.mediaType === 'none');

        // Quiz answers
        const answers = question?.answers || ['', '', '', ''];
        for (let i = 0; i < 4; i++) {
            const input = document.getElementById(`q-answer-${i}`);
            if (input) input.value = answers[i] || '';
        }
        const correctIndex = question?.correctIndex || 0;
        const correctRadio = document.querySelector(`input[name="correct"][value="${correctIndex}"]`);
        if (correctRadio) correctRadio.checked = true;

        // True/False answer
        const tfAnswer = question?.correctAnswer === true || question?.correctAnswer === 'true';
        document.querySelectorAll('.tf-btn').forEach(btn => {
            btn.classList.toggle('active', (btn.dataset.value === 'true') === tfAnswer);
        });

        // Type answer
        const typeInput = document.getElementById('q-type-correct');
        if (typeInput) typeInput.value = question?.correctAnswer || '';

        // Slider settings
        const sliderMin = document.getElementById('slider-min');
        const sliderMax = document.getElementById('slider-max');
        const sliderCorrect = document.getElementById('slider-correct');
        const sliderTolerance = document.getElementById('slider-tolerance');
        if (sliderMin) sliderMin.value = question?.sliderMin || 0;
        if (sliderMax) sliderMax.value = question?.sliderMax || 100;
        if (sliderCorrect) sliderCorrect.value = question?.correctAnswer || 50;
        if (sliderTolerance) sliderTolerance.value = question?.tolerance || 5;

        // Order items
        const orderList = document.getElementById('order-items-list');
        if (orderList) {
            orderList.innerHTML = '';
            const orderItems = question?.orderItems || ['', '', ''];
            orderItems.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'order-item';
                div.innerHTML = `
                    <span class="order-num">${index + 1}</span>
                    <input type="text" class="order-item-input" placeholder="Item ${index + 1}..." value="${this.escapeHtml(item)}">
                    <button type="button" class="btn-remove-order" onclick="this.parentElement.remove()">×</button>
                `;
                orderList.appendChild(div);
            });
        }

        document.getElementById('question-modal').classList.add('active');
    }

    closeQuestionModal() {
        document.getElementById('question-modal').classList.remove('active');
        this.editingQuestionId = null;
    }

    async editQuestion(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (question) {
            this.openQuestionModal(question);
        }
    }

    async deleteQuestion(questionId) {
        if (confirm('Are you sure you want to delete this question?')) {
            try {
                await firebaseService.deleteQuestion(questionId);
                await this.loadAllData();
            } catch (error) {
                console.error('Failed to delete question:', error);
                alert('Failed to delete question');
            }
        }
    }

    async saveQuestion() {
        const questionType = document.querySelector('.qtype-btn.active')?.dataset.type || 'quiz';
        
        const questionData = {
            questionType: questionType,
            category: document.getElementById('q-category').value,
            difficulty: document.getElementById('q-difficulty').value,
            text: document.getElementById('q-text').value.trim(),
            explanation: document.getElementById('q-explanation').value.trim(),
            timeLimit: parseInt(document.getElementById('q-time').value) || 20,
            mediaType: document.querySelector('.media-btn.active')?.dataset.type || 'none',
            mediaUrl: document.getElementById('q-media-url').value.trim()
        };

        // Type-specific data
        if (questionType === 'quiz') {
            questionData.answers = [
                document.getElementById('q-answer-0')?.value.trim(),
                document.getElementById('q-answer-1')?.value.trim(),
                document.getElementById('q-answer-2')?.value.trim(),
                document.getElementById('q-answer-3')?.value.trim()
            ].filter(a => a);
            questionData.correctIndex = parseInt(document.querySelector('input[name="correct"]:checked')?.value || 0);
        } else if (questionType === 'truefalse') {
            const tfActive = document.querySelector('.tf-btn.active');
            questionData.correctAnswer = tfActive?.dataset.value === 'true';
        } else if (questionType === 'type') {
            questionData.correctAnswer = document.getElementById('q-type-correct')?.value.trim() || '';
        } else if (questionType === 'slider') {
            questionData.sliderMin = parseInt(document.getElementById('slider-min')?.value) || 0;
            questionData.sliderMax = parseInt(document.getElementById('slider-max')?.value) || 100;
            questionData.correctAnswer = parseInt(document.getElementById('slider-correct')?.value) || 50;
            questionData.tolerance = parseInt(document.getElementById('slider-tolerance')?.value) || 5;
        } else if (questionType === 'order') {
            const orderInputs = document.querySelectorAll('.order-item-input');
            questionData.orderItems = Array.from(orderInputs).map(input => input.value.trim()).filter(v => v);
        }

        // Validation
        if (!questionData.text) {
            alert('Voer een vraag in');
            return;
        }

        if (questionType === 'quiz') {
            if (questionData.answers.length < 2) {
                alert('Geef minimaal 2 antwoorden');
                return;
            }
            if (questionData.correctIndex >= questionData.answers.length) {
                alert('Selecteer een geldig correct antwoord');
                return;
            }
        } else if (questionType === 'type') {
            if (!questionData.correctAnswer) {
                alert('Voer het juiste antwoord in');
                return;
            }
        } else if (questionType === 'order') {
            if (questionData.orderItems.length < 2) {
                alert('Voeg minimaal 2 items toe voor volgorde');
                return;
            }
        }

        try {
            if (this.editingQuestionId) {
                await firebaseService.updateQuestion(this.editingQuestionId, questionData);
            } else {
                await firebaseService.createQuestion(questionData);
            }
            
            this.closeQuestionModal();
            await this.loadAllData();
        } catch (error) {
            console.error('Failed to save question:', error);
            alert('Failed to save question');
        }
    }

    // ==========================================
    // Quizzes
    // ==========================================

    setupQuizListeners() {
        document.getElementById('btn-new-quiz').addEventListener('click', () => {
            this.openQuizModal();
        });

        document.getElementById('close-quiz-modal').addEventListener('click', () => {
            this.closeQuizModal();
        });

        document.getElementById('btn-save-quiz').addEventListener('click', () => {
            this.saveQuiz();
        });

        document.getElementById('btn-cancel-quiz').addEventListener('click', () => {
            this.closeQuizModal();
        });

        // Quiz question filters
        document.getElementById('quiz-filter-category').addEventListener('change', () => {
            this.populateQuizQuestions();
        });

        document.getElementById('quiz-search-questions').addEventListener('input', () => {
            this.populateQuizQuestions();
        });
    }

    renderQuizzes() {
        const container = document.getElementById('quizzes-list');
        
        container.innerHTML = this.quizzes.map(quiz => `
            <div class="quiz-card" data-id="${quiz.id}">
                <img class="quiz-image" src="${quiz.image || 'assets/quiz-placeholder.png'}" alt="${quiz.name}">
                <div class="quiz-info">
                    <div class="quiz-name">${this.escapeHtml(quiz.name)}</div>
                    <div class="quiz-meta">${quiz.questionIds?.length || 0} questions • ${quiz.description || ''}</div>
                </div>
                <div class="quiz-actions">
                    <button class="btn-icon-only edit-quiz" data-id="${quiz.id}" title="Edit">✏️</button>
                    <button class="btn-icon-only delete delete-quiz" data-id="${quiz.id}" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.edit-quiz').forEach(btn => {
            btn.addEventListener('click', () => this.editQuiz(btn.dataset.id));
        });

        container.querySelectorAll('.delete-quiz').forEach(btn => {
            btn.addEventListener('click', () => this.deleteQuiz(btn.dataset.id));
        });
    }

    openQuizModal(quiz = null) {
        this.editingQuizId = quiz ? quiz.id : null;
        
        document.getElementById('quiz-modal-title').textContent = quiz ? 'Edit Quiz' : 'New Quiz';
        
        document.getElementById('quiz-name').value = quiz?.name || '';
        document.getElementById('quiz-description').value = quiz?.description || '';
        document.getElementById('quiz-image').value = quiz?.image || '';

        this.populateQuizQuestions(quiz?.questionIds || []);

        document.getElementById('quiz-modal').classList.add('active');
    }

    closeQuizModal() {
        document.getElementById('quiz-modal').classList.remove('active');
        this.editingQuizId = null;
    }

    populateQuizQuestions(selectedIds = []) {
        const categoryFilter = document.getElementById('quiz-filter-category').value;
        const searchTerm = document.getElementById('quiz-search-questions').value.toLowerCase();

        let filtered = this.questions;
        
        if (categoryFilter) {
            filtered = filtered.filter(q => q.category === categoryFilter);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(q => q.text.toLowerCase().includes(searchTerm));
        }

        const container = document.getElementById('available-questions');
        container.innerHTML = filtered.map(q => `
            <label class="question-checkbox">
                <input type="checkbox" value="${q.id}" ${selectedIds.includes(q.id) ? 'checked' : ''}>
                <span>${this.escapeHtml(q.text.substring(0, 80))}${q.text.length > 80 ? '...' : ''}</span>
            </label>
        `).join('');

        // Update count
        this.updateSelectedQuestionCount();

        // Add change listeners
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => this.updateSelectedQuestionCount());
        });
    }

    updateSelectedQuestionCount() {
        const count = document.querySelectorAll('#available-questions input:checked').length;
        document.getElementById('selected-question-count').textContent = count;
    }

    async editQuiz(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (quiz) {
            this.openQuizModal(quiz);
        }
    }

    async deleteQuiz(quizId) {
        if (confirm('Are you sure you want to delete this quiz?')) {
            try {
                await firebaseService.deleteQuiz(quizId);
                await this.loadAllData();
            } catch (error) {
                console.error('Failed to delete quiz:', error);
                alert('Failed to delete quiz');
            }
        }
    }

    async saveQuiz() {
        const selectedQuestions = Array.from(
            document.querySelectorAll('#available-questions input:checked')
        ).map(cb => cb.value);

        const quizData = {
            name: document.getElementById('quiz-name').value.trim(),
            description: document.getElementById('quiz-description').value.trim(),
            image: document.getElementById('quiz-image').value.trim(),
            questionIds: selectedQuestions
        };

        if (!quizData.name) {
            alert('Please enter a quiz name');
            return;
        }

        if (selectedQuestions.length < 1) {
            alert('Please select at least 1 question');
            return;
        }

        try {
            if (this.editingQuizId) {
                await firebaseService.updateQuiz(this.editingQuizId, quizData);
            } else {
                await firebaseService.createQuiz(quizData);
            }
            
            this.closeQuizModal();
            await this.loadAllData();
        } catch (error) {
            console.error('Failed to save quiz:', error);
            alert('Failed to save quiz');
        }
    }

    // ==========================================
    // Question Generator
    // ==========================================

    setupGenerateListeners() {
        document.getElementById('btn-generate').addEventListener('click', () => this.generateQuestions());
        document.getElementById('btn-save-generated').addEventListener('click', () => this.saveGeneratedQuestions());
        document.getElementById('btn-discard-generated').addEventListener('click', () => this.discardGeneratedQuestions());
    }

    async generateQuestions() {
        const category = document.getElementById('gen-category').value;
        const difficulty = document.getElementById('gen-difficulty').value;
        const count = parseInt(document.getElementById('gen-count').value) || 10;

        try {
            document.getElementById('btn-generate').disabled = true;
            document.getElementById('btn-generate').textContent = '⏳ Generating...';

            this.generatedQuestions = await questionGenerator.generate(category, difficulty, count);
            
            this.renderGeneratedQuestions();
            document.getElementById('generated-preview').classList.remove('hidden');

        } catch (error) {
            console.error('Failed to generate questions:', error);
            alert('Failed to generate questions');
        } finally {
            document.getElementById('btn-generate').disabled = false;
            document.getElementById('btn-generate').textContent = '🎲 Generate Questions';
        }
    }

    renderGeneratedQuestions() {
        const container = document.getElementById('preview-list');
        
        container.innerHTML = this.generatedQuestions.map((q, index) => `
            <div class="preview-question">
                <div class="q-text">${index + 1}. ${this.escapeHtml(q.text)}</div>
                <div class="q-answers">
                    ${q.answers.map((a, i) => `
                        <span class="${i === q.correctIndex ? 'correct' : ''}">${this.escapeHtml(a)}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    async saveGeneratedQuestions() {
        try {
            for (const question of this.generatedQuestions) {
                await firebaseService.createQuestion(question);
            }
            
            this.discardGeneratedQuestions();
            await this.loadAllData();
            alert(`Successfully saved ${this.generatedQuestions.length} questions!`);
            
        } catch (error) {
            console.error('Failed to save questions:', error);
            alert('Failed to save questions');
        }
    }

    discardGeneratedQuestions() {
        this.generatedQuestions = [];
        document.getElementById('generated-preview').classList.add('hidden');
    }

    // ==========================================
    // Statistics
    // ==========================================

    async loadStatistics() {
        try {
            const stats = await firebaseService.getStatistics();
            
            document.getElementById('stat-total-games').textContent = stats.totalGames;
            document.getElementById('stat-total-players').textContent = stats.totalPlayers;
            document.getElementById('stat-total-questions').textContent = stats.totalQuestions;
            document.getElementById('stat-total-quizzes').textContent = stats.totalQuizzes;

            // Load recent games
            const recentGames = await firebaseService.getGameHistory(10);
            this.renderRecentGames(recentGames);

        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    }

    renderRecentGames(games) {
        const container = document.getElementById('recent-games-list');
        
        if (games.length === 0) {
            container.innerHTML = '<p class="no-data">No games played yet</p>';
            return;
        }

        container.innerHTML = games.map(game => {
            const date = game.playedAt?.toDate?.() || new Date();
            return `
                <div class="quiz-card">
                    <div class="quiz-info">
                        <div class="quiz-name">Game #${game.pin}</div>
                        <div class="quiz-meta">
                            ${game.playerCount} players • ${game.questionCount} questions • 
                            ${date.toLocaleDateString()}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const adminController = new AdminController();
    adminController.init();
});
