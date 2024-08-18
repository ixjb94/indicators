

/**
 * 
 * @param high 
 * @param low 
 * @param size 
 * @returns 
 */
export async function medprice(
    high: Array<number>, low: Array<number>,
    size: number = high.length
) {

    const output: Array<number> = []

    for (let i = 0; i < size; ++i) {
        output.push((high[i] + low[i]) * 0.5)
    }

    return output
}