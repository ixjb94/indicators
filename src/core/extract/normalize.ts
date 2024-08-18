/**
 * @param originalLength - example 100
 * @param source - example ema | sma | rsi | etc.
 * @param empty - example NaN | Null | 0 | false | etc.
 * @returns 
 */
export async function normalize(originalLength: number, source: Array<number> | string, empty = NaN) {
    const diff = originalLength - source.length

    const emptyList: Array<any> = []
    for (let index = 0; index < diff; ++index) {
        emptyList.push(empty)
    }

    const result = [...emptyList, ...source]

    return result
}