// ==========================================
// QUIZMAS - Theme Manager
// Handles calendar-based seasonal themes
// ==========================================

class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.decorationsContainer = null;
        this.animationFrameId = null;
    }

    init() {
        this.decorationsContainer = document.getElementById('decorations');
        this.applySeasonalTheme();
        
        // Check theme every hour (in case date changes)
        setInterval(() => this.applySeasonalTheme(), 3600000);
    }

    getSeasonalTheme() {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const day = now.getDate();
        const year = now.getFullYear();

        // Christmas: December 20-26
        if (month === 12 && day >= 20 && day <= 26) {
            return 'christmas';
        }

        // New Year: December 27 - January 5
        if ((month === 12 && day >= 27) || (month === 1 && day <= 5)) {
            return 'newyear';
        }

        // Valentine's Day: February 10-14
        if (month === 2 && day >= 10 && day <= 14) {
            return 'valentine';
        }

        // St. Patrick's Day: March 14-17
        if (month === 3 && day >= 14 && day <= 17) {
            return 'stpatricks';
        }

        // Easter (approximate - changes yearly)
        const easter = this.getEasterDate(year);
        const easterStart = new Date(easter);
        easterStart.setDate(easter.getDate() - 3);
        const easterEnd = new Date(easter);
        easterEnd.setDate(easter.getDate() + 1);
        
        if (now >= easterStart && now <= easterEnd) {
            return 'easter';
        }

        // Halloween: October 25-31
        if (month === 10 && day >= 25 && day <= 31) {
            return 'halloween';
        }

        // Thanksgiving (US): November 20-28 (approximate)
        if (month === 11 && day >= 20 && day <= 28) {
            return 'thanksgiving';
        }

        // Summer: June 21 - August 31
        if ((month === 6 && day >= 21) || month === 7 || month === 8) {
            return 'summer';
        }

        // Default theme
        return 'default';
    }

    getEasterDate(year) {
        // Calculate Easter using Anonymous Gregorian algorithm
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(year, month - 1, day);
    }

    applySeasonalTheme() {
        const theme = this.getSeasonalTheme();
        
        if (theme === this.currentTheme) {
            return; // Theme hasn't changed
        }

        // Remove old theme class
        if (this.currentTheme) {
            document.body.classList.remove(`theme-${this.currentTheme}`);
        }

        // Apply new theme
        this.currentTheme = theme;
        document.body.classList.add(`theme-${theme}`);

        // Clear existing decorations
        this.clearDecorations();

        // Add theme-specific decorations
        switch (theme) {
            case 'christmas':
                this.addChristmasDecorations();
                break;
            case 'newyear':
                this.addNewYearDecorations();
                break;
            case 'valentine':
                this.addValentineDecorations();
                break;
            case 'halloween':
                this.addHalloweenDecorations();
                break;
            case 'thanksgiving':
                this.addThanksgivingDecorations();
                break;
            case 'stpatricks':
                this.addStPatricksDecorations();
                break;
            default:
                // No special decorations for default theme
                break;
        }

        console.log(`Applied theme: ${theme}`);
    }

    clearDecorations() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.decorationsContainer) {
            this.decorationsContainer.innerHTML = '';
        }
    }

    // ==========================================
    // Christmas Decorations
    // ==========================================
    
    addChristmasDecorations() {
        // Add Christmas lights
        this.addChristmasLights();
        
        // Add snowflakes
        this.startSnowfall();
    }

    addChristmasLights() {
        const lights = document.createElement('div');
        lights.className = 'christmas-lights';
        
        for (let i = 0; i < 20; i++) {
            const bulb = document.createElement('div');
            bulb.className = 'light-bulb';
            bulb.style.animationDelay = `${Math.random() * 2}s`;
            lights.appendChild(bulb);
        }
        
        this.decorationsContainer.appendChild(lights);
    }

    startSnowfall() {
        const snowflakes = ['❄', '❅', '❆', '✻', '✼'];
        
        const createSnowflake = () => {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.fontSize = `${0.8 + Math.random() * 1.5}rem`;
            snowflake.style.opacity = `${0.4 + Math.random() * 0.6}`;
            snowflake.style.animationDuration = `${5 + Math.random() * 10}s`;
            
            this.decorationsContainer.appendChild(snowflake);
            
            // Remove snowflake after animation
            setTimeout(() => {
                snowflake.remove();
            }, 15000);
        };

        // Create initial snowflakes
        for (let i = 0; i < 20; i++) {
            setTimeout(createSnowflake, i * 200);
        }

        // Keep creating snowflakes
        setInterval(createSnowflake, 500);
    }

    // ==========================================
    // New Year Decorations
    // ==========================================
    
    addNewYearDecorations() {
        this.startFireworks();
    }

    startFireworks() {
        const colors = ['#ffd700', '#ff1493', '#00ff00', '#00bfff', '#ff4500'];
        
        const createFirework = () => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework';
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.background = color;
                particle.style.boxShadow = `0 0 10px ${color}`;
                
                const angle = (i / 20) * 360;
                particle.style.setProperty('--angle', `${angle}deg`);
                
                this.decorationsContainer.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1500);
            }
        };

        setInterval(createFirework, 2000);
    }

    // ==========================================
    // Valentine's Decorations
    // ==========================================
    
    addValentineDecorations() {
        const hearts = ['❤', '💕', '💖', '💗', '💘'];
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.fontSize = `${1 + Math.random() * 2}rem`;
            heart.style.animationDelay = `${Math.random() * 4}s`;
            heart.style.animationDuration = `${3 + Math.random() * 3}s`;
            
            this.decorationsContainer.appendChild(heart);
        }
    }

    // ==========================================
    // Halloween Decorations
    // ==========================================
    
    addHalloweenDecorations() {
        // Add ghosts
        const ghosts = ['👻', '💀', '🦇'];
        for (let i = 0; i < 8; i++) {
            const ghost = document.createElement('div');
            ghost.className = 'ghost';
            ghost.textContent = ghosts[Math.floor(Math.random() * ghosts.length)];
            ghost.style.left = `${Math.random() * 90}%`;
            ghost.style.top = `${Math.random() * 80}%`;
            ghost.style.animationDelay = `${Math.random() * 6}s`;
            
            this.decorationsContainer.appendChild(ghost);
        }

        // Add pumpkins at the bottom
        for (let i = 0; i < 5; i++) {
            const pumpkin = document.createElement('div');
            pumpkin.className = 'pumpkin';
            pumpkin.textContent = '🎃';
            pumpkin.style.left = `${10 + i * 20}%`;
            pumpkin.style.bottom = '20px';
            pumpkin.style.animationDelay = `${Math.random() * 2}s`;
            
            this.decorationsContainer.appendChild(pumpkin);
        }
    }

    // ==========================================
    // Thanksgiving Decorations
    // ==========================================
    
    addThanksgivingDecorations() {
        const leaves = ['🍂', '🍁', '🍃'];
        
        const createLeaf = () => {
            const leaf = document.createElement('div');
            leaf.className = 'falling-leaf';
            leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.left = `${Math.random() * 100}%`;
            leaf.style.animationDuration = `${6 + Math.random() * 6}s`;
            
            this.decorationsContainer.appendChild(leaf);
            
            setTimeout(() => leaf.remove(), 12000);
        };

        // Create initial leaves
        for (let i = 0; i < 10; i++) {
            setTimeout(createLeaf, i * 300);
        }

        // Keep creating leaves
        setInterval(createLeaf, 1000);
    }

    // ==========================================
    // St. Patrick's Decorations
    // ==========================================
    
    addStPatricksDecorations() {
        const items = ['☘️', '🍀', '💚', '🌈'];
        
        for (let i = 0; i < 12; i++) {
            const item = document.createElement('div');
            item.className = 'shamrock';
            item.textContent = items[Math.floor(Math.random() * items.length)];
            item.style.left = `${Math.random() * 90}%`;
            item.style.top = `${Math.random() * 90}%`;
            item.style.animationDelay = `${Math.random() * 5}s`;
            item.style.animationDuration = `${4 + Math.random() * 3}s`;
            
            this.decorationsContainer.appendChild(item);
        }
    }

    // ==========================================
    // Confetti (for celebrations)
    // ==========================================
    
    startConfetti(duration = 5000) {
        const colors = ['#ff1493', '#00bfff', '#ffd700', '#00ff00', '#ff4500', '#9400d3'];
        let elapsed = 0;
        const interval = 50;
        
        const confettiInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                
                this.decorationsContainer.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 4000);
            }
            
            elapsed += interval;
            if (elapsed >= duration) {
                clearInterval(confettiInterval);
            }
        }, interval);
    }

    // Get appropriate logo text based on theme
    getLogoEmojis() {
        switch (this.currentTheme) {
            case 'christmas':
                return { left: '🎄', right: '🎄' };
            case 'newyear':
                return { left: '🎆', right: '🎇' };
            case 'valentine':
                return { left: '💕', right: '💕' };
            case 'halloween':
                return { left: '🎃', right: '👻' };
            case 'thanksgiving':
                return { left: '🦃', right: '🍂' };
            case 'stpatricks':
                return { left: '☘️', right: '🍀' };
            case 'summer':
                return { left: '☀️', right: '🏖️' };
            case 'easter':
                return { left: '🐰', right: '🥚' };
            default:
                return { left: '🎮', right: '🎮' };
        }
    }

    updateLogoEmojis() {
        const logos = document.querySelectorAll('.logo');
        const emojis = this.getLogoEmojis();
        
        logos.forEach(logo => {
            // Extract just the text content
            let text = logo.textContent.replace(/[^\w\s]/gi, '').trim();
            if (!text) text = 'Quizmas';
            logo.textContent = `${emojis.left} ${text} ${emojis.right}`;
        });
    }
}

// Export singleton
const themeManager = new ThemeManager();
export default themeManager;
