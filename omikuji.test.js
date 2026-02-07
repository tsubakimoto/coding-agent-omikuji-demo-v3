const { fortunes, getRandomFortune, addToHistory, fortuneHistory, MAX_HISTORY_SIZE } = require('./omikuji');

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
            // Clear history before each test
            fortuneHistory.length = 0;
        });

        test('should have MAX_HISTORY_SIZE constant defined as 5', () => {
            expect(MAX_HISTORY_SIZE).toBe(5);
        });

        test('should start with empty history', () => {
            expect(fortuneHistory).toHaveLength(0);
        });

        test('should add fortune to history', () => {
            addToHistory('大吉');
            expect(fortuneHistory).toHaveLength(1);
            expect(fortuneHistory[0]).toBe('大吉');
        });

        test('should add multiple fortunes to history', () => {
            addToHistory('大吉');
            addToHistory('中吉');
            addToHistory('小吉');
            expect(fortuneHistory).toHaveLength(3);
            expect(fortuneHistory[0]).toBe('小吉');
            expect(fortuneHistory[1]).toBe('中吉');
            expect(fortuneHistory[2]).toBe('大吉');
        });

        test('should maintain maximum 5 items in history', () => {
            addToHistory('大吉');
            addToHistory('中吉');
            addToHistory('小吉');
            addToHistory('吉');
            addToHistory('凶');
            addToHistory('大凶');

            expect(fortuneHistory).toHaveLength(5);
            expect(fortuneHistory[0]).toBe('大凶');
            expect(fortuneHistory[4]).toBe('中吉');
        });

        test('should keep newest items when exceeding max size', () => {
            for (let i = 1; i <= 10; i++) {
                addToHistory(`Fortune ${i}`);
            }

            expect(fortuneHistory).toHaveLength(MAX_HISTORY_SIZE);
            expect(fortuneHistory[0]).toBe('Fortune 10');
            expect(fortuneHistory[4]).toBe('Fortune 6');
        });

        test('should add newest fortune at the beginning of array', () => {
            addToHistory('First');
            addToHistory('Second');
            addToHistory('Third');

            expect(fortuneHistory[0]).toBe('Third');
            expect(fortuneHistory[1]).toBe('Second');
            expect(fortuneHistory[2]).toBe('First');
        });
    });
});
