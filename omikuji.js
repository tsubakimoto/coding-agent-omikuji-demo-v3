const fortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'Iv23liQlssCZlvEIJU5i'; // This should be set by the user
const REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

// Auth state management
let currentUser = null;

function getRandomFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
}

function saveFortuneToHistory(fortune) {
    if (!currentUser) return;
    
    try {
        const historyKey = `omikuji-history-${currentUser.login}`;
        let history = sessionStorage.getItem(historyKey);
        history = history ? JSON.parse(history) : [];
        
        const entry = {
            fortune: fortune,
            timestamp: new Date().toISOString()
        };
        
        history.unshift(entry); // Add to beginning
        
        // Keep only last 10 entries
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        sessionStorage.setItem(historyKey, JSON.stringify(history));
        displayHistory();
    } catch (e) {
        console.warn('Could not save fortune to history:', e);
    }
}

function displayHistory() {
    if (!currentUser) return;
    
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    
    if (!historySection || !historyList) return;
    
    try {
        const historyKey = `omikuji-history-${currentUser.login}`;
        const history = sessionStorage.getItem(historyKey);
        
        if (!history) {
            historySection.classList.add('hidden');
            return;
        }
        
        const entries = JSON.parse(history);
        
        if (entries.length === 0) {
            historySection.classList.add('hidden');
            return;
        }
        
        historySection.classList.remove('hidden');
        historyList.innerHTML = '';
        
        entries.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const fortuneSpan = document.createElement('span');
            fortuneSpan.className = 'history-fortune';
            fortuneSpan.textContent = entry.fortune;
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'history-time';
            const date = new Date(entry.timestamp);
            timeSpan.textContent = date.toLocaleString('ja-JP', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            item.appendChild(fortuneSpan);
            item.appendChild(timeSpan);
            historyList.appendChild(item);
        });
    } catch (e) {
        console.warn('Could not display history:', e);
        historySection.classList.add('hidden');
    }
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
        
        // Save to history if logged in
        if (currentUser) {
            saveFortuneToHistory(fortune);
        }
        
        // Remove show class after animation
        setTimeout(() => {
            resultElement.classList.remove('show');
            drawButton.disabled = false;
        }, 300);
    }, 500);
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

// GitHub OAuth functions
function initiateGitHubLogin() {
    if (!GITHUB_CLIENT_ID) {
        alert('GitHub Client IDが設定されていません。installation.mdを参照してGitHub Appを設定してください。');
        return;
    }
    
    const state = generateRandomState();
    sessionStorage.setItem('oauth-state', state);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=read:user`;
    window.location.href = authUrl;
}

function generateRandomState() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (!code || !state) return false;
    
    const savedState = sessionStorage.getItem('oauth-state');
    if (state !== savedState) {
        console.error('OAuth state mismatch');
        return false;
    }
    
    sessionStorage.removeItem('oauth-state');
    
    try {
        // Note: In production, you need a backend to exchange the code for a token
        // For demo purposes, we'll simulate a successful login
        // A real implementation would call: POST https://github.com/login/oauth/access_token
        
        // Since this is a static site without backend, we'll use a mock user
        // In a real app, you'd exchange the code for an access token on the backend
        console.warn('Note: This is a demo. In production, exchange the code on the backend.');
        
        // For demo: Store a flag that user attempted login
        sessionStorage.setItem('github-auth-attempted', 'true');
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Show login instruction modal
        showLoginInstructions();
        
        return true;
    } catch (e) {
        console.error('OAuth callback error:', e);
        return false;
    }
}

function showLoginInstructions() {
    alert('デモモード: 実際のGitHub認証を実装するには、バックエンドサーバーでアクセストークンの交換を行う必要があります。\n\nテスト用に、手動でユーザー情報を入力できます。');
    
    const username = prompt('GitHubユーザー名を入力してください（テスト用）:');
    if (username) {
        // Mock user data for demo
        loginUser({
            login: username,
            avatar_url: `https://github.com/${username}.png`
        });
    }
}

function loginUser(userData) {
    currentUser = userData;
    
    try {
        sessionStorage.setItem('github-user', JSON.stringify(userData));
    } catch (e) {
        console.warn('Could not save user data:', e);
    }
    
    updateAuthUI();
    displayHistory();
}

function logout() {
    currentUser = null;
    
    try {
        sessionStorage.removeItem('github-user');
        // Clear all history keys (they start with 'omikuji-history-')
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('omikuji-history-')) {
                sessionStorage.removeItem(key);
            }
        }
    } catch (e) {
        console.warn('Could not clear session data:', e);
    }
    
    updateAuthUI();
}

function updateAuthUI() {
    const loginView = document.getElementById('loginView');
    const userView = document.getElementById('userView');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const historySection = document.getElementById('historySection');
    
    if (!loginView || !userView) return;
    
    if (currentUser) {
        loginView.classList.add('hidden');
        userView.classList.remove('hidden');
        
        if (userName) {
            userName.textContent = currentUser.login;
        }
        
        if (userAvatar) {
            userAvatar.src = currentUser.avatar_url;
            userAvatar.alt = `${currentUser.login}'s avatar`;
        }
    } else {
        loginView.classList.remove('hidden');
        userView.classList.add('hidden');
        
        if (historySection) {
            historySection.classList.add('hidden');
        }
    }
}

function checkExistingSession() {
    try {
        const userData = sessionStorage.getItem('github-user');
        if (userData) {
            currentUser = JSON.parse(userData);
            updateAuthUI();
            displayHistory();
        }
    } catch (e) {
        console.warn('Could not restore session:', e);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Check for OAuth callback
    await handleOAuthCallback();
    
    // Check existing session
    checkExistingSession();
    
    const drawButton = document.getElementById('drawButton');
    const themeToggle = document.getElementById('themeToggle');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    
    if (drawButton) {
        drawButton.addEventListener('click', drawOmikuji);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (loginButton) {
        loginButton.addEventListener('click', initiateGitHubLogin);
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    // Initialize theme
    initTheme();
});

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fortunes,
        getRandomFortune,
        saveFortuneToHistory,
        displayHistory,
        loginUser,
        logout
    };
}
