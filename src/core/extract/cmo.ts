

/**
 * 
 * @param source 
 * @param period 
 * @param size
 * @returns 
 */
export async function cmo(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid options")
    // if (size <= period) throw new Error("Out of range")

    let up_sum = 0
    let down_sum = 0

    for (let i = 1; i <= period; ++i) {
        // Start UPWARD
        // up_sum += UPWARD(i)
        up_sum += (source[(i)] > source[(i) - 1] ? source[(i)] - source[(i) - 1] : 0)
        // End UPWARD

        // Start DOWNWARD
        // down_sum += DOWNWARD(i)
        down_sum += (source[(i)] < source[(i) - 1] ? source[(i) - 1] - source[(i)] : 0)
        // End DOWNWARD
    }

    output.push(100 * (up_sum - down_sum) / (up_sum + down_sum))

    for (let i = period + 1; i < size; ++i) {
        // i - period
        up_sum -= (source[(i - period)] > source[(i - period) - 1] ? source[(i - period)] - source[(i - period) - 1] : 0)
        down_sum -= (source[(i - period)] < source[(i - period) - 1] ? source[(i - period) - 1] - source[(i - period)] : 0)

        // i
        up_sum += (source[(i)] > source[(i) - 1] ? source[(i)] - source[(i) - 1] : 0)
        down_sum += (source[(i)] < source[(i) - 1] ? source[(i) - 1] - source[(i)] : 0)

        output.push(100 * (up_sum - down_sum) / (up_sum + down_sum))
    }

    return output
}