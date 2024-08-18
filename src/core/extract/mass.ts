import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size
 * @returns 
 */
export async function mass(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= 16 + sum_p) throw new Error("Out of range")

    const per = 2 / (9.0 + 1)
    const per1 = 1.0 - per

    let ema = high[0] - low[0]

    let ema2 = ema

    const sum: BufferNewPush = {
        index: 0,
        pushes: 0,
        size: period,
        sum: 0,
        vals: []
    }

    for (let i = 0; i < size; ++i) {
        const hl = high[i] - low[i]

        ema = ema * per1 + hl * per

        if (i == 8) {
            ema2 = ema
        }

        if (i >= 8) {
            ema2 = ema2 * per1 + ema * per

            if (i >= 16) {
                // Start ti_buffer_push
                // BUFFER = sum
                // VAL    = ema/ema2
                if (sum.pushes >= sum.size) {
                    sum.sum -= sum.vals[sum.index]
                }

                sum.sum += ema / ema2
                sum.vals[sum.index] = ema / ema2
                sum.pushes += 1
                sum.index = (sum.index + 1)
                if (sum.index >= sum.size) sum.index = 0
                // End ti_buffer_push

                if (i >= 16 + period - 1) {
                    output.push(sum.sum)
                }
            }
        }
    }

    return output
}