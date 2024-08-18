

/**
 * 
 * @param open 
 * @param high 
 * @param low 
 * @param close 
 * @param size
 * @returns 
 */
export async function bop(
    open: Array<number>, high: Array<number>,
    low: Array<number>, close: Array<number>,
    size: number = open.length
) {

    const output: Array<number> = []

    for (let index = 0; index < size; ++index) {
        const hl = high[index] - low[index]

        if (hl <= 0.0) {
            output[index] = 0
        } else {
            output[index] = (close[index] - open[index]) / hl
        }
    }

    return output
}