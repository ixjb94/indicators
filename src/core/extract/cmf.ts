

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param volume 
 * @param period 
 * @param size 
 * @returns 
 */
export async function cmf(
    high: Array<number>, low: Array<number>,
    close: Array<number>, volume: Array<number>,
    period: number, size: number = high.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let period_volume = 0
    let period_ad_sum = 0

    for (let i = 0; i < period - 1; ++i) {
        // Start CHAIKIN_AD
        period_ad_sum += (high[i] - low[i] ? volume[i] * ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) : 0.)
        // End CHAIKIN_AD

        period_volume += volume[i]
    }

    for (let i = period - 1; i < size; ++i) {
        // Start CHAIKIN_AD
        period_ad_sum += (high[i] - low[i] ? volume[i] * ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) : 0.)
        // End CHAIKIN_AD
        period_volume += volume[i]

        output.push(period_ad_sum / period_volume)

        // Start CHAIKIN_AD
        // i = i-period+1
        period_ad_sum -= (high[i - period + 1] - low[i - period + 1] ? volume[i - period + 1] * ((close[i - period + 1] - low[i - period + 1]) - (high[i - period + 1] - close[i - period + 1])) / (high[i - period + 1] - low[i - period + 1]) : 0.)
        // End CHAIKIN_AD
        period_volume -= volume[i - period + 1]
    }

    return output
}