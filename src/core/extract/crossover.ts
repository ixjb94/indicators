

/**
 * 
 * @param a 
 * @param b 
 * @param size 
 * @returns 
 */
export async function crossover(a: number[], b: number[], size: number = a.length) {

    const output: boolean[] = []

    for (let i = 0; i < size; ++i) {
        output.push(a[i] > b[i] && a[i - 1] <= b[i - 1])
    }

    return output
}