

/**
 * 
 * @param high 
 * @param low 
 * @param close 
 * @param q_period 
 * @param r_period 
 * @param s_period 
 * @param size 
 * @returns 
 */
export async function smi(
    high: Array<number>, low: Array<number>,
    close: Array<number>, q_period: number,
    r_period: number, s_period: number,
    size: number = high.length
) {

    const output: Array<number> = []

    // if (q_period < 1 || r_period < 1 || s_period < 1) {
    //     throw new Error("Invalid Options"
    // }

    let progress = -q_period + 1

    let ema_r_num = NaN
    let ema_s_num = NaN
    let ema_r_den = NaN
    let ema_s_den = NaN
    let ll = 0
    let hh = 0
    let hh_idx = 0
    let ll_idx = 0

    let var1 = 0

    let i = 0
    for (; i < size && progress == -q_period + 1; ++i, ++progress) {
        hh = high[i]
        hh_idx = progress
        ll = low[i]
        ll_idx = progress
    }

    for (; i < size && progress < 0; ++i, ++progress) {
        if (hh <= high[i]) {
            hh = high[i]
            hh_idx = progress
        }

        if (ll >= low[i]) {
            ll = low[i]
            ll_idx = progress
        }
    }

    for (; i < size && progress == 0; ++i, ++progress) {
        if (hh <= high[i]) {
            hh = high[i]
            hh_idx = progress
        }

        if (ll >= low[i]) {
            ll = low[i]
            ll_idx = progress
        }

        ema_r_num = ema_s_num = close[i] - 0.5 * (hh + ll)
        ema_r_den = ema_s_den = hh - ll

        output.push(100 * ema_s_num / (0.5 * ema_s_den))
    }

    for (; i < size; ++i, ++progress) {
        if (hh_idx == progress - q_period) {
            hh = high[i]
            hh_idx = progress
            for (let j = 1; j < q_period; ++j) {
                var1 = high[i - j]
                if (var1 > hh) {
                    hh = var1
                    hh_idx = progress - j;
                }
            }

        } else if (hh <= high[i]) {
            hh = high[i]
            hh_idx = progress
        }

        if (ll_idx == progress - q_period) {
            ll = low[i]
            ll_idx = progress
            for (let j = 1; j < q_period; ++j) {
                var1 = low[i - j]
                if (var1 < ll) {
                    ll = var1
                    ll_idx = progress - j
                }
            }

        } else if (ll >= low[i]) {
            ll = low[i]
            ll_idx = progress
        }

        ema_r_num = ((close[i] - 0.5 * (hh + ll)) - ema_r_num) * (2 / (1 + r_period)) + ema_r_num
        ema_s_num = (ema_r_num - ema_s_num) * (2 / (1 + s_period)) + ema_s_num

        ema_r_den = ((hh - ll) - ema_r_den) * (2 / (1 + r_period)) + ema_r_den
        ema_s_den = (ema_r_den - ema_s_den) * (2 / (1 + s_period)) + ema_s_den

        output.push(100 * ema_s_num / (0.5 * ema_s_den))
    }

    return output
}