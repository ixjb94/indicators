

/**
 * 
 * @param open 
 * @param close 
 * @param period 
 * @param size 
 * @returns 
 */
export async function qstick(
    open: number[],
    close: number[],
    period: number,
    size: number = close.length
) {

    const output: number[] = []
    const scale = 1.0 / period

    let sum = 0

    let i;
    for (i = 0; i < period; ++i) {
        sum += close[i] - open[i]
    }

    output.push(sum * scale)

    for (i = period; i < size; ++i) {
        sum += close[i] - open[i]
        sum -= close[i - period] - open[i - period]
        output.push(sum * scale)
    }

    return output
}