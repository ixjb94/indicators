

/**
 * 
 * @param source 
 * @param period 
 * @param size
 * @returns 
 */
export async function fosc(
    source: Array<number>, period: number,
    size: number = source.length
) {

    const output: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period) throw new Error("Out of range")

    // LINEAR_REGRESSION(size, input, period, output, period+1)
    // Start LINEAR_REGRESSION
    let x = 0
    let x2 = 0

    let y = 0
    let xy = 0

    // Start INIT()
    const p = (1.0 / (period))
    let tsf = 0
    // End INIT()

    for (let i = 0; i < (period) - 1; ++i) {
        x += i + 1
        x2 += (i + 1) * (i + 1)
        xy += (source)[i] * (i + 1)
        y += (source)[i]
    }

    x += (period)
    x2 += (period) * (period)

    const bd = 1.0 / ((period) * x2 - x * x)

    for (let i = (period) - 1; i < (size); ++i) {
        xy += (source)[i] * (period)
        y += (source)[i]

        const b = ((period) * xy - x * y) * bd
        // Start FINAL()
        // ## forecast = period + 1
        const a = (y - b * x) * p
        if (i >= (period)) {
            output.push(100 * (source[i] - tsf) / source[i])
        }
        tsf = (a + b * (period + 1))
        // Start FINAL()

        xy -= y
        y -= (source)[i - (period) + 1]
    }
    // End LINEAR_REGRESSION

    return output
}