

/**
 * 
 * @param source 
 * @param period 
 * @param size
 * @returns 
 */
export async function md(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    const scale = 1.0 / period

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let sum = 0

    let j
    for (let i = 0; i < size; ++i) {
        const today = source[i]
        sum += today
        if (i >= period) sum -= source[i - period]

        const avg = sum * scale

        if (i >= period - 1) {
            let acc = 0
            for (j = 0; j < period; ++j) {
                acc += Math.abs(avg - source[i - j])
            }

            output.push(acc * scale)
        }
    }

    return output
}