/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param volume 
 * @param size
 * @returns 
 */
export async function ad(
    high: Array<number>, low: Array<number>,
    close: Array<number>, volume: Array<number>,
    size: number = close.length
) {

    const output = []

    let sum = 0

    for (let index = 0; index < size; ++index) {
        const hl = (high[index] - low[index])
        if (hl != 0.0) {
            sum += (close[index] - low[index] - high[index] + close[index]) / hl * volume[index]
        }
        output[index] = sum
    }

    return output
}