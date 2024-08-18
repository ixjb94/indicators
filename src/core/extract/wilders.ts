

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function wilders(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    const per = 1.0 / (period)

    let sum = 0

    for (let i = 0; i < period; ++i) {
        sum += source[i]
    }


    let val = sum / period
    output.push(val)

    for (let i = period; i < size; ++i) {
        val = (source[i] - val) * per + val
        output.push(val)
    }

    return output
}