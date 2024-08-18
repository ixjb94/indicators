

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param volume 
 * @param short_period 
 * @param long_period 
 * @param size 
 * @returns 
 */
export async function kvo(
    high: Array<number>, low: Array<number>,
    close: Array<number>, volume: Array<number>,
    short_period: number, long_period: number,
    size: number = high.length
) {

    // if (short_period < 1) throw new Error("Invalid Options")
    // if (long_period < short_period) throw new Error("Invalid Options")
    // if (size <= 1) throw new Error("Out of range")

    const short_per = 2 / (short_period + 1)
    const long_per = 2 / (long_period + 1)

    const output: Array<number> = []
    let cm = 0
    let prev_hlc = high[0] + low[0] + close[0]
    let trend = -1

    let short_ema = 0
    let long_ema = 0

    for (let i = 1; i < size; ++i) {
        const hlc = high[i] + low[i] + close[i]
        const dm = high[i] - low[i]

        if (hlc > prev_hlc && trend != 1) {
            trend = 1
            cm = high[i - 1] - low[i - 1]
        } else if (hlc < prev_hlc && trend != 0) {
            trend = 0
            cm = high[i - 1] - low[i - 1]
        }

        cm += dm

        const vf = volume[i] * Math.abs(dm / cm * 2 - 1) * 100 * (trend ? 1.0 : -1.0)

        if (i == 1) {
            short_ema = vf
            long_ema = vf
        } else {
            short_ema = (vf - short_ema) * short_per + short_ema
            long_ema = (vf - long_ema) * long_per + long_ema
        }

        output.push(short_ema - long_ema)

        prev_hlc = hlc
    }

    return output
}