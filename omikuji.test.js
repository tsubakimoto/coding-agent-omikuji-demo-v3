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

    describe('history tracking', () => {
        const setupDom = () => {
            document.body.innerHTML = `
                <div id="result"></div>
                <button id="drawButton">draw</button>
                <button id="languageToggle">JA</button>
                <p class="description"></p>
                <div class="history">
                    <h2 id="historyTitle">履歴</h2>
                    <p id="historyEmpty" class="history-empty"></p>
                    <ol id="historyList" class="history-list"></ol>
                </div>
            `;
        };

        const loadModule = () => {
            let omikujiModule;
            jest.isolateModules(() => {
                omikujiModule = require('./omikuji');
            });
            document.dispatchEvent(new Event('DOMContentLoaded'));
            return omikujiModule;
        };

        beforeEach(() => {
            jest.resetModules();
            localStorage.clear();
            setupDom();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('keeps only the latest five fortunes in history', () => {
            const omikuji = loadModule();
            const fortuneSequence = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];

            fortuneSequence.forEach((fortune) => {
                omikuji.addToHistory(fortune);
            });

            const historyItems = Array.from(document.querySelectorAll('#historyList li')).map((li) => li.textContent);
            expect(historyItems).toEqual(['大凶', '凶', '吉', '小吉', '中吉']);
        });

        test('shows translated empty message when no history', () => {
            loadModule();

            const historyEmpty = document.getElementById('historyEmpty');
            expect(historyEmpty.textContent).toBe('まだ結果がありません');

            const languageToggle = document.getElementById('languageToggle');
            languageToggle.click();

            expect(historyEmpty.textContent).toBe('No draws yet');
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
});
