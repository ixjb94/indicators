


/**
 * @param source 
 * @param period 
 * @param stddev 
 * @param size
 * @returns [Lower, Middle, Upper]
 */
export async function bbands(
    source: Array<number>, period: number, stddev: number,
    size: number = source.length
) {

    const lower: Array<number> = []
    const middle: Array<number> = []
    const upper: Array<number> = []

    const scale = 1.0 / period

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let sum = 0
    let sum2 = 0

    for (let i = 0; i < period; ++i) {
        sum += source[i]
        sum2 += source[i] * source[i]
    }

    let sd = Math.sqrt(sum2 * scale - (sum * scale) * (sum * scale))

    const calc_middle = sum * scale
    lower.push(calc_middle - stddev * sd)
    upper.push(calc_middle + stddev * sd)
    middle.push(calc_middle)

    for (let i = period; i < size; ++i) {
        sum += source[i]
        sum2 += source[i] * source[i]

        sum -= source[i - period]
        sum2 -= source[i - period] * source[i - period]

        sd = Math.sqrt(sum2 * scale - (sum * scale) * (sum * scale))

        const calc_middle = sum * scale
        upper.push(calc_middle + stddev * sd)
        lower.push(calc_middle - stddev * sd)
        middle.push(calc_middle)
    }

    return [lower, middle, upper]
}