

/**
 * 
 * @param source 
 * @param period 
 * @param stddev_period 
 * @param size 
 * @returns 
 */
export async function rvi(
    source: Array<number>, sma_period: number,
    stddev_period: number, size: number = source.length
) {

    const output: Array<number> = []

    // if (sma_period < 1) throw new Error("Invalid Options")
    // if (stddev_period < 1) throw new Error("Invalid Options")
    // if (size <= stddev_period-1) throw new Error("Out of range")

    let y_sum = 0
    let xy_sum = 0

    const x_sum = stddev_period * (stddev_period + 1) / 2
    const xsq_sum = stddev_period * (stddev_period + 1) * (2 * stddev_period + 1) / 6

    let gains_ema = 0
    let losses_ema = 0

    let i = 0
    for (; i < stddev_period; ++i) {
        xy_sum += source[i] * (i + 1)
        y_sum += source[i]
    }

    --i;
    const b = (xy_sum / stddev_period - x_sum / stddev_period * y_sum / stddev_period) / (xsq_sum / stddev_period - (x_sum / stddev_period) * (x_sum / stddev_period))
    const a = y_sum / stddev_period - b * x_sum / stddev_period

    const higher = source[i] - (a + b * stddev_period)
    if (higher > 0) {
        gains_ema = higher * higher / stddev_period
    } else {
        losses_ema = higher * higher / stddev_period
    }

    if (gains_ema + losses_ema == 0) {
        output.push(50)
    } else {
        output.push(gains_ema / (gains_ema + losses_ema) * 100)
    }
    ++i

    for (; i < size; ++i) {
        xy_sum += -y_sum + source[i] * stddev_period
        y_sum += -source[i - stddev_period] + source[i]

        const b = (xy_sum / stddev_period - x_sum / stddev_period * y_sum / stddev_period) / (xsq_sum / stddev_period - (x_sum / stddev_period) * (x_sum / stddev_period))
        const a = y_sum / stddev_period - b * x_sum / stddev_period

        const higher = source[i] - (a + b * stddev_period)

        if (higher > 0) {
            gains_ema = (higher * higher / stddev_period - gains_ema) * 2. / (sma_period + 1) + gains_ema
        } else {
            losses_ema = (higher * higher / stddev_period - losses_ema) * 2. / (sma_period + 1) + losses_ema
        }

        if (gains_ema + losses_ema == 0) {
            output.push(50)
        } else {
            output.push(gains_ema / (gains_ema + losses_ema) * 100)
        }
    }

    return output
}