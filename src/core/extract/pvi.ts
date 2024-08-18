

/**
 * 
 * @param close 
 * @param volume 
 * @param size 
 * @returns 
 */
export async function pvi(
    close: Array<number>, volume: Array<number>,
    size: number = close.length
) {

    const output: Array<number> = []

    // if (size <= 0) throw new Error("Out of range")

    let pvi = 1000
    output.push(pvi)

    for (let i = 1; i < size; ++i) {

        if (volume[i] > volume[i - 1]) {
            pvi += ((close[i] - close[i - 1]) / close[i - 1]) * pvi;
        }
        output.push(pvi)
    }

    return output
}