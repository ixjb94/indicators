/**
 * 
 * @param high 
 * @param low 
 * @param size
 * @returns 
 */
export async function ao(
    high: Array<number>, low: Array<number>,
    size: number = high.length
) {

    const period = 34;

    const output = []

    // if (size <= 33) throw new Error("Out of range")

    let sum34 = 0
    let sum5 = 0
    const per34 = 1.0 / 34.0
    const per5 = 1.0 / 5.0

    for (let index = 0; index < 34; ++index) {
        const hl = 0.5 * (high[index] + low[index])

        sum34 += hl

        if (index >= 29) {
            sum5 += hl
        }
    }

    output.push(per5 * sum5 - per34 * sum34)

    for (let index = period; index < size; ++index) {
        const hl = 0.5 * (high[index] + low[index])

        sum34 += hl
        sum5 += hl

        sum34 -= 0.5 * (high[index - 34] + low[index - 34])
        sum5 -= 0.5 * (high[index - 5] + low[index - 5])

        // output[output.length] = per5 * sum5 - per34 * sum34
        output.push(per5 * sum5 - per34 * sum34)
    }

    return output
}