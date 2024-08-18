

/**
 * 
 * @param source 
 * @param volume 
 * @param period 
 * @param size 
 * @returns 
 */
export async function vwma(
    source: Array<number>, volume: Array<number>,
    period: number, size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let sum = 0
    let vsum = 0

    for (let i = 0; i < period; ++i) {
        sum += source[i] * volume[i]
        vsum += volume[i]
    }

    output.push(sum / vsum)

    for (let i = period; i < size; ++i) {
        sum += source[i] * volume[i]
        sum -= source[i - period] * volume[i - period]
        vsum += volume[i]
        vsum -= volume[i - period]

        output.push(sum / vsum)
    }

    return output
}