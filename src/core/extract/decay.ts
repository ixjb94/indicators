

/**
 * 
 * @param source 
 * @param period 
 * @param size 
 * @returns 
 */
export async function decay(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    const scale = 1.0 / period

    output.push(source[0])

    for (let i = 1; i < size; ++i) {
        const d = output[output.length - 1] - scale
        output.push(source[i] > d ? source[i] : d)
    }

    return output
}