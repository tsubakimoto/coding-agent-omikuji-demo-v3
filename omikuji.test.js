const { fortunes, getRandomFortune } = require('./omikuji');

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
});
