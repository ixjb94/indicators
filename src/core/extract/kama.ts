

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function kama(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    const short_per = 2 / (2.0 + 1)
    const long_per = 2 / (30.0 + 1)

    let sum = 0

    for (let i = 1; i < period; ++i) {
        sum += Math.abs(source[i] - source[i - 1])
    }

    let kama = source[period - 1]
    output.push(kama)
    let er
    let sc

    for (let i = period; i < size; ++i) {
        sum += Math.abs(source[i] - source[i - 1])

        if (i > period) {
            sum -= Math.abs(source[i - period] - source[i - period - 1])
        }

        if (sum != 0.0) {
            er = Math.abs(source[i] - source[i - period]) / sum
        } else {
            er = 1.0
        }
        sc = Math.pow(er * (short_per - long_per) + long_per, 2)

        kama = kama + sc * (source[i] - kama)
        output.push(kama)
    }

    return output
}