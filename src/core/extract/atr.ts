

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param size
 * @returns 
 */
export async function atr(
    high: Array<number>, low: Array<number>, close: Array<number>,
    period: number, size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid options")
    // if (size <= period - 1) throw new Error("Out of range")

    const per = 1.0 / period

    let sum = 0
    let truerange

    sum += high[0] - low[0]

    for (let i = 1; i < period; ++i) {

        // Start CALC_TRUERANGE()
        const l = low[i]
        const h = high[i]
        const c = close[i - 1]

        const ych = Math.abs(h - c)
        const ycl = Math.abs(l - c)

        let v = h - l

        if (ych > v) v = ych
        if (ycl > v) v = ycl
        truerange = v
        // End CALC_TRUERANGE()

        sum += truerange
    }

    let val = sum / period

    // output[output.length] = val
    output.push(val)

    for (let index = period; index < size; ++index) {
        // CALC TRUE RANGE
        const l = low[index]
        const h = high[index]
        const c = close[index - 1]

        const ych = Math.abs(h - c)
        const ycl = Math.abs(l - c)

        let v = h - l

        if (ych > v) v = ych
        if (ycl > v) v = ycl
        truerange = v
        // CALC TRUE RANGE

        val = (truerange - val) * per + val

        // output[output.length] = val
        output.push(val)
    }

    return output
}