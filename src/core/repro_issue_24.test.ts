import { Indicators } from './indicators';

describe('Indicators DPO bug reproduction (#24)', () => {
    const indicators = new Indicators();

    it('should return NaN when period is odd (e.g., 21)', async () => {
        const src = Array.from({ length: 100 }, (_, i) => 50000 + i * 10);
        const result = await indicators.dpo(src, 21);
        
        // The issue says it returns NaN for all values
        const nanValues = result.filter(v => isNaN(v));
        expect(nanValues.length).toBeGreaterThan(0);
    });

    it('should work correctly when period is even (e.g., 20)', async () => {
        const src = Array.from({ length: 100 }, (_, i) => 50000 + i * 10);
        const result = await indicators.dpo(src, 20);
        
        const nanValues = result.filter(v => isNaN(v));
        expect(nanValues.length).toBeLessThan(result.length);
    });
});
