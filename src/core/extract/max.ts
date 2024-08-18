

/**
 * 
 * @param source 
 * @param period
 * @param size
 * @returns 
 */
export async function max(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let trail = 0
    let maxi = -1
    let max = source[0]

    let j
    for (let i = period - 1; i < size; ++i, ++trail) {
        let bar = source[i]

        if (maxi < trail) {
            maxi = trail
            max = source[maxi]
            j = trail

            while (++j <= i) {
                bar = source[j]

                if (bar >= max) {
                    max = bar
                    maxi = j
                }
            }

        } else if (bar >= max) {
            maxi = i
            max = bar
        }

        output.push(max)
    }

    return output
}