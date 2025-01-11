// themeToggle.js
export class ThemeManager {
    constructor() {
        this.html = document.documentElement;
        this.sunIcon = document.getElementById('sunIcon');
        this.moonIcon = document.getElementById('moonIcon');
        this.themeToggle = document.getElementById('themeToggle');
        
        // Initialize theme
        this.initializeTheme();
        
        // Bind event listeners
        this.bindEvents();
    }

    initializeTheme() {
        // Check saved preference or system preference
        const isDark = localStorage.theme === 'dark' || 
                      (!('theme' in localStorage) && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Apply initial theme
        this.setTheme(isDark ? 'dark' : 'light');
    }

    bindEvents() {
        // Theme toggle button click
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => this.handleSystemThemeChange(e));
    }

    toggleTheme() {
        const newTheme = this.html.classList.contains('dark') ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        if (theme === 'dark') {
            this.html.classList.add('dark');
            this.sunIcon?.classList.remove('hidden');
            this.moonIcon?.classList.add('hidden');
        } else {
            this.html.classList.remove('dark');
            this.sunIcon?.classList.add('hidden');
            this.moonIcon?.classList.remove('hidden');
        }
        localStorage.theme = theme;
    }

    handleSystemThemeChange(e) {
        if (!localStorage.theme) {  // Only react if user hasn't set a preference
            this.setTheme(e.matches ? 'dark' : 'light');
        }
    }
}