import { dpo } from './extract/dpo';

describe('Indicators DPO bug reproduction (#24)', () => {

    it('should NOT return NaN when period is odd (e.g., 21)', async () => {
        const src = Array.from({ length: 100 }, (_, i) => 50000 + i * 10);
        const result = await dpo(src, 21);
        
        const nanValues = result.filter(v => isNaN(v));
        // If the bug is present, this will be > 0. 
        // If >> 1 fixed it, this should be 0.
        expect(nanValues.length).toBe(0);
    });
});
