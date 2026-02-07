const { fortunes, getRandomFortune, addToHistory, loadHistory, saveHistory, MAX_HISTORY_SIZE } = require('./omikuji');

describe('Omikuji Application', () => {
    describe('fortunes array', () => {
        test('should contain exactly 6 fortune types', () => {
            expect(fortunes).toHaveLength(6);
        });

        test('should contain all required fortune types', () => {
            const expectedFortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
            expect(fortunes).toEqual(expectedFortunes);
        });

        test('should match Japanese translations', () => {
            const { fortunes: jaFortunes } = require('./omikuji');
            expect(jaFortunes).toEqual(['大吉', '中吉', '小吉', '吉', '凶', '大凶']);
        });

        test('should not be empty', () => {
            expect(fortunes.length).toBeGreaterThan(0);
        });
    });

    describe('getRandomFortune function', () => {
        test('should return a fortune string', () => {
            const result = getRandomFortune();
            expect(typeof result).toBe('string');
        });

        test('should return a valid Japanese or English fortune', () => {
            const result = getRandomFortune();
            const jaFortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
            const enFortunes = ['Great Blessing', 'Middle Blessing', 'Small Blessing', 'Blessing', 'Bad Luck', 'Great Curse'];
            const allValidFortunes = [...jaFortunes, ...enFortunes];
            expect(allValidFortunes).toContain(result);
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

        test('should only return valid fortune values', () => {
            const jaFortunes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
            const enFortunes = ['Great Blessing', 'Middle Blessing', 'Small Blessing', 'Blessing', 'Bad Luck', 'Great Curse'];
            const allValidFortunes = [...jaFortunes, ...enFortunes];
            
            const iterations = 50;
            for (let i = 0; i < iterations; i++) {
                const result = getRandomFortune();
                expect(allValidFortunes.includes(result)).toBe(true);
            }
        });
    });

    describe('Fortune distribution', () => {
        test('all fortunes should be possible to draw', () => {
            const drawnFortunes = new Set();
            const maxIterations = 1000;
            
            for (let i = 0; i < maxIterations; i++) {
                drawnFortunes.add(getRandomFortune());
                if (drawnFortunes.size >= fortunes.length) {
                    break;
                }
            }
            
            // In 1000 draws, we should get all 6 types at least once
            // (considering both Japanese and English variations)
            expect(drawnFortunes.size).toBeGreaterThanOrEqual(fortunes.length);
        });
    });

    describe('History functionality', () => {
        beforeEach(() => {
            // Clear localStorage before each test
            localStorage.clear();
            // Reset history array
            const omikuji = require('./omikuji');
            omikuji.fortuneHistory.length = 0;
        });

        test('MAX_HISTORY_SIZE should be 5', () => {
            expect(MAX_HISTORY_SIZE).toBe(5);
        });

        test('addToHistory should add entry to history', () => {
            const omikuji = require('./omikuji');
            addToHistory('大吉');
            expect(omikuji.fortuneHistory.length).toBe(1);
            expect(omikuji.fortuneHistory[0].fortune).toBe('大吉');
            expect(omikuji.fortuneHistory[0].timestamp).toBeDefined();
        });

        test('history should not exceed MAX_HISTORY_SIZE', () => {
            const omikuji = require('./omikuji');
            for (let i = 0; i < 10; i++) {
                addToHistory('大吉');
            }
            expect(omikuji.fortuneHistory.length).toBe(MAX_HISTORY_SIZE);
        });

        test('history should keep most recent entries', () => {
            const omikuji = require('./omikuji');
            for (let i = 0; i < 10; i++) {
                addToHistory(`fortune-${i}`);
            }
            expect(omikuji.fortuneHistory[0].fortune).toBe('fortune-9');
            expect(omikuji.fortuneHistory[4].fortune).toBe('fortune-5');
        });

        test('saveHistory and loadHistory should persist data', () => {
            const omikuji = require('./omikuji');
            addToHistory('大吉');
            addToHistory('中吉');
            
            // Verify it was saved
            const saved = localStorage.getItem('omikuji-history');
            expect(saved).toBeTruthy();
            
            // Clear in-memory history
            omikuji.fortuneHistory.length = 0;
            expect(omikuji.fortuneHistory.length).toBe(0);
            
            // Load from localStorage
            loadHistory();
            expect(omikuji.fortuneHistory.length).toBe(2);
            expect(omikuji.fortuneHistory[0].fortune).toBe('中吉');
            expect(omikuji.fortuneHistory[1].fortune).toBe('大吉');
        });
    });
});
