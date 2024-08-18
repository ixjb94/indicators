

/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size
 * @returns [Plus DM, Minus DM]
 */
export async function dm(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const plus_dm: Array<number> = []
    const minus_dm: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    const per = (period - 1) / (period)

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
        // END CALC_DIRECTION

        dmup += dp
        dmdown += dm
    }


    plus_dm.push(dmup)
    minus_dm.push(dmdown)

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
        // END CALC_DIRECTION

        dmup = dmup * per + dp
        dmdown = dmdown * per + dm

        plus_dm.push(dmup)
        minus_dm.push(dmdown)
    }

    return [plus_dm, minus_dm]
}