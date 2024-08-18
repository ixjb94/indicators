

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function vhf(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period) throw new Error("Out of range")

    let trail = 1
    let maxi = -1
    let mini = -1

    let max = source[0]
    let min = source[0]
    let bar

    let sum = 0

    let yc = source[0]
    let c

    let j
    for (let i = 1; i < period; ++i) {
        c = source[i]
        sum += Math.abs(c - yc)
        yc = c
    }

    for (let i = period; i < size; ++i, ++trail) {
        c = source[i]
        sum += Math.abs(c - yc)
        yc = c

        if (i > period) {
            sum -= Math.abs(source[i - period] - source[i - period - 1])
        }

        // Maintain highest
        bar = c
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

        // Maintain lowest
        bar = c
        if (mini < trail) {
            mini = trail
            min = source[mini]
            j = trail

            while (++j <= i) {
                bar = source[j]
                if (bar <= min) {
                    min = bar
                    mini = j
                }
            }

        } else if (bar <= min) {
            mini = i
            min = bar
        }

        output.push(Math.abs(max - min) / sum)
    }

    return output
}