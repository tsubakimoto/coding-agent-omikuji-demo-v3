const fortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];

function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
}

function drawOmikuji() {
    const resultElement = document.getElementById('result');
    const drawButton = document.getElementById('drawButton');
    
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('drawButton');
    drawButton.addEventListener('click', drawOmikuji);
});

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fortunes,
        getRandomFortune
    };
}
