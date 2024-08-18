

/**
 * @param source 
 * @param period 
 * @param size
 * @returns 
 */
export async function ema(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= 0) throw new Error("Out of range")

    const per = 2 / (period + 1)

    let val = source[0]
    output.push(val)

    for (let i = 1; i < size; ++i) {
        val = (source[i] - val) * per + val
        output.push(val)
    }

    return output
}