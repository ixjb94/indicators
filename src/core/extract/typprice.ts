

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param size 
 */
export async function typprice(
    high: Array<number>, low: Array<number>,
    close: Array<number>, size: number = high.length
) {

    const output: Array<number> = []

    for (let i = 0; i < size; ++i) {
        output.push((high[i] + low[i] + close[i]) * (1.0 / 3.0))
    }

    return output
}