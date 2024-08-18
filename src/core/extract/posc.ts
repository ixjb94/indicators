

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param ema_period 
 * @param size
 * @returns 
 */
export async function posc(
    high: Array<number>, low: Array<number>,
    close: Array<number>, period: number,
    ema_period: number, size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (ema_period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let y_sum = 0
    let xy_sum = 0
    let ema

    const x_sum = period * (period + 1) / 2
    const xsq_sum = period * (period + 1) * (2 * period + 1) / 6

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

    ema = (close[i] - the_min) / (the_max - the_min) * 100
    output.push(ema)

    ++i

    for (; i < size; ++i) {
        xy_sum += -y_sum + close[i] * period
        y_sum += -close[i - period] + close[i]

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

        const osc = (close[i] - the_min) / (the_max - the_min) * 100
        ema = (osc - ema) * 2. / (1 + ema_period) + ema
        output.push(ema)
    }

    return output
}