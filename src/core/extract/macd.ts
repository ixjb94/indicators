

/**
 * 
 * @param source 
 * @param short_period 
 * @param long_period 
 * @param signal_period 
 * @param size
 * @returns [macd, signal, hist]
 */
export async function macd(
    source: Array<number>, short_period: number,
    long_period: number, signal_period: number,
    size: number = source.length
) {

    const macd: Array<number> = []
    const signal: Array<number> = []
    const hist: Array<number> = []

    // if (short_period < 1) throw new Error("Invalid Options")
    // if (long_period < 2) throw new Error("Invalid Options")
    // if (long_period < short_period) throw new Error("Invalid Options")
    // if (signal_period < 1) throw new Error("Invalid Options")
    // if (size <= long_period - 1) throw new Error("Out of range")

    const short_per = 2 / (short_period + 1)
    const long_per = 2 / (long_period + 1)
    const signal_per = 2 / (signal_period + 1)

    // if (short_period == 12 && long_period == 26) {
    // 	short_per = 0.15
    // 	long_per = 0.075
    // }

    let short_ema = source[0]
    let long_ema = source[0]
    let signal_ema = 0

    for (let i = 1; i < size; ++i) {
        short_ema = (source[i] - short_ema) * short_per + short_ema
        long_ema = (source[i] - long_ema) * long_per + long_ema
        const out = short_ema - long_ema

        if (i == long_period - 1) {
            signal_ema = out
        }
        if (i >= long_period - 1) {
            signal_ema = (out - signal_ema) * signal_per + signal_ema

            macd.push(out)
            signal.push(signal_ema)
            hist.push(out - signal_ema)
        }
    }

    return [macd, signal, hist]
}