

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function rocr(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period) throw new Error("Out of range")

    for (let i = period; i < size; ++i) {
        output.push(source[i] / source[i - period])
    }

    return output
}