

/**
 * 
 * @param open 
 * @param high 
 * @param low 
 * @param close 
 * @param size
 * @returns 
 */
export async function avgprice(
    open: Array<number>, high: Array<number>,
    low: Array<number>, close: Array<number>,
    size: number = open.length
) {

    const output: Array<number> = []

    for (let index = 0; index < size; ++index) {
        output.push((open[index] + high[index] + low[index] + close[index]) * 0.25)
    }

    return output
}