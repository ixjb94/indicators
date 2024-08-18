import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param short_period 
 * @param medium_period 
 * @param long_period 
 * @param size 
 * @returns 
 */
export async function ultosc(
    high: Array<number>, low: Array<number>,
    close: Array<number>, short_period: number,
    medium_period: number, long_period: number,
    size: number = high.length
) {

    const output: Array<number> = []

    // if (short_period < 1) throw new Error("Invalid Options")
    // if (medium_period < short_period) throw new Error("Invalid Options")
    // if (long_period < medium_period) throw new Error("Invalid Options")
    // if (size <= medium_period) throw new Error("Out of range")


    const bp_buf: BufferNewPush = {
        size: long_period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    const r_buf: BufferNewPush = {
        size: long_period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    let bp_short_sum = 0
    let bp_medium_sum = 0
    let r_short_sum = 0
    let r_medium_sum = 0

    for (let i = 1; i < size; ++i) {

        // Start MIN
        // MIN(a,b) ((a)<(b)?(a):(b))
        const true_low = ((low[i]) < (close[i - 1]) ? (low[i]) : (close[i - 1]))
        // End MIN

        // Start MAX
        // MAX(a,b) ((a)>(b)?(a):(b))
        const true_high = ((high[i]) > (close[i - 1]) ? (high[i]) : (close[i - 1]))
        // End MAX

        const bp = close[i] - true_low
        const r = true_high - true_low

        bp_short_sum += bp
        bp_medium_sum += bp
        r_short_sum += r
        r_medium_sum += r

        // Start ti_buffer_push
        // BUFFER = bp_buf
        // VAL    = bp
        // ti_buffer_push(bp_buf, bp)
        if (bp_buf.pushes >= bp_buf.size) {
            bp_buf.sum -= bp_buf.vals[bp_buf.index]
        }

        bp_buf.sum += bp
        bp_buf.vals[bp_buf.index] = bp
        bp_buf.pushes += 1
        bp_buf.index = (bp_buf.index + 1)
        if (bp_buf.index >= bp_buf.size) bp_buf.index = 0
        // End ti_buffer_push

        // Start ti_buffer_push
        // BUFFER = r_buf
        // VAL    = r
        // ti_buffer_push(r_buf, r)
        if (r_buf.pushes >= r_buf.size) {
            r_buf.sum -= r_buf.vals[r_buf.index]
        }

        r_buf.sum += r
        r_buf.vals[r_buf.index] = r
        r_buf.pushes += 1
        r_buf.index = (r_buf.index + 1)
        if (r_buf.index >= r_buf.size) r_buf.index = 0
        // End ti_buffer_push

        if (i > short_period) {
            let short_index = bp_buf.index - short_period - 1
            if (short_index < 0) short_index += long_period

            bp_short_sum -= bp_buf.vals[short_index]
            r_short_sum -= r_buf.vals[short_index]

            if (i > medium_period) {
                let medium_index = bp_buf.index - medium_period - 1
                if (medium_index < 0) medium_index += long_period
                bp_medium_sum -= bp_buf.vals[medium_index]
                r_medium_sum -= r_buf.vals[medium_index]
            }
        }

        if (i >= long_period) {
            const first = 4 * bp_short_sum / r_short_sum
            const second = 2 * bp_medium_sum / r_medium_sum
            const third = 1 * bp_buf.sum / r_buf.sum
            const ult = (first + second + third) * 100.0 / 7.0
            output.push(ult)
        }
    }

    return output
}