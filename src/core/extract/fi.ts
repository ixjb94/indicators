

/**
 * 
 * @param close 
 * @param volume 
 * @param period 
 * @param size 
 * @returns 
 */
export async function fi(
    close: Array<number>, volume: Array<number>,
    period: number, size: number = close.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= 1) throw new Error("Out of range")

    const per = 2. / (period + 1.)

    let ema = volume[1] * (close[1] - close[0])

    for (let i = 1; i < size; ++i) {
        ema = (volume[i] * (close[i] - close[i - 1]) - ema) * per + ema
        output.push(ema)
    }

    return output
}