import { ti_buffer } from "../ti_buffer"

/**
 * @param high 
 * @param low 
 * @param period 
 * @param size 
 * @returns 
 */
export async function cvi(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const output: number[] = []

    const per = 2 / (period + 1)

    const lag = new ti_buffer(period)

    let val = high[0] - low[0]

    let i
    for (i = 1; i < period * 2 - 1; ++i) {
        val = ((high[i] - low[i]) - val) * per + val

        lag.qpush(val)
    }

    for (i = period * 2 - 1; i < size; ++i) {
        val = ((high[i] - low[i]) - val) * per + val

        const old = lag.vals[lag.index]

        output.push(100.0 * (val - old) / old)

        lag.qpush(val)
    }

    return output
}