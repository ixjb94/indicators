

/**
 * 
 * @param close 
 * @param volume 
 * @param size 
 * @returns 
 */
export async function nvi(
    close: Array<number>, volume: Array<number>,
    size: number = close.length
) {

    const output: Array<number> = []

    // if (size <= 0) throw new Error("Out of range")

    let nvi = 1000

    output.push(nvi)

    for (let i = 1; i < size; ++i) {

        if (volume[i] < volume[i - 1]) {
            nvi += ((close[i] - close[i - 1]) / close[i - 1]) * nvi
        }
        output.push(nvi)
    }

    return output
}