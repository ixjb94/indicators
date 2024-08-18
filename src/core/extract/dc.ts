

/**
 * @param highs 
 * @param lows 
 * @param period 
 * @returns [upper, middle, lower]
 */
export async function dc(highs: number[], lows: number[], period: number) {

    const upper: number[] = []
    const lower: number[] = []
    const middle: number[] = []

    for (let i = period - 1; i < highs.length; i++) {
        upper.push(Math.max(...highs.slice(i - period + 1, i + 1)))
        lower.push(Math.min(...lows.slice(i - period + 1, i + 1)))
        middle.push((upper[upper.length - 1] + lower[lower.length - 1]) / 2)
    }

    return [upper, middle, lower]
}