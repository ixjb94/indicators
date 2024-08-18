import { BufferNewQPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size
 * @returns 
 */
export async function adxr(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 2) throw new Error("Invalid Options")
    // if (size <= (period-1) * 3) throw new Error("Out of Range")

    const per = (period - 1) / (period)
    const invper = 1.0 / (period)

    let dmup = 0
    let dmdown = 0

    for (let i = 1; i < period; ++i) {

        // Start CALC_DIRECTION
        let dp = high[i] - high[i - 1]
        let dm = low[i - 1] - low[i]

        if (dp < 0) {
            dp = 0
        } else if (dp > dm) {
            dm = 0
        }

        if (dm < 0) {
            dm = 0
        } else if (dm > dp) {
            dp = 0
        }
        // End CALC_DIRECTION

        dmup += dp
        dmdown += dm
    }

    let adx = 0.0

    let di_up = dmup
    let di_down = dmdown
    let dm_diff = Math.abs(di_up - di_down)
    let dm_sum = di_up + di_down
    let dx = dm_diff / dm_sum * 100

    adx += dx

    // Start ti_buffer_new
    const adxr: BufferNewQPush = {
        size: period - 1,
        pushes: 0,
        index: 0,
        vals: [],
    }
    // End ti_buffer_new

    const first_adxr = (period - 1) * 3

    for (let i = period; i < size; ++i) {

        // Start CALC_DIRECTION
        let dp = high[i] - high[i - 1]
        let dm = low[i - 1] - low[i]

        if (dp < 0) {
            dp = 0
        } else if (dp > dm) {
            dm = 0
        }

        if (dm < 0) {
            dm = 0
        } else if (dm > dp) {
            dp = 0
        }
        // End CALC_DIRECTION

        dmup = dmup * per + dp
        dmdown = dmdown * per + dm

        di_up = dmup
        di_down = dmdown
        dm_diff = Math.abs(di_up - di_down)
        dm_sum = di_up + di_down
        dx = dm_diff / dm_sum * 100

        if (i - period < period - 2) {
            adx += dx
        } else if (i - period == period - 2) {
            adx += dx
            // ## Start ti_buffer_qpush
            // BUFFER   = adxr
            // VAL      = adx * invper
            adxr.vals[adxr.index] = adx * invper
            adxr.index = adxr.index + 1
            if (adxr.index >= adxr.size) adxr.index = 0
            // ## End ti_buffer_qpush
        } else {
            adx = adx * per + dx

            if (i >= first_adxr) {
                // ## Start ti_buffer_get
                // BUFFER = adxr
                // VAL    = 1
                // ((BUFFER)->vals[((BUFFER)->index + (BUFFER)->size - 1 + (VAL)) % (BUFFER)->size])
                const a = adxr.vals[adxr.index]
                const b = (adxr.size - 1) + 1 // + 1 = VAL
                const c = adxr.size
                const buffer_get = a + b % c
                // ## End ti_buffer_get
                output.push((0.5 * (adx * invper + buffer_get)))
            }

            // ## Start ti_buffer_qpush
            adxr.vals[adxr.index] = adx * invper
            adxr.index = adxr.index + 1
            if (adxr.index >= adxr.size) adxr.index = 0
            // ## End ti_buffer_qpush
        }
    }

    return output
}