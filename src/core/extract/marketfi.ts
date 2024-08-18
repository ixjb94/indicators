

/**
 * 
 * @param high 
 * @param low 
 * @param volume 
 * @param size
 * @returns 
 */
export async function marketfi(
    high: Array<number>, low: Array<number>,
    volume: Array<number>, size: number = high.length
) {

    const output: Array<number> = []

    // if (size <= 0) throw new Error("Out of range")

    for (let i = 0; i < size; ++i) {
        output.push((high[i] - low[i]) / volume[i])
    }

    return output
}