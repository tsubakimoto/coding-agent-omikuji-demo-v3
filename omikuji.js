const fortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];

function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
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

// Theme switching functionality
function initTheme() {
    const savedTheme = localStorage.getItem('omikuji-theme');
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
    localStorage.setItem('omikuji-theme', isDark ? 'dark' : 'light');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('drawButton');
    const themeToggle = document.getElementById('themeToggle');
    
    if (drawButton) {
        drawButton.addEventListener('click', drawOmikuji);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize theme
    initTheme();
});

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fortunes,
        getRandomFortune
    };
}
