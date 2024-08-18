

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function rsi(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    const per = 1.0 / (period)

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period) throw new Error("Out of range")

    let smooth_up = 0
    let smooth_down = 0

    for (let i = 1; i <= period; ++i) {
        const upward = source[i] > source[i - 1] ? source[i] - source[i - 1] : 0
        const downward = source[i] < source[i - 1] ? source[i - 1] - source[i] : 0
        smooth_up += upward
        smooth_down += downward
    }

    smooth_up /= period
    smooth_down /= period
    output.push(100.0 * (smooth_up / (smooth_up + smooth_down)))

    for (let i = period + 1; i < size; ++i) {
        const upward = (source[i] > source[i - 1] ? source[i] - source[i - 1] : 0)
        const downward = (source[i] < source[i - 1] ? source[i - 1] - source[i] : 0)

        smooth_up = (upward - smooth_up) * per + smooth_up
        smooth_down = (downward - smooth_down) * per + smooth_down

        output.push(100.0 * (smooth_up / (smooth_up + smooth_down)))
    }

    return output
}