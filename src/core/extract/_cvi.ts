import { BufferNewQPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size
 * @returns 
 */
export async function _cvi(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period * 2 - 1) throw new Error("Out of range")

    const per = 2 / (period + 1)

    const lag: BufferNewQPush = {
        size: period,
        index: 0,
        pushes: 0,
        vals: []
    }

    let val = high[0] - low[0]

    for (let i = 1; i < period * 2 - 1; ++i) {
        val = ((high[i] - low[i]) - val) * per + val
        // Start ti_buffer_qpush
        // BUFFER = lag
        // VAL    = val
        lag.vals[lag.index] = val
        lag.index = lag.index + 1
        if (lag.index >= lag.size) lag.index = 0
        // End ti_buffer_qpush
    }

    for (let i = period * 2 - 1; i < size; ++i) {
        val = ((high[i] - low[i]) - val) * per + val

        const old = lag.vals[lag.index]

        output.push(100.0 * (val - old) / old)
        // Start ti_buffer_qpush
        // BUFFER = lag
        // VAL    = val
        lag.vals[lag.index] = val
        lag.index = lag.index + 1
        if (lag.index >= lag.size) lag.index = 0
        // End ti_buffer_qpush

    }

    return output
}