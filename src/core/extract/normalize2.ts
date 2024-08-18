/**
 * More efficient
 * @param source example: sma | rsi | cci | etc.
 * @param length main source length, example: close.length
 * @returns 
 */
export async function normalize2(source: number[], length: number) {
    const temp = []
    const diff = length - source.length
    temp[diff - 1] = NaN
    return [...temp, ...source]
}