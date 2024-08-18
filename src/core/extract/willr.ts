

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param size
 * @returns 
 */
export async function willr(
    high: Array<number>, low: Array<number>,
    close: Array<number>, period: number,
    size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let trail = 0
    let maxi = -1
    let mini = -1
    let max = high[0]
    let min = low[0]
    let bar

    let j
    for (let i = period - 1; i < size; ++i, ++trail) {

        // Maintain highest
        bar = high[i]
        if (maxi < trail) {
            maxi = trail
            max = high[maxi]
            j = trail

            while (++j <= i) {
                bar = high[j];
                if (bar >= max) {
                    max = bar
                    maxi = j
                }
            }

        } else if (bar >= max) {
            maxi = i
            max = bar
        }


        // Maintain lowest
        bar = low[i]
        if (mini < trail) {
            mini = trail
            min = low[mini]
            j = trail

            while (++j <= i) {
                bar = low[j];
                if (bar <= min) {
                    min = bar
                    mini = j
                }
            }

        } else if (bar <= min) {
            mini = i
            min = bar
        }


        const highlow = (max - min)
        const r = highlow == 0.0 ? 0.0 : -100 * ((max - close[i]) / highlow)
        output.push(r)
    }

    return output
}