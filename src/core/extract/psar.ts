

/**
 * 
 * @param high 
 * @param low 
 * @param accel_step 
 * @param accel_max 
 * @param size 
 * @returns 
 */
export async function psar(
    high: Array<number>, low: Array<number>,
    accel_step: number, accel_max: number,
    size: number = high.length
) {

    const output: Array<number> = []

    // if (accel_step <= 0) throw new Error("Invalid Options")
    // if (accel_max <= accel_step) throw new Error("Invalid Options")
    // if (size < 2) throw new Error("Out of range")

    let lng
    if (high[0] + low[0] <= high[1] + low[1]) {
        lng = 1
    } else {
        lng = 0
    }

    let sar
    let extreme

    if (lng) {
        extreme = high[0]
        sar = low[0]
    } else {
        extreme = low[0]
        sar = high[0]
    }

    let accel = accel_step

    for (let i = 1; i < size; ++i) {

        sar = (extreme - sar) * accel + sar

        if (lng) {

            if (i >= 2 && (sar > low[i - 2])) sar = low[i - 2]

            if ((sar > low[i - 1])) sar = low[i - 1]

            if (accel < accel_max && high[i] > extreme) {
                accel += accel_step
                if (accel > accel_max) accel = accel_max
            }

            if (high[i] > extreme) extreme = high[i]

        } else {

            if (i >= 2 && (sar < high[i - 2])) sar = high[i - 2]

            if ((sar < high[i - 1])) sar = high[i - 1]

            if (accel < accel_max && low[i] < extreme) {
                accel += accel_step
                if (accel > accel_max) accel = accel_max
            }

            if (low[i] < extreme) extreme = low[i]
        }

        if ((lng && low[i] < sar) || (!lng && high[i] > sar)) {
            accel = accel_step
            sar = extreme

            lng = !lng

            if (!lng) {
                extreme = low[i]
            } else {
                extreme = high[i]
            }
        }

        output.push(sar)
    }

    return output
}