

/**
 * 
 * @param close 
 * @param volume 
 * @param size 
 * @returns 
 */
export async function obv(
    close: Array<number>, volume: Array<number>,
    size: number = close.length
) {

    const output: Array<number> = []
    let sum = 0
    output.push(sum)

    let prev = close[0]

    for (let i = 1; i < size; ++i) {
        if (close[i] > prev) {
            sum += volume[i]
        } else if (close[i] < prev) {
            sum -= volume[i]
        } else {
            // No change.
        }

        prev = close[i]
        output.push(sum)
    }

    return output
}