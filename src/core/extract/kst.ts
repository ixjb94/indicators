

/**
 * 
 * @param source 
 * @param roc1 
 * @param roc2 
 * @param roc3 
 * @param roc4 
 * @param ma1 
 * @param ma2 
 * @param ma3 
 * @param ma4 
 * @param size
 * @returns 
 */
export async function kst(
    source: Array<number>,
    roc1: number, roc2: number, roc3: number, roc4: number,
    ma1: number, ma2: number, ma3: number, ma4: number,
    size: number = source.length
) {

    const kst: Array<number> = []
    const kst_signal: Array<number> = []

    // if(!(roc1 < roc2 && roc2 < roc3 && roc3 < roc4)) throw new Error("Invalid Options")

    // if (roc1 < 1 || roc2 < 1 || roc3 < 1 || roc4 < 1 || ma1 < 1 || ma2 < 1 || ma3 < 1 || ma4 < 1) {
    // return "Invalid Options"
    // }

    // Start MAX4
    // MAX4(max_ma, ma1, ma2, ma3, ma4)
    let max_ma = ma1
    if (max_ma < ma2) max_ma = ma2
    if (max_ma < ma3) max_ma = ma3
    if (max_ma < ma4) max_ma = ma4
    // End MAX4

    const per1 = 2 / (ma1 + 1)
    const per2 = 2 / (ma2 + 1)
    const per3 = 2 / (ma3 + 1)
    const per4 = 2 / (ma4 + 1)
    const per_signal = 2 / (9 + 1)

    function ROC(idx: number, period: number) {
        return ((source[idx] - source[idx - period]) / source[idx - period])
    }

    let _1 = ROC(roc1, roc1)
    let _2 = ROC(roc2, roc2)
    let _3 = ROC(roc3, roc3)
    let _4 = ROC(roc4, roc4)

    for (let i = roc1 + 1; i < roc4 + 1 && i < size; ++i) {
        _1 = (ROC(i, roc1) - _1) * per1 + _1
    }
    for (let i = roc2 + 1; i < roc4 + 1 && i < size; ++i) {
        _2 = (ROC(i, roc2) - _2) * per2 + _2
    }
    for (let i = roc3 + 1; i < roc4 + 1 && i < size; ++i) {
        _3 = (ROC(i, roc3) - _3) * per3 + _3
    }
    for (let i = roc4 + 1; i < roc4 + 1 && i < size; ++i) {
        _4 = (ROC(i, roc4) - _4) * per4 + _4
    }

    let val = (_1 * 1 + _2 * 2 + _3 * 3 + _4 * 4) / 10
    kst_signal.push(val)

    let _signal = val
    kst.push(_signal)

    for (let i = roc4 + 1; i < size; ++i) {
        _1 = (ROC(i, roc1) - _1) * per1 + _1
        _2 = (ROC(i, roc2) - _2) * per2 + _2
        _3 = (ROC(i, roc3) - _3) * per3 + _3
        _4 = (ROC(i, roc4) - _4) * per4 + _4

        val = (_1 * 1 + _2 * 2 + _3 * 3 + _4 * 4) / 10
        kst.push(val)

        _signal = (val - _signal) * per_signal + _signal
        kst_signal.push(_signal)
    }

    return [kst, kst_signal]
}