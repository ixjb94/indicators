

/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size
 * @returns [fisher, signal]
 */
export async function fisher(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const fisher: Array<number> = []
    const signal: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let trail = 0
    let maxi = -1
    let mini = -1

    let max = (0.5 * (high[(0)] + low[(0)]))
    let min = (0.5 * (high[(0)] + low[(0)]))
    let val1 = 0.0
    let bar
    let fish = 0.0

    let j
    for (let i = period - 1; i < size; ++i, ++trail) {
        /* Maintain highest. */
        bar = (0.5 * (high[(i)] + low[(i)]))
        if (maxi < trail) {
            maxi = trail
            max = (0.5 * (high[(maxi)] + low[(maxi)]))
            j = trail

            while (++j <= i) {
                bar = (0.5 * (high[(j)] + low[(j)]))
                if (bar >= max) {
                    max = bar
                    maxi = j
                }
            }

        } else if (bar >= max) {
            maxi = i
            max = bar
        }


        /* Maintain lowest. */
        bar = (0.5 * (high[(i)] + low[(i)]))
        if (mini < trail) {
            mini = trail
            min = (0.5 * (high[(mini)] + low[(mini)]))
            j = trail

            while (++j <= i) {
                bar = (0.5 * (high[(j)] + low[(j)]))
                if (bar <= min) {
                    min = bar
                    mini = j
                }
            }

        } else if (bar <= min) {
            mini = i
            min = bar
        }

        let mm = max - min
        if (mm == 0.0) mm = 0.001
        val1 = 0.33 * 2.0 * (((0.5 * (high[(i)] + low[(i)])) - min) / (mm) - 0.5) + 0.67 * val1
        if (val1 > 0.99) val1 = .999
        if (val1 < -0.99) val1 = -.999

        signal.push(fish)
        fish = 0.5 * Math.log((1.0 + val1) / (1.0 - val1)) + 0.5 * fish
        fisher.push(fish)
    }

    return [fisher, signal]
}