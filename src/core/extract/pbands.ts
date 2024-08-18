

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param size 
 * @returns [pbands_lower, pbands_upper]
 */
export async function pbands(
    high: Array<number>, low: Array<number>,
    close: Array<number>, period: number,
    size: number = high.length
) {

    const pbands_lower: Array<number> = []
    const pbands_upper: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let y_sum = 0.
    let xy_sum = 0.

    const x_sum = period * (period + 1) / 2.
    const xsq_sum = period * (period + 1) * (2 * period + 1) / 6.

    let i
    for (i = 0; i < period; ++i) {
        xy_sum += close[i] * (i + 1)
        y_sum += close[i]
    }

    --i

    const b = (xy_sum / period - x_sum / period * y_sum / period) / (xsq_sum / period - (x_sum / period) * (x_sum / period))

    let the_max = high[i]

    for (let j = 1; j < period; ++j) {
        if (the_max < high[i - j] + j * b) {
            the_max = high[i - j] + j * b
        }
    }

    let the_min = low[i]
    for (let j = 1; j < period; ++j) {
        if (the_min > low[i - j] + j * b) {
            the_min = low[i - j] + j * b
        }
    }

    pbands_upper.push(the_max)
    pbands_lower.push(the_min)

    ++i

    for (; i < size; ++i) {
        xy_sum += -y_sum + close[i] * period;
        y_sum += -close[i - period] + close[i]

        const b = (xy_sum / period - x_sum / period * y_sum / period) / (xsq_sum / period - (x_sum / period) * (x_sum / period));

        let the_max = high[i]
        for (let j = 1; j < period; ++j) {
            if (the_max < high[i - j] + j * b) {
                the_max = high[i - j] + j * b
            }
        }

        let the_min = low[i]
        for (let j = 1; j < period; ++j) {
            if (the_min > low[i - j] + j * b) {
                the_min = low[i - j] + j * b
            }
        }

        pbands_lower.push(the_min)
        pbands_upper.push(the_max)
    }

    return [pbands_lower, pbands_upper]
}