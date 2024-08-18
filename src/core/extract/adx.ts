/**
 * 
 * @param high 
 * @param low 
 * @param period 
 * @param size
 * @returns 
 */
export async function adx(
    high: Array<number>, low: Array<number>,
    period: number, size: number = high.length
) {

    const output = []

    // if (period < 2) throw new Error("Invalid Options")
    // if (size <= (period - 1) * 2) throw new Error("Out of range")

    const per = ((period - 1)) / period
    const invper = 1.0 / (period)

    let dmup = 0
    let dmdown = 0

    for (let index = 1; index < period; ++index) {

        let dp = high[index] - high[index - 1]
        let dm = low[index - 1] - low[index]

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


        dmup += dp
        dmdown += dm
    }

    let adx = 0.0

    let di_up = dmup;
    let di_down = dmdown;
    let dm_diff = Math.abs(di_up - di_down);
    let dm_sum = di_up + di_down;
    let dx = dm_diff / dm_sum * 100;

    adx += dx;

    for (let index = period; index < size; ++index) {

        let dp = high[index] - high[index - 1]
        let dm = low[index - 1] - low[index]

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


        dmup = dmup * per + dp
        dmdown = dmdown * per + dm

        di_up = dmup
        di_down = dmdown
        dm_diff = Math.abs(di_up - di_down)
        dm_sum = di_up + di_down
        dx = dm_diff / dm_sum * 100

        if (index - period < period - 2) {
            adx += dx
        } else if (index - period == period - 2) {
            adx += dx
            // output[output.length] = adx * invper
            output.push(adx * invper)
        } else {
            adx = adx * per + dx
            // output[output.length] = adx * invper
            output.push(adx * invper)
        }
    }

    return output
}