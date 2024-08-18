

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function dema(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= (period-1) * 2) throw new Error("Out of range")

    const per = 2 / (period + 1)
    const per1 = 1.0 - per

    /*Calculate EMA(input)*/
    let ema = source[0]

    /*Calculate EMA(EMA(input))*/
    let ema2 = ema

    for (let i = 0; i < size; ++i) {
        ema = ema * per1 + source[i] * per

        if (i == period - 1) {
            ema2 = ema
        }

        if (i >= period - 1) {
            ema2 = ema2 * per1 + ema * per

            if (i >= (period - 1) * 2) {
                output.push(ema * 2 - ema2)
            }
        }
    }

    return output
}