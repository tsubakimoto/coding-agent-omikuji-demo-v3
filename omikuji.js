// Language support
const translations = {
    ja: {
        title: '🎋 おみくじ 🎋',
        button: 'おみくじを回す',
        description: 'ボタンを押して、今日の運勢を占おう！',
        fortunes: ['大吉', '中吉', '小吉', '吉', '凶', '大凶']
    },
    en: {
        title: '🎋 Fortune Telling 🎋',
        button: 'Draw Fortune',
        description: 'Click the button to see your fortune today!',
        fortunes: ['Great Blessing', 'Middle Blessing', 'Small Blessing', 'Blessing', 'Bad Luck', 'Great Curse']
    }
};

let currentLanguage = 'ja';

// For backward compatibility with tests and external code
const fortunes = translations.ja.fortunes;

function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * translations.ja.fortunes.length);
    return translations[currentLanguage].fortunes[randomIndex];
}

function drawOmikuji() {
    const resultElement = document.getElementById('result');
    const drawButton = document.getElementById('drawButton');
    
    if (!resultElement || !drawButton) return;
    
    // Disable button during animation
    drawButton.disabled = true;
    
    // Add spinning animation
    resultElement.classList.add('spinning');
    
    // Show result after animation
    setTimeout(() => {
        const fortune = getRandomFortune();
        resultElement.textContent = fortune;
        resultElement.classList.remove('spinning');
        resultElement.classList.add('show');
        
        // Remove show class after animation
        setTimeout(() => {
            resultElement.classList.remove('show');
            drawButton.disabled = false;
        }, 300);
    }, 500);
}

// Language switching functionality
function initLanguage() {
    let savedLanguage = null;
    
    // Safely retrieve saved language
    try {
        savedLanguage = localStorage.getItem('omikuji-language');
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
    
    // Set language to saved preference or default to Japanese
    if (savedLanguage === 'en' || savedLanguage === 'ja') {
        currentLanguage = savedLanguage;
    }
    
    updateLanguageUI();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    
    // Save language preference
    try {
        localStorage.setItem('omikuji-language', currentLanguage);
    } catch (e) {
        console.warn('Could not save language preference:', e);
    }
    
    updateLanguageUI();
}

function updateLanguageUI() {
    const titleElement = document.querySelector('h1');
    const drawButton = document.getElementById('drawButton');
    const description = document.querySelector('.description');
    const languageToggle = document.getElementById('languageToggle');
    
    if (titleElement) {
        titleElement.textContent = translations[currentLanguage].title;
    }
    
    if (drawButton) {
        drawButton.textContent = translations[currentLanguage].button;
    }
    
    if (description) {
        description.textContent = translations[currentLanguage].description;
    }
    
    if (languageToggle) {
        languageToggle.textContent = currentLanguage === 'ja' ? 'EN' : 'JA';
        languageToggle.setAttribute('aria-label', currentLanguage === 'ja' ? 'Switch to English' : '日本語に切り替え');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

// Theme switching functionality
function initTheme() {
    let savedTheme = null;
    
    // Safely retrieve saved theme
    try {
        savedTheme = localStorage.getItem('omikuji-theme');
    } catch (e) {
        // localStorage might be disabled or unavailable
        console.warn('localStorage not available:', e);
    }
    
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (!themeIcon) return;
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

function toggleTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (!themeIcon) return;
    
    document.body.classList.toggle('dark-theme');
    
    const isDark = document.body.classList.contains('dark-theme');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    
    // Save theme preference
    try {
        localStorage.setItem('omikuji-theme', isDark ? 'dark' : 'light');
    } catch (e) {
        // localStorage might be disabled, quota exceeded, or unavailable
        console.warn('Could not save theme preference:', e);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('drawButton');
    const themeToggle = document.getElementById('themeToggle');
    const languageToggle = document.getElementById('languageToggle');
    
    if (drawButton) {
        drawButton.addEventListener('click', drawOmikuji);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    // Initialize theme and language
    initTheme();
    initLanguage();
});

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fortunes,
        getRandomFortune
    };
}
