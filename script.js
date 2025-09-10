// Pomodoro Timer Application
class PomodoroTimer {
    constructor() {
        // Timer state
        this.isRunning = false;
        this.timeLeft = 0;
        this.currentMode = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.workCycle = 1;
        this.interval = null;
        this.totalDuration = 0;
        
        // Settings (default values)
        this.settings = {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15
        };
        
        // Audio context for beep sound
        this.audioContext = null;
        
        // DOM elements
        this.initializeElements();
        
        // Initialize app
        this.init();
    }
    
    initializeElements() {
        // Timer elements
        this.timerDisplay = document.getElementById('timer');
        this.progressFill = document.getElementById('progress-fill');
        this.currentModeEl = document.getElementById('current-mode');
        this.cycleCounterEl = document.getElementById('cycle-counter');
        
        // Control buttons
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
        // Settings
        this.workDurationInput = document.getElementById('work-duration');
        this.shortBreakDurationInput = document.getElementById('short-break-duration');
        this.longBreakDurationInput = document.getElementById('long-break-duration');
        this.applySettingsBtn = document.getElementById('apply-settings');
        
        // Stats
        this.dailyCountEl = document.getElementById('daily-count');
        this.totalCountEl = document.getElementById('total-count');
        
        // Modal
        this.modal = document.getElementById('notification-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalCloseBtn = document.getElementById('modal-close');
        
        // Dark mode toggle
        this.darkModeToggle = document.getElementById('dark-mode-toggle');
    }
    
    init() {
        // Load settings and stats from localStorage
        this.loadSettings();
        this.loadStats();
        
        // Set initial timer
        this.resetTimer();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }
    
    addEventListeners() {
        // Control buttons
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Settings
        this.applySettingsBtn.addEventListener('click', () => this.applySettings());
        
        // Modal
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        
        // Dark mode toggle
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.isRunning ? this.pauseTimer() : this.startTimer();
            } else if (e.code === 'KeyR') {
                e.preventDefault();
                this.resetTimer();
            }
        });
    }
    
    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.textContent = 'Running...';
            this.startBtn.disabled = true;
            
            this.interval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.timeLeft <= 0) {
                    this.completeSession();
                }
            }, 1000);
        }
    }
    
    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.textContent = 'Start';
            this.startBtn.disabled = false;
            clearInterval(this.interval);
        }
    }
    
    resetTimer() {
        this.pauseTimer();
        this.currentMode = 'work';
        this.workCycle = 1;
        this.setTimerDuration();
        this.updateDisplay();
        this.updateProgress();
        this.updateModeDisplay();
        this.updateTheme();
    }
    
    setTimerDuration() {
        switch (this.currentMode) {
            case 'work':
                this.timeLeft = this.settings.workDuration * 60;
                this.totalDuration = this.settings.workDuration * 60;
                break;
            case 'shortBreak':
                this.timeLeft = this.settings.shortBreakDuration * 60;
                this.totalDuration = this.settings.shortBreakDuration * 60;
                break;
            case 'longBreak':
                this.timeLeft = this.settings.longBreakDuration * 60;
                this.totalDuration = this.settings.longBreakDuration * 60;
                break;
        }
    }
    
    completeSession() {
        this.pauseTimer();
        this.playBeep();
        
        // Update stats
        if (this.currentMode === 'work') {
            this.incrementStats();
        }
        
        // Switch to next mode
        this.switchMode();
        
        // Show notification
        this.showNotification();
        
        // Auto-start next session (optional)
        // setTimeout(() => this.startTimer(), 2000);
    }
    
    switchMode() {
        if (this.currentMode === 'work') {
            if (this.workCycle === 4) {
                // Long break after 4 work sessions
                this.currentMode = 'longBreak';
                this.workCycle = 1;
            } else {
                // Short break
                this.currentMode = 'shortBreak';
                this.workCycle++;
            }
        } else {
            // Back to work
            this.currentMode = 'work';
        }
        
        this.setTimerDuration();
        this.updateDisplay();
        this.updateProgress();
        this.updateModeDisplay();
        this.updateTheme();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateProgress() {
        const progress = ((this.totalDuration - this.timeLeft) / this.totalDuration) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    updateModeDisplay() {
        const modeNames = {
            work: 'Work Session',
            shortBreak: 'Short Break',
            longBreak: 'Long Break'
        };
        
        this.currentModeEl.textContent = modeNames[this.currentMode];
        this.cycleCounterEl.textContent = `Cycle ${this.workCycle}/4`;
    }
    
    updateTheme() {
        document.body.className = document.body.classList.contains('dark-mode') ? 'dark-mode' : '';
        
        switch (this.currentMode) {
            case 'work':
                document.body.classList.add('work-mode');
                break;
            case 'shortBreak':
                document.body.classList.add('short-break-mode');
                break;
            case 'longBreak':
                document.body.classList.add('long-break-mode');
                break;
        }
    }
    
    showNotification() {
        const messages = {
            work: {
                title: 'Work Session Complete!',
                message: this.currentMode === 'longBreak' ? 'Time for a long break!' : 'Time for a short break!'
            },
            shortBreak: {
                title: 'Break Complete!',
                message: 'Ready to get back to work?'
            },
            longBreak: {
                title: 'Long Break Complete!',
                message: 'Ready for another work cycle?'
            }
        };
        
        const prevMode = this.currentMode === 'work' ? 
            (this.workCycle === 1 ? 'longBreak' : 'shortBreak') : 'work';
        
        this.modalTitle.textContent = messages[prevMode].title;
        this.modalMessage.textContent = messages[prevMode].message;
        this.modal.classList.remove('hidden');
    }
    
    closeModal() {
        this.modal.classList.add('hidden');
    }
    
    playBeep() {
        if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }
    
    applySettings() {
        this.settings.workDuration = parseInt(this.workDurationInput.value);
        this.settings.shortBreakDuration = parseInt(this.shortBreakDurationInput.value);
        this.settings.longBreakDuration = parseInt(this.longBreakDurationInput.value);
        
        this.saveSettings();
        this.resetTimer();
        
        // Show feedback
        this.applySettingsBtn.textContent = 'Applied!';
        setTimeout(() => {
            this.applySettingsBtn.textContent = 'Apply Settings';
        }, 1500);
    }
    
    saveSettings() {
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Update input values
        this.workDurationInput.value = this.settings.workDuration;
        this.shortBreakDurationInput.value = this.settings.shortBreakDuration;
        this.longBreakDurationInput.value = this.settings.longBreakDuration;
    }
    
    incrementStats() {
        const today = new Date().toDateString();
        let stats = this.getStats();
        
        // Increment total count
        stats.totalCompleted++;
        
        // Increment daily count
        if (stats.lastDate !== today) {
            stats.dailyCompleted = 1;
            stats.lastDate = today;
        } else {
            stats.dailyCompleted++;
        }
        
        this.saveStats(stats);
        this.updateStatsDisplay(stats);
    }
    
    getStats() {
        const defaultStats = {
            totalCompleted: 0,
            dailyCompleted: 0,
            lastDate: new Date().toDateString()
        };
        
        const saved = localStorage.getItem('pomodoroStats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    }
    
    saveStats(stats) {
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }
    
    loadStats() {
        const stats = this.getStats();
        const today = new Date().toDateString();
        
        // Reset daily count if it's a new day
        if (stats.lastDate !== today) {
            stats.dailyCompleted = 0;
            stats.lastDate = today;
            this.saveStats(stats);
        }
        
        this.updateStatsDisplay(stats);
    }
    
    updateStatsDisplay(stats) {
        this.dailyCountEl.textContent = stats.dailyCompleted;
        this.totalCountEl.textContent = stats.totalCompleted;
    }
    
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        this.darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        
        // Save preference
        localStorage.setItem('darkMode', isDark);
    }
    
    loadDarkMode() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            this.darkModeToggle.textContent = '☀️ Light Mode';
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PomodoroTimer();
    
    // Load dark mode preference
    timer.loadDarkMode();
    
    // Add some helpful console messages
    console.log('🍅 Pomodoro Timer initialized!');
    console.log('Keyboard shortcuts:');
    console.log('  Space - Start/Pause timer');
    console.log('  R - Reset timer');
});