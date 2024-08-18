import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param size 
 * @returns [upper_band, lower_band, middle_point]
 */
export async function abands(
    high: Array<number>, low: Array<number>,
    close: Array<number>, period: number,
    size: number = high.length
) {

    const upper_band: Array<number> = []
    const lower_band: Array<number> = []
    const middle_point: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    const per = 1. / period

    const buffer_high: BufferNewPush = {
        size: period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }
    const buffer_low: BufferNewPush = {
        size: period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    let close_sum = 0

    for (let i = 0; i < period; ++i) {
        // Start MULT
        // MULT(i) (4. * (high[i] - low[i]) / (high[i] + low[i]))
        const mult = (4. * (high[i] - low[i]) / (high[i] + low[i]))
        // End MULT

        const high_val = (1. + mult) * high[i]

        // Start ti_buffer_push
        // BUFFER = buffer_high
        // VAL    = high_val
        // ti_buffer_push(buffer_high, high_val)
        if (buffer_high.pushes >= buffer_high.size) {
            buffer_high.sum -= buffer_high.vals[buffer_high.index]
        }

        buffer_high.sum += high_val
        buffer_high.vals[buffer_high.index] = high_val
        buffer_high.pushes += 1
        buffer_high.index = (buffer_high.index + 1)
        if (buffer_high.index >= buffer_high.size) buffer_high.index = 0
        // End ti_buffer_push

        const low_val = (1. - mult) * low[i]

        // Start ti_buffer_push
        // BUFFER = buffer_low
        // VAL    = low_val
        // ti_buffer_push(buffer_low, low_val)
        if (buffer_low.pushes >= buffer_low.size) {
            buffer_low.sum -= buffer_low.vals[buffer_low.index]
        }

        buffer_low.sum += low_val
        buffer_low.vals[buffer_low.index] = low_val
        buffer_low.pushes += 1
        buffer_low.index = (buffer_low.index + 1)
        if (buffer_low.index >= buffer_low.size) buffer_low.index = 0
        // End ti_buffer_push

        close_sum += close[i]
    }

    upper_band.push(buffer_high.sum * per)
    lower_band.push(buffer_low.sum * per)
    middle_point.push(close_sum * per)

    for (let i = period; i < size; ++i) {
        // Start MULT
        const mult = (4. * (high[i] - low[i]) / (high[i] + low[i]))
        // End MULT

        const high_val = (1. + mult) * high[i]
        // Start ti_buffer_push
        // BUFFER = buffer_high
        // VAL    = high_val
        // ti_buffer_push(buffer_high, high_val)
        if (buffer_high.pushes >= buffer_high.size) {
            buffer_high.sum -= buffer_high.vals[buffer_high.index]
        }

        buffer_high.sum += high_val
        buffer_high.vals[buffer_high.index] = high_val
        buffer_high.pushes += 1
        buffer_high.index = (buffer_high.index + 1)
        if (buffer_high.index >= buffer_high.size) buffer_high.index = 0
        // End ti_buffer_push

        const low_val = (1. - mult) * low[i]

        // Start ti_buffer_push
        // BUFFER = buffer_low
        // VAL    = low_val
        // ti_buffer_push(buffer_low, low_val)
        if (buffer_low.pushes >= buffer_low.size) {
            buffer_low.sum -= buffer_low.vals[buffer_low.index]
        }

        buffer_low.sum += low_val
        buffer_low.vals[buffer_low.index] = low_val
        buffer_low.pushes += 1
        buffer_low.index = (buffer_low.index + 1)
        if (buffer_low.index >= buffer_low.size) buffer_low.index = 0
        // End ti_buffer_push

        close_sum += close[i] - close[i - period]

        upper_band.push(buffer_high.sum * per)
        lower_band.push(buffer_low.sum * per)
        middle_point.push(close_sum * per)
    }

    return [upper_band, lower_band, middle_point]
}