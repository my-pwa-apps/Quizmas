// ==========================================
// QUIZMAS - Sound Manager
// Procedurally generated interface sounds using Web Audio API
// ==========================================

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.5;
        
        // Initialize on first user interaction (required by browsers)
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('🔊 Sound manager initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.enabled = false;
        }
    }

    // Ensure audio context is running (after user interaction)
    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // ==========================================
    // Core Sound Generation
    // ==========================================

    createOscillator(frequency, type = 'sine', duration = 0.1) {
        if (!this.enabled || !this.audioContext) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator, gainNode };
    }

    playTone(frequency, duration = 0.1, type = 'sine', delay = 0) {
        if (!this.enabled || !this.audioContext) return;
        
        const startTime = this.audioContext.currentTime + delay;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.1);
    }

    // Play a sequence of notes
    playMelody(notes, baseDelay = 0) {
        let time = baseDelay;
        notes.forEach(note => {
            this.playTone(note.freq, note.duration || 0.15, note.type || 'sine', time);
            time += note.duration || 0.15;
        });
    }

    // ==========================================
    // Interface Sounds
    // ==========================================

    // Correct answer - happy ascending arpeggio
    playCorrect() {
        this.init();
        this.resume();
        
        const notes = [
            { freq: 523.25, duration: 0.08 },  // C5
            { freq: 659.25, duration: 0.08 },  // E5
            { freq: 783.99, duration: 0.08 },  // G5
            { freq: 1046.50, duration: 0.2 }   // C6
        ];
        this.playMelody(notes);
    }

    // Wrong answer - descending sad tone
    playWrong() {
        this.init();
        this.resume();
        
        const notes = [
            { freq: 400, duration: 0.15, type: 'sawtooth' },
            { freq: 300, duration: 0.25, type: 'sawtooth' }
        ];
        this.playMelody(notes);
    }

    // Timer tick - short click
    playTick() {
        this.init();
        this.resume();
        
        this.playTone(800, 0.03, 'square');
    }

    // Countdown warning (last 5 seconds) - urgent beeps
    playCountdown() {
        this.init();
        this.resume();
        
        this.playTone(880, 0.1, 'sine');
    }

    // Time's up - alarm sound
    playTimesUp() {
        this.init();
        this.resume();
        
        const notes = [
            { freq: 440, duration: 0.15, type: 'square' },
            { freq: 0, duration: 0.05 },
            { freq: 440, duration: 0.15, type: 'square' },
            { freq: 0, duration: 0.05 },
            { freq: 440, duration: 0.3, type: 'square' }
        ];
        
        // Custom implementation for rest notes
        let time = 0;
        notes.forEach(note => {
            if (note.freq > 0) {
                this.playTone(note.freq, note.duration, note.type, time);
            }
            time += note.duration;
        });
    }

    // Player joined - friendly pop
    playJoin() {
        this.init();
        this.resume();
        
        this.playTone(600, 0.05, 'sine');
        this.playTone(900, 0.1, 'sine', 0.05);
    }

    // Answer reveal - dramatic reveal sound
    playReveal() {
        this.init();
        this.resume();
        
        const notes = [
            { freq: 200, duration: 0.1, type: 'triangle' },
            { freq: 400, duration: 0.1, type: 'triangle' },
            { freq: 600, duration: 0.15, type: 'triangle' }
        ];
        this.playMelody(notes);
    }

    // Winner celebration - victory fanfare
    playWinner() {
        this.init();
        this.resume();
        
        // Triumphant fanfare melody
        const notes = [
            { freq: 523.25, duration: 0.15 },  // C5
            { freq: 523.25, duration: 0.15 },  // C5
            { freq: 523.25, duration: 0.15 },  // C5
            { freq: 659.25, duration: 0.4 },   // E5
            { freq: 587.33, duration: 0.15 },  // D5
            { freq: 587.33, duration: 0.15 },  // D5
            { freq: 587.33, duration: 0.15 },  // D5
            { freq: 783.99, duration: 0.5 }    // G5
        ];
        this.playMelody(notes);
    }

    // Button click - subtle feedback
    playClick() {
        this.init();
        this.resume();
        
        this.playTone(600, 0.02, 'sine');
    }

    // Game start - exciting countdown
    playGameStart() {
        this.init();
        this.resume();
        
        const notes = [
            { freq: 440, duration: 0.2 },
            { freq: 554.37, duration: 0.2 },
            { freq: 659.25, duration: 0.2 },
            { freq: 880, duration: 0.4 }
        ];
        this.playMelody(notes);
    }

    // Question appear - attention getter
    playQuestion() {
        this.init();
        this.resume();
        
        this.playTone(880, 0.1, 'triangle');
        this.playTone(1100, 0.15, 'triangle', 0.1);
    }

    // Streak bonus sound
    playStreak() {
        this.init();
        this.resume();
        
        const notes = [
            { freq: 800, duration: 0.05 },
            { freq: 1000, duration: 0.05 },
            { freq: 1200, duration: 0.05 },
            { freq: 1400, duration: 0.1 }
        ];
        this.playMelody(notes);
    }

    // Leaderboard position change
    playPositionUp() {
        this.init();
        this.resume();
        
        this.playTone(600, 0.08, 'sine');
        this.playTone(800, 0.12, 'sine', 0.08);
    }

    playPositionDown() {
        this.init();
        this.resume();
        
        this.playTone(500, 0.08, 'sine');
        this.playTone(350, 0.12, 'sine', 0.08);
    }

    // ==========================================
    // Settings
    // ==========================================

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Export singleton
const soundManager = new SoundManager();
export default soundManager;
