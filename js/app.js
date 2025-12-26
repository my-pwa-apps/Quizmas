// ==========================================
// QUIZMAS - Main App Entry Point
// For player/join view
// ==========================================

import PlayerController from './player-controller.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const playerController = new PlayerController();
    playerController.init();
});
