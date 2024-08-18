import { ti_buffer } from "../ti_buffer"

/**
 * @TODO Update TYPEPRICE
 * @Updated
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param size 
 * @returns 
 */
export async function cci(
    high: Array<number>, low: Array<number>,
    close: Array<number>, period: number,
    size: number = high.length
) {

    const scale = 1.0 / period

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= (period-1) * 2) throw new Error("Out of range")

    const output: number[] = []

    const sum = new ti_buffer(period)

    let i, j
    for (i = 0; i < size; ++i) {

        // Start TYPEPRICE
        // ((high[(INDEX)] + low[(INDEX)] + close[(INDEX)]) * (1.0/3.0))
        const today = ((high[(i)] + low[(i)] + close[(i)]) * (1.0 / 3.0))
        // End TYPEPRICE

        sum.push(today)
        const avg = sum.sum * scale

        if (i >= period * 2 - 2) {
            let acc = 0
            for (j = 0; j < period; ++j) {
                acc += Math.abs(avg - sum.vals[j])
            }

            let cci = acc * scale
            cci *= .015
            cci = (today - avg) / cci
            output.push(cci)
        }
    }

    return output
}