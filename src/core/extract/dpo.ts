

/**
 * 
 * @param source 
 * @param period 
 * @param size
 * @returns 
 */
export async function dpo(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const back = period / 2 + 1

    const output: Array<number> = []

    const scale = 1.0 / period

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let sum = 0

    for (let i = 0; i < period; ++i) {
        sum += source[i]
    }

    output.push(source[period - 1 - back] - (sum * scale))

    for (let i = period; i < size; ++i) {
        sum += source[i]
        sum -= source[i - period]
        output.push(source[i - back] - (sum * scale))
    }

    return output
}