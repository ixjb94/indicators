import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param source 
 * @param period 
 * @param ema_period 
 * @param size 
 * @returns 
 */
export async function pfe(
    source: Array<number>, period: number,
    ema_period: number, size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period) throw new Error("Out of range")

    const per = 2 / (ema_period + 1)

    const denom: BufferNewPush = {
        size: period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    let i
    for (i = 1; i < period; ++i) {
        // Start ti_buffer_push
        // BUFFER = denom
        // VAL    = Math.sqrt(Math.pow(source[i] - source[i-1], 2) + 1.)
        // ti_buffer_push(denom, sqrt(pow(real[i] - real[i-1], 2) + 1.))
        if (denom.pushes >= denom.size) {
            denom.sum -= denom.vals[denom.index]
        }

        denom.sum += Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
        denom.vals[denom.index] = Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
        denom.pushes += 1
        denom.index = (denom.index + 1)
        if (denom.index >= denom.size) denom.index = 0
        // End ti_buffer_push
    }

    // Start ti_buffer_push
    // BUFFER = denom
    // VAL    = Math.sqrt(Math.pow(source[i] - source[i-1], 2) + 1.)
    // ti_buffer_push(denom, sqrt(pow(real[i] - real[i-1], 2) + 1.))
    if (denom.pushes >= denom.size) {
        denom.sum -= denom.vals[denom.index]
    }

    denom.sum += Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
    denom.vals[denom.index] = Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
    denom.pushes += 1
    denom.index = (denom.index + 1)
    if (denom.index >= denom.size) denom.index = 0
    // End ti_buffer_push

    // Start SIGN
    // let numer = SIGN(source[i] - source[i-period]) * 100. * Math.sqrt(Math.pow(source[i] - source[i-period], 2) + 100.)
    const numer = ((source[i] - source[i - period]) > 0 ? 1 : -1) * 100 * Math.sqrt(Math.pow(source[i] - source[i - period], 2) + 100)
    // End SIGN

    let ema = numer / denom.sum
    output.push(ema)

    for (i = period + 1; i < size; ++i) {
        // Start ti_buffer_push
        // BUFFER = denom
        // VAL    = Math.sqrt(Math.pow(source[i] - source[i-1], 2) + 1.)
        // ti_buffer_push(denom, sqrt(pow(real[i] - real[i-1], 2) + 1.))
        if (denom.pushes >= denom.size) {
            denom.sum -= denom.vals[denom.index]
        }

        denom.sum += Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
        denom.vals[denom.index] = Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
        denom.pushes += 1
        denom.index = (denom.index + 1)
        if (denom.index >= denom.size) denom.index = 0
        // End ti_buffer_push

        // Start SIGN
        // let numer2 = SIGN(real[i] - real[i-(int)period]) * 100. * sqrt(pow(real[i] - real[i-(int)period], 2) + 100.)
        const numer2 = ((source[i] - source[i - period]) > 0 ? 1 : -1) * 100 * Math.sqrt(Math.pow(source[i] - source[i - period], 2) + 100)
        // End SIGN

        // Start EMA_NEXT
        // ema = EMA_NEXT(numer2 / denom->sum)
        ema = (((numer2 / denom.sum) - ema) * per + ema)
        // End EMA_NEXT

        output.push(ema)
    }

    return output
}