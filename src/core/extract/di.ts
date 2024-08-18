

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param size 
 * @returns [Plus DI, Minus DI]
 */
export async function di(
    high: Array<number>, low: Array<number>, close: Array<number>,
    period: number, size: number = high.length
) {

    const plus_di: Array<number> = []
    const minus_di: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    const per = (period - 1) / (period)

    let atr = 0
    let dmup = 0
    let dmdown = 0

    for (let i = 1; i < period; ++i) {

        // let truerange
        // Start CALC_TRUERANGE()
        const l = low[i]
        const h = high[i]
        const c = close[i - 1]
        const ych = Math.abs(h - c)
        const ycl = Math.abs(l - c)
        let v = h - l
        if (ych > v) v = ych
        if (ycl > v) v = ycl
        const truerange = v
        // End CALC_TRUERANGE()
        atr += truerange

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
        // END CALC_DIRECTION

        dmup += dp;
        dmdown += dm;
    }


    plus_di.push(100.0 * dmup / atr)
    minus_di.push(100.0 * dmdown / atr)

    for (let i = period; i < size; ++i) {
        // let truerange
        // Start CALC_TRUERANGE()
        const l = low[i]
        const h = high[i]
        const c = close[i - 1]
        const ych = Math.abs(h - c)
        const ycl = Math.abs(l - c)
        let v = h - l
        if (ych > v) v = ych
        if (ycl > v) v = ycl
        const truerange = v
        // End CALC_TRUERANGE()
        atr = atr * per + truerange

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
        // END CALC_DIRECTION


        dmup = dmup * per + dp;
        dmdown = dmdown * per + dm;

        plus_di.push(100.0 * dmup / atr)
        minus_di.push(100.0 * dmdown / atr)
    }

    return [plus_di, minus_di]
}