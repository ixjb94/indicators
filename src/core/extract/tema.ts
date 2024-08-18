

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function tema(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= (period - 1) * 3) throw new Error("Out of range")

    const per = 2 / (period + 1)
    const per1 = 1.0 - per

    let ema = source[0]
    let ema2 = 0
    let ema3 = 0

    for (let i = 0; i < size; ++i) {
        ema = ema * per1 + source[i] * per
        if (i == period - 1) {
            ema2 = ema
        }

        if (i >= period - 1) {
            ema2 = ema2 * per1 + ema * per
            if (i == (period - 1) * 2) {
                ema3 = ema2
            }

            if (i >= (period - 1) * 2) {
                ema3 = ema3 * per1 + ema2 * per

                if (i >= (period - 1) * 3) {
                    output.push(3 * ema - 3 * ema2 + ema3)
                }
            }
        }
    }

    return output
}