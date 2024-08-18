import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param kperiod 
 * @param kslow 
 * @param dperiod 
 * @param size 
 * @returns [stoch, stoch_ma]
 */
export async function stoch(
    high: Array<number>, low: Array<number>,
    close: Array<number>,
    kperiod: number, kslow: number, dperiod: number,
    size: number = high.length
) {

    const kper = 1.0 / kslow
    const dper = 1.0 / dperiod

    const stoch: Array<number> = []
    const stoch_ma: Array<number> = []

    // if (kperiod < 1) throw new Error("Invalid Options")
    // if (kslow < 1) throw new Error("Invalid Options")
    // if (dperiod < 1) throw new Error("Invalid Options")
    // if (size <= (kperiod + kslow + dperiod - 3)) throw new Error("Out of range")

    let trail = 0
    let maxi = -1
    let mini = -1
    let max = high[0]
    let min = low[0]
    let bar

    const k_sum: BufferNewPush = {
        size: kslow,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    const d_sum: BufferNewPush = {
        size: dperiod,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    let j
    for (let i = 0; i < size; ++i) {

        if (i >= kperiod) ++trail

        // Maintain highest
        bar = high[i]
        if (maxi < trail) {
            maxi = trail
            max = high[maxi]
            j = trail

            while (++j <= i) {
                bar = high[j]
                if (bar >= max) {
                    max = bar
                    maxi = j
                }
            }

        } else if (bar >= max) {
            maxi = i
            max = bar
        }

        // Maintain lowest
        bar = low[i]
        if (mini < trail) {
            mini = trail
            min = low[mini]
            j = trail

            while (++j <= i) {
                bar = low[j]
                if (bar <= min) {
                    min = bar
                    mini = j
                }
            }

        } else if (bar <= min) {
            mini = i
            min = bar
        }

        // Calculate it
        const kdiff = (max - min)
        const kfast = kdiff == 0.0 ? 0.0 : 100 * ((close[i] - min) / kdiff)

        // Start ti_buffer_push
        // BUFFER = k_sum
        // VAL    = kfast
        // ti_buffer_push(k_sum, kfast)
        if (k_sum.pushes >= k_sum.size) {
            k_sum.sum -= k_sum.vals[k_sum.index]
        }

        k_sum.sum += kfast
        k_sum.vals[k_sum.index] = kfast
        k_sum.pushes += 1
        k_sum.index = (k_sum.index + 1)
        if (k_sum.index >= k_sum.size) k_sum.index = 0
        // End ti_buffer_push


        if (i >= kperiod - 1 + kslow - 1) {
            const k = k_sum.sum * kper
            // Start ti_buffer_push
            // BUFFER = d_sum
            // VAL    = k
            // ti_buffer_push(d_sum, k)
            if (d_sum.pushes >= d_sum.size) {
                d_sum.sum -= d_sum.vals[d_sum.index]
            }

            d_sum.sum += k
            d_sum.vals[d_sum.index] = k
            d_sum.pushes += 1
            d_sum.index = (d_sum.index + 1)
            if (d_sum.index >= d_sum.size) d_sum.index = 0
            // End ti_buffer_push

            if (i >= kperiod - 1 + kslow - 1 + dperiod - 1) {
                stoch.push(k)
                stoch_ma.push(d_sum.sum * dper)
            }
        }
    }

    return [stoch, stoch_ma]
}