

/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size 
 * @returns 
 */
export async function dx(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const output: Array<number> = []

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
        // End CALC_DIRECTION

        dmup += dp
        dmdown += dm
    }

    let di_up = dmup
    let di_down = dmdown
    let dm_diff = Math.abs(di_up - di_down)
    let dm_sum = di_up + di_down
    let _dx = dm_diff / dm_sum * 100

    output.push(_dx)

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


        dmup = dmup * per + dp;
        dmdown = dmdown * per + dm;


        di_up = dmup
        di_down = dmdown
        dm_diff = Math.abs(di_up - di_down)
        dm_sum = di_up + di_down
        _dx = dm_diff / dm_sum * 100

        output.push(_dx)
    }

    return output
}