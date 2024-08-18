

/**
 * 
 * @param seriesA 
 * @param number 
 * @returns 
 */
export async function crossUnderNumber(seriesA: number[], number: number) {

    const output = []

    for (let index = 0; index < seriesA.length; index++) {
        const current = seriesA[index]
        const pre = seriesA[index - 1]

        if (
            current < number &&
            pre >= number
        ) {
            output.push(true)
        } else {
            output.push(false)
        }
    }

    return output
}