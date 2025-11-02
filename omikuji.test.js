const { fortunes, getRandomFortune, saveFortuneToHistory, loginUser, logout } = require('./omikuji');

// Mock sessionStorage
const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { 
            Object.keys(store).forEach(key => delete store[key]);
        },
        key: (index) => Object.keys(store)[index] || null,
        get length() { return Object.keys(store).length; }
    };
})();

// Set up global sessionStorage mock
global.sessionStorage = mockSessionStorage;

// Mock currentUser (module-level variable in omikuji.js)
let mockCurrentUser = null;

// Override the module's currentUser through the exported functions
beforeEach(() => {
    mockSessionStorage.clear();
    mockCurrentUser = null;
});

describe('Omikuji Application', () => {
    describe('fortunes array', () => {
        test('should contain exactly 6 fortune types', () => {
            expect(fortunes).toHaveLength(6);
        });

        test('should contain all required fortune types', () => {
            const expectedFortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
            expect(fortunes).toEqual(expectedFortunes);
        });

        test('should not be empty', () => {
            expect(fortunes.length).toBeGreaterThan(0);
        });
    });

    describe('getRandomFortune function', () => {
        test('should return a fortune from the fortunes array', () => {
            const result = getRandomFortune();
            expect(fortunes).toContain(result);
        });

        test('should return a string', () => {
            const result = getRandomFortune();
            expect(typeof result).toBe('string');
        });

        test('should return one of the expected fortune types', () => {
            const result = getRandomFortune();
            const expectedFortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
            expect(expectedFortunes).toContain(result);
        });

        test('should generate different results over multiple calls (probability test)', () => {
            const results = new Set();
            // Run 100 times to increase probability of getting different results
            for (let i = 0; i < 100; i++) {
                results.add(getRandomFortune());
            }
            // Should get at least 2 different results in 100 tries
            expect(results.size).toBeGreaterThanOrEqual(2);
        });

        test('should only return values that exist in the fortunes array', () => {
            const iterations = 50;
            for (let i = 0; i < iterations; i++) {
                const result = getRandomFortune();
                expect(fortunes.includes(result)).toBe(true);
            }
        });
    });

    describe('Fortune distribution', () => {
        test('all fortunes should be possible to draw', () => {
            const drawnFortunes = new Set();
            const maxIterations = 1000;
            
            for (let i = 0; i < maxIterations; i++) {
                drawnFortunes.add(getRandomFortune());
                if (drawnFortunes.size === fortunes.length) {
                    break;
                }
            }
            
            // In 1000 draws, we should get all 6 types at least once
            expect(drawnFortunes.size).toBe(fortunes.length);
        });
    });

    describe('User authentication', () => {
        test('loginUser should store user data in sessionStorage', () => {
            const userData = {
                login: 'testuser',
                avatar_url: 'https://github.com/testuser.png'
            };
            
            loginUser(userData);
            
            const storedData = sessionStorage.getItem('github-user');
            expect(storedData).toBeTruthy();
            expect(JSON.parse(storedData)).toEqual(userData);
        });

        test('logout should clear user data from sessionStorage', () => {
            const userData = {
                login: 'testuser',
                avatar_url: 'https://github.com/testuser.png'
            };
            
            loginUser(userData);
            expect(sessionStorage.getItem('github-user')).toBeTruthy();
            
            logout();
            expect(sessionStorage.getItem('github-user')).toBeNull();
        });

        test('logout should clear all history data from sessionStorage', () => {
            const userData = {
                login: 'testuser',
                avatar_url: 'https://github.com/testuser.png'
            };
            
            loginUser(userData);
            sessionStorage.setItem('omikuji-history-testuser', JSON.stringify([{ fortune: '大吉', timestamp: new Date().toISOString() }]));
            
            logout();
            
            expect(sessionStorage.getItem('omikuji-history-testuser')).toBeNull();
        });
    });

    describe('Fortune history', () => {
        beforeEach(() => {
            // Clear storage before each test
            mockSessionStorage.clear();
            
            // Set up a logged-in user for history tests
            const userData = {
                login: 'testuser',
                avatar_url: 'https://github.com/testuser.png'
            };
            loginUser(userData);
        });

        test('saveFortuneToHistory should save fortune to sessionStorage when logged in', () => {
            const fortune = '大吉';
            saveFortuneToHistory(fortune);
            
            const historyKey = 'omikuji-history-testuser';
            const history = JSON.parse(sessionStorage.getItem(historyKey));
            
            expect(history).toBeTruthy();
            expect(history.length).toBe(1);
            expect(history[0].fortune).toBe(fortune);
            expect(history[0].timestamp).toBeTruthy();
        });

        test('saveFortuneToHistory should add new fortunes to the beginning of history', () => {
            const historyKey = 'omikuji-history-testuser';
            
            // Manually clear any existing history to ensure clean state
            sessionStorage.removeItem(historyKey);
            
            saveFortuneToHistory('大吉');
            saveFortuneToHistory('凶');
            saveFortuneToHistory('中吉');
            
            const history = JSON.parse(sessionStorage.getItem(historyKey));
            
            expect(history.length).toBe(3);
            expect(history[0].fortune).toBe('中吉'); // Most recent
            expect(history[1].fortune).toBe('凶');
            expect(history[2].fortune).toBe('大吉');
        });

        test('saveFortuneToHistory should keep only last 10 entries', () => {
            // Add 15 fortunes
            for (let i = 0; i < 15; i++) {
                saveFortuneToHistory(getRandomFortune());
            }
            
            const historyKey = 'omikuji-history-testuser';
            const history = JSON.parse(sessionStorage.getItem(historyKey));
            
            expect(history.length).toBe(10);
        });

        test('saveFortuneToHistory should not save when user is not logged in', () => {
            logout(); // Log out first
            
            saveFortuneToHistory('大吉');
            
            const historyKey = 'omikuji-history-testuser';
            const history = sessionStorage.getItem(historyKey);
            
            expect(history).toBeNull();
        });

        test('each user should have their own separate history', () => {
            // First user
            loginUser({ login: 'user1', avatar_url: 'https://github.com/user1.png' });
            saveFortuneToHistory('大吉');
            
            // Second user
            loginUser({ login: 'user2', avatar_url: 'https://github.com/user2.png' });
            saveFortuneToHistory('凶');
            
            const history1 = JSON.parse(sessionStorage.getItem('omikuji-history-user1'));
            const history2 = JSON.parse(sessionStorage.getItem('omikuji-history-user2'));
            
            expect(history1.length).toBe(1);
            expect(history1[0].fortune).toBe('大吉');
            
            expect(history2.length).toBe(1);
            expect(history2[0].fortune).toBe('凶');
        });
    });
});
