import { BufferNewPush } from "../../types/indicators"

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param volume 
 * @param period 
 * @param size
 * @returns 
 */
export async function mfi(
    high: Array<number>, low: Array<number>,
    close: Array<number>, volume: Array<number>,
    period: number, size: number = high.length
) {

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period) throw new Error("Out of range")

    const output: Array<number> = []

    // Start TYPPRICE()
    let ytyp = ((high[(0)] + low[(0)] + close[(0)]) * (1.0 / 3.0))
    // End TYPPRICE()

    const up: BufferNewPush = {
        size: period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    const down: BufferNewPush = {
        size: period,
        index: 0,
        pushes: 0,
        sum: 0,
        vals: []
    }

    for (let i = 1; i < size; ++i) {

        // Start TYPPRICE()
        const typ = ((high[(i)] + low[(i)] + close[(i)]) * (1.0 / 3.0))
        // End TYPPRICE()

        const bar = typ * volume[i]

        if (typ > ytyp) {
            // Start ti_buffer_push
            // BUFFER = up
            // VAL    = bar
            // ti_buffer_push(up, bar)
            if (up.pushes >= up.size) {
                up.sum -= up.vals[up.index]
            }

            up.sum += bar
            up.vals[up.index] = bar
            up.pushes += 1
            up.index = (up.index + 1)
            if (up.index >= up.size) up.index = 0
            // End ti_buffer_push

            // Start ti_buffer_push
            // BUFFER = down
            // VAL    = 0.0
            // ti_buffer_push(down, 0.0)
            if (down.pushes >= down.size) {
                down.sum -= down.vals[down.index]
            }

            down.sum += 0.0
            down.vals[down.index] = 0.0
            down.pushes += 1
            down.index = (down.index + 1)
            if (down.index >= down.size) down.index = 0
            // End ti_buffer_push
        } else if (typ < ytyp) {
            // Start ti_buffer_push
            // BUFFER = down
            // VAL    = bar
            // ti_buffer_push(down, bar)
            if (down.pushes >= down.size) {
                down.sum -= down.vals[down.index]
            }

            down.sum += bar
            down.vals[down.index] = bar
            down.pushes += 1
            down.index = (down.index + 1)
            if (down.index >= down.size) down.index = 0
            // End ti_buffer_push

            // Start ti_buffer_push
            // BUFFER = up
            // VAL    = 0.0
            // ti_buffer_push(up, 0.0)
            if (up.pushes >= up.size) {
                up.sum -= up.vals[up.index]
            }

            up.sum += 0.0
            up.vals[up.index] = 0.0
            up.pushes += 1
            up.index = (up.index + 1)
            if (up.index >= up.size) up.index = 0
            // End ti_buffer_push
        } else {
            // Start ti_buffer_push
            // BUFFER = up
            // VAL    = 0.0
            // ti_buffer_push(up, 0.0)
            if (up.pushes >= up.size) {
                up.sum -= up.vals[up.index]
            }

            up.sum += 0.0
            up.vals[up.index] = 0.0
            up.pushes += 1
            up.index = (up.index + 1)
            if (up.index >= up.size) up.index = 0
            // End ti_buffer_push

            // Start ti_buffer_push
            // BUFFER = down
            // VAL    = 0.0
            // ti_buffer_push(down, 0.0)
            if (down.pushes >= down.size) {
                down.sum -= down.vals[down.index]
            }

            down.sum += 0.0
            down.vals[down.index] = 0.0
            down.pushes += 1
            down.index = (down.index + 1)
            if (down.index >= down.size) down.index = 0
            // End ti_buffer_push
        }

        ytyp = typ;

        if (i >= period) {
            output.push((up.sum / (up.sum + down.sum) * 100.0))
        }
    }

    return output
}