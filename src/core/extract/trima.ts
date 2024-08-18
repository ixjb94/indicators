

/**
 * 
 * @param source 
 * @param period 
 * @param size
 * @returns 
 */
export async function trima(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    const weights = 1 / ((period % 2) ?
        ((period / 2 + 1) * (period / 2 + 1)) :
        ((period / 2 + 1) * (period / 2)))

    let weight_sum = 0
    let lead_sum = 0
    let trail_sum = 0

    const lead_period = period % 2 ? period / 2 : period / 2 - 1
    const trail_period = lead_period + 1

    let w = 1

    for (let i = 0; i < period - 1; ++i) {
        weight_sum += source[i] * w

        if (i + 1 > period - lead_period) lead_sum += source[i]
        if (i + 1 <= trail_period) trail_sum += source[i]

        if (i + 1 < trail_period) ++w
        if (i + 1 >= period - lead_period) --w
    }


    let lsi = (period - 1) - lead_period + 1
    let tsi1 = (period - 1) - period + 1 + trail_period
    let tsi2 = (period - 1) - period + 1

    for (let i = period - 1; i < size; ++i) {
        weight_sum += source[i]
        output.push(weight_sum * weights)

        lead_sum += source[i]

        weight_sum += lead_sum;
        weight_sum -= trail_sum;

        lead_sum -= source[lsi++]
        trail_sum += source[tsi1++]
        trail_sum -= source[tsi2++]
    }

    return output
}