

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param period 
 * @param coef 
 * @param size
 * @returns [ce_high, ce_low]
 */
export async function ce(
    high: Array<number>, low: Array<number>,
    close: Array<number>, period: number, coef: number,
    size: number = high.length
) {

    const ce_high: Array<number> = []
    const ce_low: Array<number> = []

    // if (period < 1) throw new Error("Invalid Options")
    // if (size <= period - 1) throw new Error("Out of range")

    let atr = high[0] - low[0]

    let truerange
    let val

    let HP = high[0]
    let HP_idx = 0
    let LP = low[0]
    let LP_idx = 0

    for (let i = 1; i < period; ++i) {
        // Start CALC_TRUERANGE()
        const l = low[i]
        const h = high[i]
        const c = close[i - 1]

        const ych = Math.abs(h - c)
        const ycl = Math.abs(l - c)

        let v = h - l

        if (ych > v) v = ych
        if (ycl > v) v = ycl
        truerange = v
        // End CALC_TRUERANGE()

        atr += truerange

        if (HP <= (val = high[i])) {
            HP = val;
            HP_idx = i;
        }
        if (LP >= (val = low[i])) {
            LP = val;
            LP_idx = i;
        }
    }

    atr /= period

    const smth = (period - 1) / period
    const per = 1 / period

    ce_high.push(HP - coef * atr)
    ce_low.push(LP + coef * atr)

    for (let i = period; i < size; ++i) {
        // Start CALC_TRUERANGE()
        const l = low[i]
        const h = high[i]
        const c = close[i - 1]

        const ych = Math.abs(h - c)
        const ycl = Math.abs(l - c)

        let v = h - l

        if (ych > v) v = ych
        if (ycl > v) v = ycl
        truerange = v
        // End CALC_TRUERANGE()
        atr = atr * smth + truerange * per

        if (HP <= (val = high[i])) {
            HP = val
            HP_idx = i
        } else if (HP_idx == i - period) {
            HP = high[i - period + 1]
            HP_idx = i - period + 1

            for (let j = i - period + 2; j <= i; ++j) {
                if (HP <= (val = high[j])) {
                    HP = val
                    HP_idx = j
                }
            }
        }

        if (LP >= (val = low[i])) {
            LP = val
            LP_idx = i
        } else if (LP_idx == i - period) {
            LP = low[i - period + 1]
            LP_idx = i - period + 1

            for (let j = i - period + 2; j <= i; ++j) {
                if (LP >= (val = low[j])) {
                    LP = val
                    LP_idx = j
                }
            }
        }

        ce_high.push(HP - coef * atr)
        ce_low.push(LP + coef * atr)
    }

    return [ce_high, ce_low]
}