import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function stochrsi(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    const per = 1.0 / (period)

    // if (period < 2) throw new Error("Invalid Options")
    // if (size <= (period) * 2 - 1) throw new Error("Out of range")

    const rsi: BufferNewPush = {
        size: period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

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
    let r = 100.0 * (smooth_up / (smooth_up + smooth_down))

    // Start ti_buffer_push
    // BUFFER = rsi
    // VAL    = r
    // ti_buffer_push(rsi, r)
    if (rsi.pushes >= rsi.size) {
        rsi.sum -= rsi.vals[rsi.index]
    }

    rsi.sum += r
    rsi.vals[rsi.index] = r
    rsi.pushes += 1
    rsi.index = (rsi.index + 1)
    if (rsi.index >= rsi.size) rsi.index = 0
    // End ti_buffer_push

    let min = r
    let max = r
    let mini = 0
    let maxi = 0

    for (let i = period + 1; i < size; ++i) {
        const upward = source[i] > source[i - 1] ? source[i] - source[i - 1] : 0
        const downward = source[i] < source[i - 1] ? source[i - 1] - source[i] : 0

        smooth_up = (upward - smooth_up) * per + smooth_up
        smooth_down = (downward - smooth_down) * per + smooth_down

        r = 100.0 * (smooth_up / (smooth_up + smooth_down))

        if (r > max) {
            max = r;
            maxi = rsi.index
        } else if (maxi == rsi.index) {
            max = r
            for (let j = 0; j < rsi.size; ++j) {
                if (j == rsi.index) continue

                if (rsi.vals[j] > max) {
                    max = rsi.vals[j]
                    maxi = j
                }
            }
        }

        if (r < min) {
            min = r
            mini = rsi.index
        } else if (mini == rsi.index) {
            min = r
            for (let j = 0; j < rsi.size; ++j) {
                if (j == rsi.index) continue
                if (rsi.vals[j] < min) {
                    min = rsi.vals[j]
                    mini = j
                }
            }
        }

        // Start ti_buffer_qpush
        // BUFFER = rsi
        // VAL    = r
        // ti_buffer_qpush(rsi, r)
        rsi.vals[rsi.index] = r
        rsi.index = rsi.index + 1
        if (rsi.index >= rsi.size) rsi.index = 0
        // End ti_buffer_qpush

        if (i > period * 2 - 2) {
            const diff = max - min
            if (diff == 0.0) {
                output.push(0.0)
            } else {
                output.push((r - min) / (diff))
            }
        }
    }

    return output
}