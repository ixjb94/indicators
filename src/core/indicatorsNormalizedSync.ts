import { BufferNewQPush, BufferNewPush } from "../types/indicators"
import { ti_buffer } from "./ti_buffer"

export class IndicatorsNormalizedSync {

	constructor() { }

	// ################## Utils

	/**
	 * @param originalLength - example 100
	 * @param source - example ema | sma | rsi | etc.
	 * @param empty - example NaN | Null | 0 | false | etc.
	 * @returns 
	 */
	normalize(originalLength: number, source: Array<number> | string, empty = NaN) {
		const diff = originalLength - source.length

		const emptyList: Array<any> = []
		for (let index = 0; index < diff; ++index) {
			emptyList.push(empty)
		}

		const result = [...emptyList, ...source]

		return result
	}

	floor(x: number) {
		return x < 0 ? ~~x - 1 : ~~x;
	}

	sqrt(number: number, guess = number / 2.0): number {
		const betterGuess = (guess + number / guess) / 2.0
		const difference = guess > betterGuess ? guess - betterGuess : betterGuess - guess
		if (difference < 0.0000001) {
			return betterGuess
		} else {
			return this.sqrt(number, betterGuess)
		}
	}
	// ################## Indicators

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param volume 
	 * @param size
	 * @returns 
	 */
	ad(
		high: number[], low: number[],
		close: number[], volume: number[],
		size: number = close.length
	) {

		const output = []
	
		let sum = 0

		for (let index = 0; index < size; ++index) {
			const hl = (high[index] - low[index])
			if (hl != 0.0) {
				sum += (close[index] - low[index] - high[index] + close[index]) / hl * volume[index]
			}
			output[index] = sum
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param volume 
	 * @param short_period 
	 * @param long_period 
	 * @param size 
	 * @returns 
	 */
	adosc(
		high: number[], low: number[],
		close: number[], volume: number[],
		short_period: number, long_period: number,
		size: number = close.length
	) {

		const start = long_period - 1

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (size <= long_period - 1) return "Out of range"

		const short_per = 2 / (short_period + 1)
		const long_per = 2 / (long_period + 1)

		const output = []
		output[long_period - 2] = NaN

		let sum = 0
		let short_ema = 0
		let long_ema = 0

		for (let index = 0; index < size; ++index) {

			const hl = (high[index] - low[index])
			if (hl != 0.0) {
				sum += (close[index] - low[index] - high[index] + close[index]) / hl * volume[index]
			}

			if (index == 0) {
				short_ema = sum
				long_ema = sum
			} else {
				short_ema = (sum - short_ema) * short_per + short_ema
				long_ema = (sum - long_ema) * long_per + long_ema
			}

			if (index >= start) {
				// output[output.length] = short_ema - long_ema
				output.push(short_ema - long_ema)
			}
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	adx(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[((period - 2) * 2) + 1] = NaN

		// if (period < 2) return "Invalid Options"
		// if (size <= (period - 1) * 2) return "Out of range"

		const per = ((period - 1)) / period
		const invper = 1.0 / (period)

		let dmup = 0
		let dmdown = 0

		for (let index = 1; index < period; ++index) {

			let dp = high[index] - high[index - 1]
			let dm = low[index - 1] - low[index]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}


			dmup += dp
			dmdown += dm
		}

		let adx = 0.0

		let di_up = dmup;
		let di_down = dmdown;
		let dm_diff = Math.abs(di_up - di_down);
		let dm_sum = di_up + di_down;
		let dx = dm_diff / dm_sum * 100;

		adx += dx;
		
		for (let index = period; index < size; ++index) {

			let dp = high[index] - high[index - 1]
			let dm = low[index - 1] - low[index]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}


			dmup = dmup * per + dp
			dmdown = dmdown * per + dm

			di_up = dmup
			di_down = dmdown
			dm_diff = Math.abs(di_up - di_down)
			dm_sum = di_up + di_down
			dx = dm_diff / dm_sum * 100

			if (index - period < period - 2) {
				adx += dx
			} else if (index - period == period - 2) {
				adx += dx
				// output[output.length] = adx * invper
				output.push(adx * invper)
			} else {
				adx = adx * per + dx
				// output[output.length] = adx * invper
				output.push(adx * invper)
			}
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	adxr(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const output: Array<number> = []
		output[((period - 1) * 3) - 1] = NaN

		// if (period < 2) return "Invalid Options"
		// if (size <= (period-1) * 3) return "Out of Range"

		const per = (period - 1) / (period)
		const invper = 1.0 / (period)

		let dmup = 0
		let dmdown = 0

		for (let i = 1; i < period; ++i) {

			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// End CALC_DIRECTION

			dmup += dp
			dmdown += dm
		}

		let adx = 0.0

		let di_up = dmup
		let di_down = dmdown
		let dm_diff = Math.abs(di_up - di_down)
		let dm_sum = di_up + di_down
		let dx = dm_diff / dm_sum * 100

		adx += dx

		// Start ti_buffer_new
		const adxr: BufferNewQPush = {
			size: period - 1,
			pushes: 0,
			index: 0,
			vals: [],
		}
		// End ti_buffer_new

		const first_adxr = (period - 1) * 3

		for (let i = period; i < size; ++i) {

			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// End CALC_DIRECTION

			dmup = dmup * per + dp
			dmdown = dmdown * per + dm

			di_up = dmup
			di_down = dmdown
			dm_diff = Math.abs(di_up - di_down)
			dm_sum = di_up + di_down
			dx = dm_diff / dm_sum * 100

			if (i - period < period - 2) {
				adx += dx
			} else if (i - period == period - 2) {
				adx += dx
				// ## Start ti_buffer_qpush
				// BUFFER   = adxr
				// VAL      = adx * invper
				adxr.vals[adxr.index] = adx * invper
				adxr.index = adxr.index + 1
				if (adxr.index >= adxr.size) adxr.index = 0
				// ## End ti_buffer_qpush
			} else {
				adx = adx * per + dx

				if (i >= first_adxr) {
					// ## Start ti_buffer_get
					// BUFFER = adxr
					// VAL    = 1
					// ((BUFFER)->vals[((BUFFER)->index + (BUFFER)->size - 1 + (VAL)) % (BUFFER)->size])
					const a = adxr.vals[adxr.index]
					const b = (adxr.size - 1) + 1 // + 1 = VAL
					const c = adxr.size
					const buffer_get = a + b % c
					// ## End ti_buffer_get
					output.push((0.5 * (adx * invper + buffer_get)))
				}

				// ## Start ti_buffer_qpush
				adxr.vals[adxr.index] = adx * invper
				adxr.index = adxr.index + 1
				if (adxr.index >= adxr.size) adxr.index = 0
				// ## End ti_buffer_qpush
			}
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param size
	 * @returns 
	 */
	ao(
		high: number[], low: number[],
		size: number = high.length
	) {

		const period = 34;

		const output = []
		output[period - 2] = NaN

		// if (size <= 33) return "Out of range"

		let sum34 = 0
		let sum5 = 0
		const per34 = 1.0 / 34.0
		const per5 = 1.0 / 5.0

		for (let index = 0; index < 34; ++index) {
			const hl = 0.5 * (high[index] + low[index])

			sum34 += hl

			if (index >= 29) {
				sum5 += hl
			}
		}

		// output[output.length] = per5 * sum5 - per34 * sum34
		output.push(per5 * sum5 - per34 * sum34)

		for (let index = period; index < size; ++index) {
			const hl = 0.5 * (high[index] + low[index])

			sum34 += hl
			sum5 += hl

			sum34 -= 0.5 * (high[index - 34] + low[index - 34])
			sum5 -= 0.5 * (high[index - 5] + low[index - 5])

			// output[output.length] = per5 * sum5 - per34 * sum34
			output.push(per5 * sum5 - per34 * sum34)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param short_period 
	 * @param long_period 
	 * @param size
	 * @returns 
	 */
	apo(
		source: number[], short_period: number, long_period: number,
		size: number = source.length
	) {

		const output = []
		output[0] = NaN

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < 2) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (size <= 1) return "Out of range"

		const short_per = 2 / (short_period + 1)
		const long_per = 2 / (long_period + 1)

		let short_ema = source[0]
		let long_ema = source[0]

		for (let index = 1; index < size; ++index) {

			short_ema = (source[index] - short_ema) * short_per + short_ema
			long_ema = (source[index] - long_ema) * long_per + long_ema

			const out = short_ema - long_ema

			// output[output.length] = out
			output.push(out)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns [Aroon_Down, Aroon_Up]
	 */
	aroon(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const adown: number[] = []
		const aup: number[] = []

		adown[period - 1] = NaN
		aup[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		const scale = 100.0 / period
		let trail = 0
		let maxi = -1
		let mini = -1
		let max = high[0]
		let min = low[0]
		let bar: number

		let j
		for (let index = period; index < size; ++index, ++trail) {

			// Maintain highest
			bar = high[index]

			if (maxi < trail) {
				maxi = trail
				max = high[maxi]
				j = trail

				while (++j <= index) {
					bar = high[j]

					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = index
				max = bar
			}

			// Maintain lowest
			bar = low[index]
			if (mini < trail) {
				mini = trail
				min = low[mini]
				j = trail
				while (++j <= index) {
					bar = low[j]
					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = index
				min = bar
			}

			adown[adown.length] = (period - (index - mini)) * scale
			aup[aup.length] = (period - (index - maxi)) * scale
		}

		return [adown, aup]
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	aroonosc(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		const scale = 100.0 / period

		let trail = 0
		let maxi = -1
		let mini = -1
		let max = high[0]
		let min = low[0]

		let j: number
		for (let index = period; index < size; ++index, ++trail) {

			// Maintain highest
			let bar = high[index]
			if (maxi < trail) {
				maxi = trail
				max = high[maxi]
				j = trail
				while (++j <= index) {
					bar = high[j];
					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = index
				max = bar
			}


			// Maintain lowest
			bar = low[index]
			if (mini < trail) {
				mini = trail
				min = low[mini]
				j = trail
				while (++j <= index) {
					bar = low[j]
					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = index
				min = bar
			}

			// output[output.length] = (maxi - mini) * scale
			output.push((maxi - mini) * scale)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	atr(
		high: number[], low: number[], close: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid options"
		// if (size <= period - 1) return "Out of range"

		const per = 1.0 / period

		let sum = 0
		let truerange: number

		sum += high[0] - low[0]

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

			sum += truerange
		}

		let val = sum / period

		// output[output.length] = val
		output.push(val)

		for (let index = period; index < size; ++index) {
			// CALC TRUE RANGE
			const l = low[index]
			const h = high[index]
			const c = close[index - 1]

			const ych = Math.abs(h - c)
			const ycl = Math.abs(l - c)

			let v = h - l

			if (ych > v) v = ych
			if (ycl > v) v = ycl
			truerange = v
			// CALC TRUE RANGE

			val = (truerange - val) * per + val

			// output[output.length] = val
			output.push(val)
		}

		return output
	}

	/**
	 * 
	 * @param open 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param size
	 * @returns 
	 */
	avgprice(
		open: number[], high: number[],
		low: number[], close: number[],
		size: number = open.length
	) {

		const output: number[] = []

		for (let index = 0; index < size; ++index) {
			output.push((open[index] + high[index] + low[index] + close[index]) * 0.25)
		}

		return output
	}


	/**
	 * @param source 
	 * @param period 
	 * @param stddev 
	 * @param size
	 * @returns [Lower, Middle, Upper]
	 */
	bbands(
		source: number[], period: number, stddev: number,
		size: number = source.length
	) {

		const lower: number[] = []
		const middle: number[] = []
		const upper: number[] = []

		lower[period - 2] = NaN
		middle[period - 2] = NaN
		upper[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0
		let sum2 = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]
		}

		let sd = Math.sqrt(sum2 * scale - (sum * scale) * (sum * scale))

		const calc_middle = sum * scale
		lower.push(calc_middle - stddev * sd)
		upper.push(calc_middle + stddev * sd)
		middle.push(calc_middle)

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]

			sum -= source[i - period]
			sum2 -= source[i - period] * source[i - period]

			sd = Math.sqrt(sum2 * scale - (sum * scale) * (sum * scale))

			const calc_middle = sum * scale
			upper.push(calc_middle + stddev * sd)
			lower.push(calc_middle - stddev * sd)
			middle.push(calc_middle)
		}

		return [lower, middle, upper]
	}

	/**
	 * 
	 * @param open 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param size
	 * @returns 
	 */
	bop(
		open: number[], high: number[],
		low: number[], close: number[],
		size: number = open.length
	) {

		const output: number[] = []

		for (let index = 0; index < size; ++index) {
			const hl = high[index] - low[index]

			if (hl <= 0.0) {
				output[index] = 0
			} else {
				output[index] = (close[index] - open[index]) / hl
			}
		}

		return output
	}


	/**
	 * @TODO Update TYPEPRICE
	 * @Updated
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	cci(
		high: number[], low: number[],
		close: number[], period: number,
		size: number = high.length
	) {

		const scale = 1.0 / period
	
		// if (period < 1) return "Invalid Options"
		// if (size <= (period-1) * 2) return "Out of range"

		const output: number[] = []
		output[((period - 2) * 2) + 1] = NaN
	
		const sum = new ti_buffer(period)
	
		let i: number
		let j: number
		for (i = 0; i < size; ++i) {
			
			// Start TYPEPRICE
			// ((high[(INDEX)] + low[(INDEX)] + close[(INDEX)]) * (1.0/3.0))
			const today = ((high[(i)] + low[(i)] + close[(i)]) * (1.0 / 3.0))
			// End TYPEPRICE

			sum.push(today)
			const avg = sum.sum * scale
	
			if (i >= period * 2 - 2) {
				let acc = 0
				for (j = 0; j < period; ++j) {
					acc += Math.abs(avg - sum.vals[j])
				}
	
				let cci = acc * scale
				cci *= .015
				cci = (today-avg)/cci
				output.push(cci)
			}
		}
	
		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	cmo(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid options"
		// if (size <= period) return "Out of range"

		let up_sum = 0
		let down_sum = 0

		for (let i = 1; i <= period; ++i) {
			// Start UPWARD
			// up_sum += UPWARD(i)
			up_sum += (source[(i)] > source[(i) - 1] ? source[(i)] - source[(i) - 1] : 0)
			// End UPWARD

			// Start DOWNWARD
			// down_sum += DOWNWARD(i)
			down_sum += (source[(i)] < source[(i) - 1] ? source[(i) - 1] - source[(i)] : 0)
			// End DOWNWARD
		}

		output.push(100 * (up_sum - down_sum) / (up_sum + down_sum))

		for (let i = period + 1; i < size; ++i) {
			// i - period
			up_sum -= (source[(i - period)] > source[(i - period) - 1] ? source[(i - period)] - source[(i - period) - 1] : 0)
			down_sum -= (source[(i - period)] < source[(i - period) - 1] ? source[(i - period) - 1] - source[(i - period)] : 0)

			// i
			up_sum += (source[(i)] > source[(i) - 1] ? source[(i)] - source[(i) - 1] : 0)
			down_sum += (source[(i)] < source[(i) - 1] ? source[(i) - 1] - source[(i)] : 0)

			output.push(100 * (up_sum - down_sum) / (up_sum + down_sum))
		}

		return output
	}

	/**
	 * @param a 
	 * @param b 
	 * @param size 
	 */
	crossany(a: number[], b: number[], size: number = a.length) {
	
		const output: boolean[] = []
	
		for (let i = 0; i < size; ++i) {
			output.push( (a[i] > b[i] && a[i-1] <= b[i-1])
					 || (a[i] < b[i] && a[i-1] >= b[i-1])
			)
		}

		return output
	}

	/**
	 * @param a 
	 * @param b 
	 * @param size 
	 * @returns 
	 */
	crossover(a: number[], b: number[], size: number = a.length) {
	
		const output: boolean[] = []
	
		for (let i = 0; i < size; ++i) {
			output.push(a[i] > b[i] && a[i-1] <= b[i-1])
		}

		return output
	}

	/**
	 * @param seriesA 
	 * @param number 
	 * @returns 
	 */
	crossOverNumber(seriesA: number[], number: number) {
    
		const output = []
	
		for (let index = 0; index < seriesA.length; index++) {
			const current = seriesA[index]
			const pre     = seriesA[index - 1]
			
			if (
				current > number &&
				pre <= number
			) {
				output.push(true)
			} else {
				output.push(false)
			}
		}
	
		return output
	}
	
	/**
	 * 
	 * @param seriesA 
	 * @param number 
	 * @returns 
	 */
	crossUnderNumber(seriesA: number[], number: number) {
		
		const output = []
	
		for (let index = 0; index < seriesA.length; index++) {
			const current = seriesA[index]
			const pre     = seriesA[index - 1]
			
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

	/**
	 * @Updated
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	cvi(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[(period - 1) * 2] = NaN
	
		const per = 2 / (period + 1)
	
		const lag =  new ti_buffer(period)
	
		let val = high[0]-low[0]
	
		let i
		for (i = 1; i < period*2-1; ++i) {
			val = ((high[i]-low[i])-val) * per + val
			
			lag.qpush(val)
		}
	
		for (i = period*2-1; i < size; ++i) {
			val = ((high[i]-low[i])-val) * per + val

			const old = lag.vals[lag.index]

			output.push(100.0 * (val - old) / old)
			
			lag.qpush(val)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	decay(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []

		const scale = 1.0 / period

		output.push(source[0])

		for (let i = 1; i < size; ++i) {
			const d = output[output.length - 1] - scale
			output.push(source[i] > d ? source[i] : d)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	dema(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[((period - 1) * 2) - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= (period-1) * 2) return "Out of range"

		const per = 2 / (period + 1)
		const per1 = 1.0 - per

		/*Calculate EMA(input)*/
		let ema = source[0]

		/*Calculate EMA(EMA(input))*/
		let ema2 = ema

		for (let i = 0; i < size; ++i) {
			ema = ema * per1 + source[i] * per

			if (i == period - 1) {
				ema2 = ema
			}

			if (i >= period - 1) {
				ema2 = ema2 * per1 + ema * per

				if (i >= (period - 1) * 2) {
					output.push(ema * 2 - ema2)
				}
			}
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size 
	 * @returns [Plus DI, Minus DI]
	 */
	di(
		high: number[], low: number[], close: number[],
		period: number, size: number = high.length
	) {

		const plus_di: number[] = []
		const minus_di: number[] = []

		plus_di[period - 2] = NaN
		minus_di[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const per = (period - 1) / (period)

		let atr = 0
		let dmup = 0
		let dmdown = 0

		for (let i = 1; i < period; ++i) {

			// let truerange: number
			// Start CALC_TRUERANGE()
			const l = low[i]
			const h = high[i]
			const c = close[i - 1]
			const ych = Math.abs(h - c)
			const ycl = Math.abs(l - c)
			let v = h - l
			if (ych > v) v = ych
			if (ycl > v) v = ycl
			const truerange = v
			// End CALC_TRUERANGE()
			atr += truerange

			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// END CALC_DIRECTION

			dmup += dp;
			dmdown += dm;
		}


		plus_di.push(100.0 * dmup / atr)
		minus_di.push(100.0 * dmdown / atr)

		for (let i = period; i < size; ++i) {
			// let truerange
			// Start CALC_TRUERANGE()
			const l = low[i]
			const h = high[i]
			const c = close[i - 1]
			const ych = Math.abs(h - c)
			const ycl = Math.abs(l - c)
			let v = h - l
			if (ych > v) v = ych
			if (ycl > v) v = ycl
			const truerange = v
			// End CALC_TRUERANGE()
			atr = atr * per + truerange

			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// END CALC_DIRECTION


			dmup = dmup * per + dp;
			dmdown = dmdown * per + dm;

			plus_di.push(100.0 * dmup / atr)
			minus_di.push(100.0 * dmdown / atr)
		}

		return [plus_di, minus_di]
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns [Plus DM, Minus DM]
	 */
	dm(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const plus_dm: number[] = []
		const minus_dm: number[] = []

		plus_dm[period - 2] = NaN
		minus_dm[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const per = (period - 1) / (period)

		let dmup = 0
		let dmdown = 0

		for (let i = 1; i < period; ++i) {
			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// END CALC_DIRECTION

			dmup += dp
			dmdown += dm
		}


		plus_dm.push(dmup)
		minus_dm.push(dmdown)

		for (let i = period; i < size; ++i) {
			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// END CALC_DIRECTION

			dmup = dmup * per + dp
			dmdown = dmdown * per + dm

			plus_dm.push(dmup)
			minus_dm.push(dmdown)
		}

		return [plus_dm, minus_dm]
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	dpo(
		source: number[], period: number,
		size: number = source.length
	) {

		const back = period / 2 + 1

		const output: number[] = []
		output[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
		}

		output.push(source[period - 1 - back] - (sum * scale))

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum -= source[i - period]
			output.push(source[i - back] - (sum * scale))
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	dx(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const per = (period - 1) / (period)

		let dmup = 0
		let dmdown = 0

		for (let i = 1; i < period; ++i) {

			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// End CALC_DIRECTION

			dmup += dp
			dmdown += dm
		}

		let di_up = dmup
		let di_down = dmdown
		let dm_diff = Math.abs(di_up - di_down)
		let dm_sum = di_up + di_down
		let _dx = dm_diff / dm_sum * 100

		output.push(_dx)


		for (let i = period; i < size; ++i) {

			// Start CALC_DIRECTION
			let dp = high[i] - high[i - 1]
			let dm = low[i - 1] - low[i]

			if (dp < 0) {
				dp = 0
			} else if (dp > dm) {
				dm = 0
			}

			if (dm < 0) {
				dm = 0
			} else if (dm > dp) {
				dp = 0
			}
			// End CALC_DIRECTION


			dmup = dmup * per + dp;
			dmdown = dmdown * per + dm;


			di_up = dmup
			di_down = dmdown
			dm_diff = Math.abs(di_up - di_down)
			dm_sum = di_up + di_down
			_dx = dm_diff / dm_sum * 100

			output.push(_dx)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	edecay(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []

		const scale = 1.0 - 1.0 / period

		output.push(source[0])

		for (let i = 1; i < size; ++i) {
			const d = output[output.length - 1] * scale
			output.push(source[i] > d ? source[i] : d)
		}

		return output
	}

	/**
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	ema(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []

		// if (period < 1) return "Invalid Options"
		// if (size <= 0) return "Out of range"

		const per = 2 / (period + 1)

		let val = source[0]
		output.push(val)

		for (let i = 1; i < size; ++i) {
			val = (source[i] - val) * per + val
			output.push(val)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param volume 
	 * @param size
	 * @returns 
	 */
	emv(
		high: number[], low: number[], volume: number[],
		size: number = high.length
	) {

		const output: number[] = []
		output[0] = NaN

		// if (size <= 1) return "Out of range"

		let last = (high[0] + low[0]) * 0.5

		for (let i = 1; i < size; ++i) {
			const hl = (high[i] + low[i]) * 0.5
			const br = volume[i] / 10000.0 / (high[i] - low[i])

			output.push((hl - last) / br)
			last = hl
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns [fisher, signal]
	 */
	fisher(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const fisher: number[] = []
		const signal: number[] = []

		fisher[period - 2] = NaN
		signal[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let trail = 0
		let maxi = -1
		let mini = -1

		let max = (0.5 * (high[(0)] + low[(0)]))
		let min = (0.5 * (high[(0)] + low[(0)]))
		let val1 = 0.0
		let bar
		let fish = 0.0

		let j: number
		for (let i = period - 1; i < size; ++i, ++trail) {
			/* Maintain highest. */
			bar = (0.5 * (high[(i)] + low[(i)]))
			if (maxi < trail) {
				maxi = trail
				max = (0.5 * (high[(maxi)] + low[(maxi)]))
				j = trail

				while (++j <= i) {
					bar = (0.5 * (high[(j)] + low[(j)]))
					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = i
				max = bar
			}


			/* Maintain lowest. */
			bar = (0.5 * (high[(i)] + low[(i)]))
			if (mini < trail) {
				mini = trail
				min = (0.5 * (high[(mini)] + low[(mini)]))
				j = trail

				while (++j <= i) {
					bar = (0.5 * (high[(j)] + low[(j)]))
					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = i
				min = bar
			}

			let mm = max - min
			if (mm == 0.0) mm = 0.001
			val1 = 0.33 * 2.0 * (((0.5 * (high[(i)] + low[(i)])) - min) / (mm) - 0.5) + 0.67 * val1
			if (val1 > 0.99) val1 = .999
			if (val1 < -0.99) val1 = -.999

			signal.push(fish)
			fish = 0.5 * Math.log((1.0 + val1) / (1.0 - val1)) + 0.5 * fish
			fisher.push(fish)
		}

		return [fisher, signal]
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	fosc(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

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


	/**
	 * 
	 * @param input 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	hma(input: number[], period: number, size=input.length) {

		const output: number[] = []
	
		const period2 = Math.floor(period / 2)
		const periodsqrt = Math.floor(Math.sqrt(period))
	
		const weights = period * (period+1) / 2;
		const weights2 = period2 * (period2+1) / 2;
		const weightssqrt = periodsqrt * (periodsqrt+1) / 2;
	
		// Normalize Output
		output[((period - 1) + periodsqrt - 2)] = NaN

		let sum = 0; /* Flat sum of previous numbers. */
		let weight_sum = 0; /* Weighted sum of previous numbers. */
	
		let sum2 = 0;
		let weight_sum2 = 0;
	
		let sumsqrt = 0;
		let weight_sumsqrt = 0;
	
		/* Setup up the WMA(period) and WMA(period/2) on the input. */
		let i: number;
		for (i = 0; i < period-1; ++i) {
			weight_sum += input[i] * (i+1);
			sum += input[i];
	
			if (i >= period - period2) {
				weight_sum2 += input[i] * (i+1-(period-period2));
				sum2 += input[i];
			}
		}
	
		const buff = new ti_buffer(periodsqrt)
	
		for (i = period-1; i < size; ++i) {
			weight_sum += input[i] * period;
			sum += input[i];
	
			weight_sum2 += input[i] * period2;
			sum2 += input[i];
	
			const wma = weight_sum / weights;
			const wma2 = weight_sum2 / weights2;
			const diff = 2 * wma2 - wma;
	
			weight_sumsqrt += diff * periodsqrt;
			sumsqrt += diff;
	
			buff.qpush(diff)
	
			if (i >= (period-1) + (periodsqrt-1)) {
				output.push(weight_sumsqrt / weightssqrt)
	
				weight_sumsqrt -= sumsqrt;
				// sumsqrt -= ti_buffer_get(buff, 1)
				sumsqrt -= buff.get(1)
			} else {
				weight_sumsqrt -= sumsqrt
			}
	
	
			weight_sum -= sum;
			sum -= input[i-period+1];
	
			weight_sum2 -= sum2;
			sum2 -= input[i-period2+1];
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	kama(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const short_per = 2 / (2.0 + 1)
		const long_per = 2 / (30.0 + 1)

		let sum = 0

		for (let i = 1; i < period; ++i) {
			sum += Math.abs(source[i] - source[i - 1])
		}

		let kama = source[period - 1]
		output.push(kama)
		let er: number
		let sc: number

		for (let i = period; i < size; ++i) {
			sum += Math.abs(source[i] - source[i - 1])

			if (i > period) {
				sum -= Math.abs(source[i - period] - source[i - period - 1])
			}

			if (sum != 0.0) {
				er = Math.abs(source[i] - source[i - period]) / sum
			} else {
				er = 1.0
			}
			sc = Math.pow(er * (short_per - long_per) + long_per, 2)

			kama = kama + sc * (source[i] - kama)
			output.push(kama)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param volume 
	 * @param short_period 
	 * @param long_period 
	 * @param size 
	 * @returns 
	 */
	kvo(
		high: number[], low: number[],
		close: number[], volume: number[],
		short_period: number, long_period: number,
		size: number = high.length
	) {

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (size <= 1) return "Out of range"

		const short_per = 2 / (short_period + 1)
		const long_per = 2 / (long_period + 1)

		const output: number[] = []
		output[0] = NaN

		let cm = 0
		let prev_hlc = high[0] + low[0] + close[0]
		let trend = -1

		let short_ema = 0
		let long_ema = 0

		for (let i = 1; i < size; ++i) {
			const hlc = high[i] + low[i] + close[i]
			const dm = high[i] - low[i]

			if (hlc > prev_hlc && trend != 1) {
				trend = 1
				cm = high[i - 1] - low[i - 1]
			} else if (hlc < prev_hlc && trend != 0) {
				trend = 0
				cm = high[i - 1] - low[i - 1]
			}

			cm += dm

			const vf = volume[i] * Math.abs(dm / cm * 2 - 1) * 100 * (trend ? 1.0 : -1.0)

			if (i == 1) {
				short_ema = vf
				long_ema = vf
			} else {
				short_ema = (vf - short_ema) * short_per + short_ema
				long_ema = (vf - long_ema) * long_per + long_ema
			}

			output.push(short_ema - long_ema)

			prev_hlc = hlc
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	lag(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 0) return "Invalid Options"
		// if (size <= period) return "Out of range"

		for (let i = period; i < size; ++i) {
			output.push(source[i - period])
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	linreg(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		// Start LINEAR_REGRESSION
		// LINEAR_REGRESSION(size, input, period, output, period)
		let x = 0
		let x2 = 0

		let y = 0
		let xy = 0
		// Start INIT()
		const p = (1.0 / (period))
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
			// Start FINAL
			// ## forecast = period
			const a = (y - b * x) * p
			output.push(a + b * (period))
			// Start FINAL

			xy -= y
			y -= (source)[i - (period) + 1]
		}
		// End LINEAR_REGRESSION

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	linregintercept(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		// Start LINEAR_REGRESSION
		// LINEAR_REGRESSION(size, input, period, output, 1)
		let x = 0
		let x2 = 0

		let y = 0
		let xy = 0
		// Start INIT()
		const p = (1.0 / (period))
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
			// Start FINAL
			// ## forecast = 1
			const a = (y - b * x) * p
			output.push(a + b * (1))
			// Start FINAL

			xy -= y
			y -= (source)[i - (period) + 1]
		}
		// End LINEAR_REGRESSION

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	linregslope(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		// Start LINEAR_REGRESSION
		// LINEAR_REGRESSION(size, input, period, output, period)
		let x = 0
		let x2 = 0

		let y = 0
		let xy = 0
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
			// Start FINAL
			// ## forecast = 1
			output.push(b)
			// Start FINAL

			xy -= y
			y -= (source)[i - (period) + 1]
		}
		// End LINEAR_REGRESSION

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param short_period 
	 * @param long_period 
	 * @param signal_period 
	 * @param size
	 * @returns [macd, signal, hist]
	 */
	macd(
		source: number[], short_period: number,
		long_period: number, signal_period: number,
		size: number = source.length
	) {

		const macd: number[] = []
		const signal: number[] = []
		const hist: number[] = []

		macd[long_period - 2] = NaN
		signal[long_period - 2] = NaN
		hist[long_period - 2] = NaN

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < 2) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (signal_period < 1) return "Invalid Options"
		// if (size <= long_period - 1) return "Out of range"

		const short_per = 2 / (short_period + 1)
		const long_per = 2 / (long_period + 1)
		const signal_per = 2 / (signal_period + 1)

		// if (short_period == 12 && long_period == 26) {
		// 	short_per = 0.15
		// 	long_per = 0.075
		// }

		let short_ema = source[0]
		let long_ema = source[0]
		let signal_ema = 0

		for (let i = 1; i < size; ++i) {
			short_ema = (source[i] - short_ema) * short_per + short_ema
			long_ema = (source[i] - long_ema) * long_per + long_ema
			const out = short_ema - long_ema

			if (i == long_period - 1) {
				signal_ema = out
			}
			if (i >= long_period - 1) {
				signal_ema = (out - signal_ema) * signal_per + signal_ema

				macd.push(out)
				signal.push(signal_ema)
				hist.push(out - signal_ema)
			}
		}

		return [macd, signal, hist]
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param volume 
	 * @param size
	 * @returns 
	 */
	marketfi(
		high: number[], low: number[],
		volume: number[], size: number = high.length
	) {

		const output: number[] = []

		// if (size <= 0) return "Out of range"

		for (let i = 0; i < size; ++i) {
			output.push((high[i] - low[i]) / volume[i])
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	mass(
		high: number[], low: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[(16 + period - 2)] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= 16 + sum_p) return "Out of range"

		const per = 2 / (9.0 + 1)
		const per1 = 1.0 - per

		let ema = high[0] - low[0]

		let ema2 = ema

		const sum: BufferNewPush = {
			index: 0,
			pushes: 0,
			size: period,
			sum: 0,
			vals: []
		}

		for (let i = 0; i < size; ++i) {
			const hl = high[i] - low[i]

			ema = ema * per1 + hl * per

			if (i == 8) {
				ema2 = ema
			}

			if (i >= 8) {
				ema2 = ema2 * per1 + ema * per

				if (i >= 16) {
					// Start ti_buffer_push
					// BUFFER = sum
					// VAL    = ema/ema2
					if (sum.pushes >= sum.size) {
						sum.sum -= sum.vals[sum.index]
					}

					sum.sum += ema / ema2
					sum.vals[sum.index] = ema / ema2
					sum.pushes += 1
					sum.index = (sum.index + 1)
					if (sum.index >= sum.size) sum.index = 0
					// End ti_buffer_push

					if (i >= 16 + period - 1) {
						output.push(sum.sum)
					}
				}
			}
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period
	 * @param size
	 * @returns 
	 */
	max(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let trail = 0
		let maxi = -1
		let max = source[0]

		let j: number
		for (let i = period - 1; i < size; ++i, ++trail) {
			let bar = source[i]

			if (maxi < trail) {
				maxi = trail
				max = source[maxi]
				j = trail

				while (++j <= i) {
					bar = source[j]

					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = i
				max = bar
			}

			output.push(max)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	md(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0

		let j: number
		for (let i = 0; i < size; ++i) {
			const today = source[i]
			sum += today
			if (i >= period) sum -= source[i - period]

			const avg = sum * scale

			if (i >= period - 1) {
				let acc = 0
				for (j = 0; j < period; ++j) {
					acc += Math.abs(avg - source[i - j])
				}

				output.push(acc * scale)
			}
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param size 
	 * @returns 
	 */
	medprice(
		high: number[], low: number[],
		size: number = high.length
	) {

		const output: number[] = []

		for (let i = 0; i < size; ++i) {
			output.push((high[i] + low[i]) * 0.5)
		}

		return output
	}

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
	mfi(
		high: number[], low: number[],
		close: number[], volume: number[],
		period: number, size: number = high.length
	) {

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		const output: number[] = []
		output[period - 1] = NaN

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

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	min(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let trail = 0
		let mini = -1
		let min = source[0]

		let j: number
		for (let i = period - 1; i < size; ++i, ++trail) {
			let bar = source[i]

			if (mini < trail) {
				mini = trail
				min = source[mini]
				j = trail

				while (++j <= i) {
					bar = source[j]

					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = i
				min = bar
			}

			output.push(min)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	mom(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		for (let i = period; i < size; ++i) {
			output.push(source[i] - source[i - period])
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns [sine, lead]
	 */
	msw(
		source: number[], period: number,
		size: number = source.length
	) {

		const sine: number[] = []
		const lead: number[] = []

		sine[period - 1] = NaN
		lead[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		const pi = 3.1415926
		const tpi = 2 * pi

		let weight = 0
		let phase: number
		let rp: number
		let ip: number

		let j: number
		for (let i = period; i < size; ++i) {
			rp = 0
			ip = 0

			for (j = 0; j < period; ++j) {
				weight = source[i - j]
				rp = rp + Math.cos(tpi * j / period) * weight
				ip = ip + Math.sin(tpi * j / period) * weight
			}

			if (Math.abs(rp) > .001) {
				phase = Math.atan(ip / rp)
			} else {
				phase = tpi / 2.0 * (ip < 0 ? -1.0 : 1.0)
			}

			if (rp < 0.0) phase += pi
			phase += pi / 2.0

			if (phase < 0.0) phase += tpi
			if (phase > tpi) phase -= tpi

			sine.push(Math.sin(phase))
			lead.push(Math.sin(phase + pi / 4.0))
		}

		return [sine, lead]
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	natr(
		high: number[], low: number[],
		close: number[], period: number,
		size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const per = 1.0 / (period)

		let sum = 0
		let truerange: number

		sum += high[0] - low[0]

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

			sum += truerange
		}


		let val = sum / period
		output.push(100 * (val) / close[period - 1])

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
			val = (truerange - val) * per + val
			output.push(100 * (val) / close[i])
		}

		return output
	}

	/**
	 * 
	 * @param close 
	 * @param volume 
	 * @param size 
	 * @returns 
	 */
	nvi(
		close: number[], volume: number[],
		size: number = close.length
	) {

		const output: number[] = []

		// if (size <= 0) return "Out of range"

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

	/**
	 * 
	 * @param close 
	 * @param volume 
	 * @param size 
	 * @returns 
	 */
	obv(
		close: number[], volume: number[],
		size: number = close.length
	) {

		const output: number[] = []
		let sum = 0
		output.push(sum)

		let prev = close[0]

		for (let i = 1; i < size; ++i) {
			if (close[i] > prev) {
				sum += volume[i]
			} else if (close[i] < prev) {
				sum -= volume[i]
			} else {
				// No change.
			}

			prev = close[i]
			output.push(sum)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param short_period 
	 * @param long_period 
	 * @param size 
	 * @returns 
	 */
	ppo(
		source: number[], short_period: number,
		long_period: number, size: number = source.length
	) {

		const ppo: number[] = []
		ppo[0] = NaN

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < 2) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (size <= 1) return "Out of range"

		const short_per = 2 / (short_period + 1)
		const long_per = 2 / (long_period + 1)

		let short_ema = source[0]
		let long_ema = source[0]

		for (let i = 1; i < size; ++i) {
			short_ema = (source[i] - short_ema) * short_per + short_ema
			long_ema = (source[i] - long_ema) * long_per + long_ema
			const out = 100.0 * (short_ema - long_ema) / long_ema

			ppo.push(out)
		}

		return ppo
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param accel_step 
	 * @param accel_max 
	 * @param size 
	 * @returns 
	 */
	psar(
		high: number[], low: number[],
		accel_step: number, accel_max: number,
		size: number = high.length
	) {

		const output: number[] = []
		output[0] = NaN

		// if (accel_step <= 0) return "Invalid Options"
		// if (accel_max <= accel_step) return "Invalid Options"
		// if (size < 2) return "Out of range"

		let lng: boolean | number
		if (high[0] + low[0] <= high[1] + low[1]) {
			lng = 1
		} else {
			lng = 0
		}

		let sar: number
		let extreme: number

		if (lng) {
			extreme = high[0]
			sar = low[0]
		} else {
			extreme = low[0]
			sar = high[0]
		}

		let accel = accel_step

		for (let i = 1; i < size; ++i) {

			sar = (extreme - sar) * accel + sar

			if (lng) {

				if (i >= 2 && (sar > low[i - 2])) sar = low[i - 2]

				if ((sar > low[i - 1])) sar = low[i - 1]

				if (accel < accel_max && high[i] > extreme) {
					accel += accel_step
					if (accel > accel_max) accel = accel_max
				}

				if (high[i] > extreme) extreme = high[i]

			} else {

				if (i >= 2 && (sar < high[i - 2])) sar = high[i - 2]

				if ((sar < high[i - 1])) sar = high[i - 1]

				if (accel < accel_max && low[i] < extreme) {
					accel += accel_step
					if (accel > accel_max) accel = accel_max
				}

				if (low[i] < extreme) extreme = low[i]
			}

			if ((lng && low[i] < sar) || (!lng && high[i] > sar)) {
				accel = accel_step
				sar = extreme

				lng = !lng

				if (!lng) {
					extreme = low[i]
				} else {
					extreme = high[i]
				}
			}

			output.push(sar)
		}

		return output
	}

	/**
	 * 
	 * @param close 
	 * @param volume 
	 * @param size 
	 * @returns 
	 */
	pvi(
		close: number[], volume: number[],
		size: number = close.length
	) {

		const output: number[] = []

		// if (size <= 0) return "Out of range"

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

	/**
	 * 
	 * @param open 
	 * @param close 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	qstick(
		open: number[],
		close: number[],
		period: number,
		size: number = close.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		const scale = 1.0 / period
	
		let sum = 0
	
		let i;
		for (i = 0; i < period; ++i) {
			sum += close[i] - open[i]
		}
	
		output.push(sum * scale)
	
		for (i = period; i < size; ++i) {
			sum += close[i] - open[i]
			sum -= close[i-period] - open[i-period]
			output.push(sum * scale)
		}
	
		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	roc(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		for (let i = period; i < size; ++i) {
			output.push((source[i] - source[i - period]) / source[i - period])
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	rocr(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		for (let i = period; i < size; ++i) {
			output.push(source[i] / source[i - period])
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	rsi(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		const per = 1.0 / (period)

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		let smooth_up = 0
		let smooth_down = 0

		for (let i = 1; i <= period; ++i) {
			const upward = source[i] > source[i - 1] ? source[i] - source[i - 1] : 0
			const downward = source[i] < source[i - 1] ? source[i - 1] - source[i] : 0
			smooth_up += upward
			smooth_down += downward
		}

		smooth_up /= period
		smooth_down /= period
		output.push(100.0 * (smooth_up / (smooth_up + smooth_down)))

		for (let i = period + 1; i < size; ++i) {
			const upward = (source[i] > source[i - 1] ? source[i] - source[i - 1] : 0)
			const downward = (source[i] < source[i - 1] ? source[i - 1] - source[i] : 0)

			smooth_up = (upward - smooth_up) * per + smooth_up
			smooth_down = (downward - smooth_down) * per + smooth_down

			output.push(100.0 * (smooth_up / (smooth_up + smooth_down)))
		}

		return output
	}

	/**
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	sma(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
		}

		output.push(sum * scale)

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum -= source[i - period]
			output.push(sum * scale)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	stddev(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0
		let sum2 = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]
		}

		let s2s2 = (sum2 * scale - (sum * scale) * (sum * scale))
		if (s2s2 > 0.0) s2s2 = Math.sqrt(s2s2)
		output.push(s2s2)

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]

			sum -= source[i - period]
			sum2 -= source[i - period] * source[i - period]

			let s2s2 = (sum2 * scale - (sum * scale) * (sum * scale))
			if (s2s2 > 0.0) s2s2 = Math.sqrt(s2s2)
			output.push(s2s2)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	stderr(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0
		let sum2 = 0

		const mul = 1.0 / Math.sqrt(period)

		for (let i = 0; i < period; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]
		}

		let s2s2 = (sum2 * scale - (sum * scale) * (sum * scale))
		if (s2s2 > 0.0) s2s2 = Math.sqrt(s2s2)
		output.push(mul * s2s2)

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]

			sum -= source[i - period]
			sum2 -= source[i - period] * source[i - period]

			let s2s2 = (sum2 * scale - (sum * scale) * (sum * scale))
			if (s2s2 > 0.0) s2s2 = Math.sqrt(s2s2)
			output.push(mul * s2s2)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param kperiod 
	 * @param kslow 
	 * @param dperiod 
	 * @param size 
	 * @returns [stoch, stoch_ma]
	 */
	stoch(
		high: number[], low: number[],
		close: number[],
		kperiod: number, kslow: number, dperiod: number,
		size: number = high.length
	) {

		const kper = 1.0 / kslow
		const dper = 1.0 / dperiod

		const stoch: number[] = []
		const stoch_ma: number[] = []

		stoch[(kperiod + kslow + dperiod - 3) - 1] = NaN
		stoch_ma[(kperiod + kslow + dperiod - 3) - 1] = NaN

		// if (kperiod < 1) return "Invalid Options"
		// if (kslow < 1) return "Invalid Options"
		// if (dperiod < 1) return "Invalid Options"
		// if (size <= (kperiod + kslow + dperiod - 3)) return "Out of range"

		let trail = 0
		let maxi = -1
		let mini = -1
		let max = high[0]
		let min = low[0]
		let bar: number

		const k_sum: BufferNewPush = {
			size: kslow,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		const d_sum: BufferNewPush = {
			size: dperiod,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		let j: number
		for (let i = 0; i < size; ++i) {

			if (i >= kperiod) ++trail

			// Maintain highest
			bar = high[i]
			if (maxi < trail) {
				maxi = trail
				max = high[maxi]
				j = trail

				while (++j <= i) {
					bar = high[j]
					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = i
				max = bar
			}

			// Maintain lowest
			bar = low[i]
			if (mini < trail) {
				mini = trail
				min = low[mini]
				j = trail

				while (++j <= i) {
					bar = low[j]
					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = i
				min = bar
			}

			// Calculate it
			const kdiff = (max - min)
			const kfast = kdiff == 0.0 ? 0.0 : 100 * ((close[i] - min) / kdiff)

			// Start ti_buffer_push
			// BUFFER = k_sum
			// VAL    = kfast
			// ti_buffer_push(k_sum, kfast)
			if (k_sum.pushes >= k_sum.size) {
				k_sum.sum -= k_sum.vals[k_sum.index]
			}

			k_sum.sum += kfast
			k_sum.vals[k_sum.index] = kfast
			k_sum.pushes += 1
			k_sum.index = (k_sum.index + 1)
			if (k_sum.index >= k_sum.size) k_sum.index = 0
			// End ti_buffer_push


			if (i >= kperiod - 1 + kslow - 1) {
				const k = k_sum.sum * kper
				// Start ti_buffer_push
				// BUFFER = d_sum
				// VAL    = k
				// ti_buffer_push(d_sum, k)
				if (d_sum.pushes >= d_sum.size) {
					d_sum.sum -= d_sum.vals[d_sum.index]
				}

				d_sum.sum += k
				d_sum.vals[d_sum.index] = k
				d_sum.pushes += 1
				d_sum.index = (d_sum.index + 1)
				if (d_sum.index >= d_sum.size) d_sum.index = 0
				// End ti_buffer_push

				if (i >= kperiod - 1 + kslow - 1 + dperiod - 1) {
					stoch.push(k)
					stoch_ma.push(d_sum.sum * dper)
				}
			}
		}

		return [stoch, stoch_ma]
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	stochrsi(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[(period) * 2 - 2] = NaN

		const per = 1.0 / (period)

		// if (period < 2) return "Invalid Options"
		// if (size <= (period) * 2 - 1) return "Out of range"

		const rsi: BufferNewPush = {
			size: period,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		let smooth_up = 0
		let smooth_down = 0

		for (let i = 1; i <= period; ++i) {
			const upward = source[i] > source[i - 1] ? source[i] - source[i - 1] : 0
			const downward = source[i] < source[i - 1] ? source[i - 1] - source[i] : 0
			smooth_up += upward
			smooth_down += downward
		}

		smooth_up /= period
		smooth_down /= period
		let r = 100.0 * (smooth_up / (smooth_up + smooth_down))

		// Start ti_buffer_push
		// BUFFER = rsi
		// VAL    = r
		// ti_buffer_push(rsi, r)
		if (rsi.pushes >= rsi.size) {
			rsi.sum -= rsi.vals[rsi.index]
		}

		rsi.sum += r
		rsi.vals[rsi.index] = r
		rsi.pushes += 1
		rsi.index = (rsi.index + 1)
		if (rsi.index >= rsi.size) rsi.index = 0
		// End ti_buffer_push

		let min = r
		let max = r
		let mini = 0
		let maxi = 0

		for (let i = period + 1; i < size; ++i) {
			const upward = source[i] > source[i - 1] ? source[i] - source[i - 1] : 0
			const downward = source[i] < source[i - 1] ? source[i - 1] - source[i] : 0

			smooth_up = (upward - smooth_up) * per + smooth_up
			smooth_down = (downward - smooth_down) * per + smooth_down

			r = 100.0 * (smooth_up / (smooth_up + smooth_down))

			if (r > max) {
				max = r;
				maxi = rsi.index
			} else if (maxi == rsi.index) {
				max = r
				for (let j = 0; j < rsi.size; ++j) {
					if (j == rsi.index) continue

					if (rsi.vals[j] > max) {
						max = rsi.vals[j]
						maxi = j
					}
				}
			}

			if (r < min) {
				min = r
				mini = rsi.index
			} else if (mini == rsi.index) {
				min = r
				for (let j = 0; j < rsi.size; ++j) {
					if (j == rsi.index) continue
					if (rsi.vals[j] < min) {
						min = rsi.vals[j]
						mini = j
					}
				}
			}

			// Start ti_buffer_qpush
			// BUFFER = rsi
			// VAL    = r
			// ti_buffer_qpush(rsi, r)
			rsi.vals[rsi.index] = r
			rsi.index = rsi.index + 1
			if (rsi.index >= rsi.size) rsi.index = 0
			// End ti_buffer_qpush

			if (i > period * 2 - 2) {
				const diff = max - min
				if (diff == 0.0) {
					output.push(0.0)
				} else {
					output.push((r - min) / (diff))
				}
			}
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	sum(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
		}

		output.push(sum)

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum -= source[i - period]
			output.push(sum)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	tema(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[((period - 1) * 3) - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= (period - 1) * 3) return "Out of range"

		const per = 2 / (period + 1)
		const per1 = 1.0 - per

		let ema = source[0]
		let ema2 = 0
		let ema3 = 0

		for (let i = 0; i < size; ++i) {
			ema = ema * per1 + source[i] * per
			if (i == period - 1) {
				ema2 = ema
			}

			if (i >= period - 1) {
				ema2 = ema2 * per1 + ema * per
				if (i == (period - 1) * 2) {
					ema3 = ema2
				}

				if (i >= (period - 1) * 2) {
					ema3 = ema3 * per1 + ema2 * per

					if (i >= (period - 1) * 3) {
						output.push(3 * ema - 3 * ema2 + ema3)
					}
				}
			}
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param size
	 * @returns 
	 */
	tr(
		high: number[], low: number[],
		close: number[], size: number = high.length
	) {

		const output: number[] = []
		let truerange: number

		output[0] = high[0] - low[0]

		for (let i = 1; i < size; ++i) {
			// Start CALC_TRUERANGE
			const l = low[i]
			const h = high[i]
			const c = close[i - 1]

			const ych = Math.abs(h - c)
			const ycl = Math.abs(l - c)

			let v = h - l

			if (ych > v) v = ych
			if (ycl > v) v = ycl
			truerange = v
			// End CALC_TRUERANGE
			output.push(truerange)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	trima(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const weights = 1 / ((period % 2) ?
			((period / 2 + 1) * (period / 2 + 1)) :
			((period / 2 + 1) * (period / 2)))

		let weight_sum = 0
		let lead_sum = 0
		let trail_sum = 0

		const lead_period = period % 2 ? period / 2 : period / 2 - 1
		const trail_period = lead_period + 1

		let w = 1

		for (let i = 0; i < period - 1; ++i) {
			weight_sum += source[i] * w

			if (i + 1 > period - lead_period) lead_sum += source[i]
			if (i + 1 <= trail_period) trail_sum += source[i]

			if (i + 1 < trail_period) ++w
			if (i + 1 >= period - lead_period) --w
		}


		let lsi = (period - 1) - lead_period + 1
		let tsi1 = (period - 1) - period + 1 + trail_period
		let tsi2 = (period - 1) - period + 1

		for (let i = period - 1; i < size; ++i) {
			weight_sum += source[i]
			output.push(weight_sum * weights)

			lead_sum += source[i]

			weight_sum += lead_sum;
			weight_sum -= trail_sum;

			lead_sum -= source[lsi++]
			trail_sum += source[tsi1++]
			trail_sum -= source[tsi2++]
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	trix(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[(((period-1)*3)+1) - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= ((period-1)*3)+1) return "Out of range"

		const start = (period * 3) - 2
		const per = 2 / (period + 1)

		let ema1 = source[0]
		let ema2 = 0
		let ema3 = 0

		for (let i = 1; i < start; ++i) {
			ema1 = (source[i] - ema1) * per + ema1

			if (i == period - 1) {
				ema2 = ema1
			} else if (i > period - 1) {
				ema2 = (ema1 - ema2) * per + ema2

				if (i == period * 2 - 2) {
					ema3 = ema2
				} else if (i > period * 2 - 2) {
					ema3 = (ema2 - ema3) * per + ema3
				}
			}
		}

		for (let i = start; i < size; ++i) {
			ema1 = (source[i] - ema1) * per + ema1
			ema2 = (ema1 - ema2) * per + ema2
			const last = ema3
			ema3 = (ema2 - ema3) * per + ema3
			output.push((ema3 - last) / ema3 * 100.0)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	tsf(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		// Start LINEAR_REGRESSION
		// LINEAR_REGRESSION(size, input, period, output, period + 1)
		let x = 0
		let x2 = 0

		let y = 0
		let xy = 0
		// Start INIT()
		const p = (1.0 / (period))
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
			// Start FINAL
			// ## forecast = period + 1
			const a = (y - b * x) * p
			output.push(a + b * (period + 1))
			// Start FINAL

			xy -= y
			y -= (source)[i - (period) + 1]
		}
		// End LINEAR_REGRESSION

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param size 
	 */
	typprice(
		high: number[], low: number[],
		close: number[], size: number = high.length
	) {

		const output: number[] = []

		for (let i = 0; i < size; ++i) {
			output.push((high[i] + low[i] + close[i]) * (1.0 / 3.0))
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param short_period 
	 * @param medium_period 
	 * @param long_period 
	 * @param size 
	 * @returns 
	 */
	ultosc(
		high: number[], low: number[],
		close: number[], short_period: number,
		medium_period: number, long_period: number,
		size: number = high.length
	) {

		const output: number[] = []
		output[long_period - 1] = NaN

		// if (short_period < 1) return "Invalid Options"
		// if (medium_period < short_period) return "Invalid Options"
		// if (long_period < medium_period) return "Invalid Options"
		// if (size <= medium_period) return "Out of range"

		const bp_buf: BufferNewPush = {
			size: long_period,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		const r_buf: BufferNewPush = {
			size: long_period,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		let bp_short_sum = 0
		let bp_medium_sum = 0
		let r_short_sum = 0
		let r_medium_sum = 0

		for (let i = 1; i < size; ++i) {

			// Start MIN
			// MIN(a,b) ((a)<(b)?(a):(b))
			const true_low = ((low[i]) < (close[i - 1]) ? (low[i]) : (close[i - 1]))
			// End MIN

			// Start MAX
			// MAX(a,b) ((a)>(b)?(a):(b))
			const true_high = ((high[i]) > (close[i - 1]) ? (high[i]) : (close[i - 1]))
			// End MAX

			const bp = close[i] - true_low
			const r = true_high - true_low

			bp_short_sum += bp
			bp_medium_sum += bp
			r_short_sum += r
			r_medium_sum += r

			// Start ti_buffer_push
			// BUFFER = bp_buf
			// VAL    = bp
			// ti_buffer_push(bp_buf, bp)
			if (bp_buf.pushes >= bp_buf.size) {
				bp_buf.sum -= bp_buf.vals[bp_buf.index]
			}

			bp_buf.sum += bp
			bp_buf.vals[bp_buf.index] = bp
			bp_buf.pushes += 1
			bp_buf.index = (bp_buf.index + 1)
			if (bp_buf.index >= bp_buf.size) bp_buf.index = 0
			// End ti_buffer_push

			// Start ti_buffer_push
			// BUFFER = r_buf
			// VAL    = r
			// ti_buffer_push(r_buf, r)
			if (r_buf.pushes >= r_buf.size) {
				r_buf.sum -= r_buf.vals[r_buf.index]
			}

			r_buf.sum += r
			r_buf.vals[r_buf.index] = r
			r_buf.pushes += 1
			r_buf.index = (r_buf.index + 1)
			if (r_buf.index >= r_buf.size) r_buf.index = 0
			// End ti_buffer_push

			if (i > short_period) {
				let short_index = bp_buf.index - short_period - 1
				if (short_index < 0) short_index += long_period

				bp_short_sum -= bp_buf.vals[short_index]
				r_short_sum -= r_buf.vals[short_index]

				if (i > medium_period) {
					let medium_index = bp_buf.index - medium_period - 1
					if (medium_index < 0) medium_index += long_period
					bp_medium_sum -= bp_buf.vals[medium_index]
					r_medium_sum -= r_buf.vals[medium_index]
				}
			}

			if (i >= long_period) {
				const first = 4 * bp_short_sum / r_short_sum
				const second = 2 * bp_medium_sum / r_medium_sum
				const third = 1 * bp_buf.sum / r_buf.sum
				const ult = (first + second + third) * 100.0 / 7.0
				output.push(ult)
			}
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	var(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		const scale = 1.0 / period

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0
		let sum2 = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]
		}

		output.push(sum2 * scale - (sum * scale) * (sum * scale))

		for (let i = period; i < size; ++i) {
			sum += source[i]
			sum2 += source[i] * source[i]

			sum -= source[i - period]
			sum2 -= source[i - period] * source[i - period]

			output.push(sum2 * scale - (sum * scale) * (sum * scale))
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	vhf(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		let trail = 1
		let maxi = -1
		let mini = -1

		let max = source[0]
		let min = source[0]
		let bar

		let sum = 0

		let yc = source[0]
		let c: number

		let j: number
		for (let i = 1; i < period; ++i) {
			c = source[i]
			sum += Math.abs(c - yc)
			yc = c
		}

		for (let i = period; i < size; ++i, ++trail) {
			c = source[i]
			sum += Math.abs(c - yc)
			yc = c

			if (i > period) {
				sum -= Math.abs(source[i - period] - source[i - period - 1])
			}

			// Maintain highest
			bar = c
			if (maxi < trail) {
				maxi = trail
				max = source[maxi]
				j = trail

				while (++j <= i) {
					bar = source[j]
					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = i
				max = bar
			}

			// Maintain lowest
			bar = c
			if (mini < trail) {
				mini = trail
				min = source[mini]
				j = trail

				while (++j <= i) {
					bar = source[j]
					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = i
				min = bar
			}

			output.push(Math.abs(max - min) / sum)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param short_period 
	 * @param long_period 
	 * @param alpha 
	 * @param size
	 * @returns 
	 */
	vidya(
		source: number[], short_period: number,
		long_period: number, alpha: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[long_period - 3] = NaN

		const short_div = 1.0 / short_period
		const long_div = 1.0 / long_period

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (long_period < 2) return "Invalid Options"
		// if (alpha < 0.0 || alpha > 1.0) return "Invalid Options"
		// if (size <= long_period - 2) return "Out of range"

		let short_sum = 0
		let short_sum2 = 0

		let long_sum = 0
		let long_sum2 = 0

		for (let i = 0; i < long_period; ++i) {
			long_sum += source[i]
			long_sum2 += source[i] * source[i]

			if (i >= long_period - short_period) {
				short_sum += source[i]
				short_sum2 += source[i] * source[i]
			}
		}

		let val = source[long_period - 2]
		output.push(val)

		if (long_period - 1 < size) {
			const short_stddev = Math.sqrt(short_sum2 * short_div - (short_sum * short_div) * (short_sum * short_div))
			const long_stddev = Math.sqrt(long_sum2 * long_div - (long_sum * long_div) * (long_sum * long_div))
			let k = short_stddev / long_stddev
			if (k != k) k = 0; /* In some conditions it works out that we take the sqrt(-0.0), which gives NaN.
                                  That implies that k should be zero. */
			k *= alpha
			val = (source[long_period - 1] - val) * k + val
			output.push(val)
		}

		for (let i = long_period; i < size; ++i) {
			long_sum += source[i]
			long_sum2 += source[i] * source[i]

			short_sum += source[i]
			short_sum2 += source[i] * source[i]

			long_sum -= source[i - long_period]
			long_sum2 -= source[i - long_period] * source[i - long_period]

			short_sum -= source[i - short_period]
			short_sum2 -= source[i - short_period] * source[i - short_period]

			const short_stddev = Math.sqrt(short_sum2 * short_div - (short_sum * short_div) * (short_sum * short_div))
			const long_stddev = Math.sqrt(long_sum2 * long_div - (long_sum * long_div) * (long_sum * long_div))
			let k = short_stddev / long_stddev
			if (k != k) k = 0
			k *= alpha
			val = (source[i] - val) * k + val

			output.push(val)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	volatility(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		const scale = 1.0 / period
		const annual = Math.sqrt(252) /* Multiplier, number of trading days in year. */

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		let sum = 0
		let sum2 = 0

		for (let i = 1; i <= period; ++i) {
			// Start Change()
			const c = (source[i] / source[i - 1] - 1.0)
			// End Change()
			sum += c
			sum2 += c * c
		}

		output.push(Math.sqrt(sum2 * scale - (sum * scale) * (sum * scale)) * annual)

		for (let i = period + 1; i < size; ++i) {
			// Start Change()
			const c = (source[i] / source[i - 1] - 1.0)
			// End Change()
			sum += c
			sum2 += c * c

			// Start Change()
			const cp = (source[i - period] / source[i - period - 1] - 1.0)
			// Start Change()
			sum -= cp
			sum2 -= cp * cp

			output.push(Math.sqrt(sum2 * scale - (sum * scale) * (sum * scale)) * annual)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param short_period 
	 * @param long_period 
	 * @param size
	 * @returns 
	 */
	vosc(
		source: number[], short_period: number,
		long_period: number, size: number = source.length
	) {

		const output: number[] = []
		output[long_period - 2] = NaN

		const short_div = 1.0 / short_period
		const long_div = 1.0 / long_period

		// if (short_period < 1) return "Invalid Options"
		// if (long_period < short_period) return "Invalid Options"
		// if (size <= long_period - 1) return "Out of range"

		let short_sum = 0
		let long_sum = 0

		for (let i = 0; i < long_period; ++i) {
			if (i >= (long_period - short_period)) {
				short_sum += source[i]
			}
			long_sum += source[i]
		}

		const savg = short_sum * short_div
		const lavg = long_sum * long_div
		output.push(100.0 * (savg - lavg) / lavg)

		for (let i = long_period; i < size; ++i) {
			short_sum += source[i]
			short_sum -= source[i - short_period]

			long_sum += source[i]
			long_sum -= source[i - long_period]

			const savg = short_sum * short_div
			const lavg = long_sum * long_div
			output.push(100.0 * (savg - lavg) / lavg)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param volume 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	vwma(
		source: number[], volume: number[],
		period: number, size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let sum = 0
		let vsum = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i] * volume[i]
			vsum += volume[i]
		}

		output.push(sum / vsum)

		for (let i = period; i < size; ++i) {
			sum += source[i] * volume[i]
			sum -= source[i - period] * volume[i - period]
			vsum += volume[i]
			vsum -= volume[i - period]

			output.push(sum / vsum)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param size 
	 * @returns 
	 */
	wad(
		high: number[], low: number[],
		close: number[], size: number = high.length
	) {

		// if (size <= 1) return "Out of range"

		const output: number[] = []
		output[0] = NaN

		let sum = 0
		let yc = close[0]

		for (let i = 1; i < size; ++i) {
			const c = close[i]

			if (c > yc) {
				// Start MIN
				// MIN(a,b) ((a)<(b)?(a):(b))
				sum += c - ((yc) < (low[i]) ? (yc) : (low[i]))
				// End MIN()
			} else if (c < yc) {
				// Start MAX
				// MAX(a,b) ((a)>(b)?(a):(b))
				sum += c - ((yc) > (high[i]) ? (yc) : (high[i]))
				// End MAX
			} else {
				/* No change */
			}

			output.push(sum)

			yc = close[i]
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param size 
	 */
	wcprice(
		high: number[], low: number[],
		close: number[], size: number = high.length
	) {

		const output: number[] = []

		for (let i = 0; i < size; ++i) {
			output.push((high[i] + low[i] + close[i] + close[i]) * 0.25)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	wilders(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const per = 1.0 / (period)

		let sum = 0

		for (let i = 0; i < period; ++i) {
			sum += source[i]
		}

		let val = sum / period
		output.push(val)

		for (let i = period; i < size; ++i) {
			val = (source[i] - val) * per + val
			output.push(val)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size
	 * @returns 
	 */
	willr(
		high: number[], low: number[],
		close: number[], period: number,
		size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let trail = 0
		let maxi = -1
		let mini = -1
		let max = high[0]
		let min = low[0]
		let bar: number

		let j: number
		for (let i = period - 1; i < size; ++i, ++trail) {

			// Maintain highest
			bar = high[i]
			if (maxi < trail) {
				maxi = trail
				max = high[maxi]
				j = trail

				while (++j <= i) {
					bar = high[j];
					if (bar >= max) {
						max = bar
						maxi = j
					}
				}

			} else if (bar >= max) {
				maxi = i
				max = bar
			}


			// Maintain lowest
			bar = low[i]
			if (mini < trail) {
				mini = trail
				min = low[mini]
				j = trail

				while (++j <= i) {
					bar = low[j];
					if (bar <= min) {
						min = bar
						mini = j
					}
				}

			} else if (bar <= min) {
				mini = i
				min = bar
			}


			const highlow = (max - min)
			const r = highlow == 0.0 ? 0.0 : -100 * ((max - close[i]) / highlow)
			output.push(r)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	wma(
		source: number[], period: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const weights = period * (period + 1) / 2

		let sum = 0
		let weight_sum = 0

		for (let i = 0; i < period - 1; ++i) {
			weight_sum += source[i] * (i + 1)
			sum += source[i]
		}

		for (let i = period - 1; i < size; ++i) {
			weight_sum += source[i] * period
			sum += source[i]

			output.push(weight_sum / weights)

			weight_sum -= sum
			sum -= source[i - period + 1]
		}

		return output
	}

	/**
	 * 
	 * @param input 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	zlema(
		input: number[], period: number,
		size: number = input.length
	) {
		
		const lag = Math.floor((period - 1) / 2)
	
		const output: number[] = []
		output[((period - 2) / 2) - 2] = NaN
		// (period - 1) / 2 - 1
	
		const per = 2 / (period + 1)
	
		let val = input[lag-1]
		output.push(val)
	
		let i: number;
		for (i = lag; i < size; ++i) {
			const c = input[i];
			const l = input[i-lag];
	
			val = ((c + (c-l))-val) * per + val;
			output.push(val)
		}

		return output
	}
	// ################## Beta

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size 
	 * @returns [upper_band, lower_band, middle_point]
	 */
	abands(
		high: number[], low: number[],
		close: number[], period: number,
		size: number = high.length
	) {

		const upper_band: number[] = []
		const lower_band: number[] = []
		const middle_point: number[] = []

		upper_band[period - 2] = NaN
		lower_band[period - 2] = NaN
		middle_point[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const per = 1 / period

		const buffer_high: BufferNewPush = {
			size: period,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}
		const buffer_low: BufferNewPush = {
			size: period,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		let close_sum = 0

		for (let i = 0; i < period; ++i) {
			// Start MULT
			// MULT(i) (4. * (high[i] - low[i]) / (high[i] + low[i]))
			const mult = (4. * (high[i] - low[i]) / (high[i] + low[i]))
			// End MULT

			const high_val = (1. + mult) * high[i]

			// Start ti_buffer_push
			// BUFFER = buffer_high
			// VAL    = high_val
			// ti_buffer_push(buffer_high, high_val)
			if (buffer_high.pushes >= buffer_high.size) {
				buffer_high.sum -= buffer_high.vals[buffer_high.index]
			}

			buffer_high.sum += high_val
			buffer_high.vals[buffer_high.index] = high_val
			buffer_high.pushes += 1
			buffer_high.index = (buffer_high.index + 1)
			if (buffer_high.index >= buffer_high.size) buffer_high.index = 0
			// End ti_buffer_push

			const low_val = (1. - mult) * low[i]

			// Start ti_buffer_push
			// BUFFER = buffer_low
			// VAL    = low_val
			// ti_buffer_push(buffer_low, low_val)
			if (buffer_low.pushes >= buffer_low.size) {
				buffer_low.sum -= buffer_low.vals[buffer_low.index]
			}

			buffer_low.sum += low_val
			buffer_low.vals[buffer_low.index] = low_val
			buffer_low.pushes += 1
			buffer_low.index = (buffer_low.index + 1)
			if (buffer_low.index >= buffer_low.size) buffer_low.index = 0
			// End ti_buffer_push

			close_sum += close[i]
		}

		upper_band.push(buffer_high.sum * per)
		lower_band.push(buffer_low.sum * per)
		middle_point.push(close_sum * per)

		for (let i = period; i < size; ++i) {
			// Start MULT
			const mult = (4. * (high[i] - low[i]) / (high[i] + low[i]))
			// End MULT

			const high_val = (1. + mult) * high[i]
			// Start ti_buffer_push
			// BUFFER = buffer_high
			// VAL    = high_val
			// ti_buffer_push(buffer_high, high_val)
			if (buffer_high.pushes >= buffer_high.size) {
				buffer_high.sum -= buffer_high.vals[buffer_high.index]
			}

			buffer_high.sum += high_val
			buffer_high.vals[buffer_high.index] = high_val
			buffer_high.pushes += 1
			buffer_high.index = (buffer_high.index + 1)
			if (buffer_high.index >= buffer_high.size) buffer_high.index = 0
			// End ti_buffer_push

			const low_val = (1. - mult) * low[i]

			// Start ti_buffer_push
			// BUFFER = buffer_low
			// VAL    = low_val
			// ti_buffer_push(buffer_low, low_val)
			if (buffer_low.pushes >= buffer_low.size) {
				buffer_low.sum -= buffer_low.vals[buffer_low.index]
			}

			buffer_low.sum += low_val
			buffer_low.vals[buffer_low.index] = low_val
			buffer_low.pushes += 1
			buffer_low.index = (buffer_low.index + 1)
			if (buffer_low.index >= buffer_low.size) buffer_low.index = 0
			// End ti_buffer_push

			close_sum += close[i] - close[i - period]

			upper_band.push(buffer_high.sum * per)
			lower_band.push(buffer_low.sum * per)
			middle_point.push(close_sum * per)
		}

		return [upper_band, lower_band, middle_point]
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param offset 
	 * @param sigma 
	 * @param size
	 * @returns 
	 */
	alma(
		source: number[], period: number,
		offset: number, sigma: number,
		size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// validate options
		// if (period < 1) return "Invalid Options"
		// if (sigma <= 0) return "Invalid Options"
		// if ((offset < 0) || (offset > 1)) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const weights: number[] = []

		const m = Math.floor(offset * (period - 1))
		const s = period / sigma

		let norm = 0

		for (let i = 0; i < period; i++) {
			weights[i] = Math.exp(-1 * Math.pow(i - m, 2) / (2 * Math.pow(s, 2)))
			norm += weights[i]
		}

		for (let i = 0; i < period; i++) {
			weights[i] /= norm
		}

		for (let i = period - 1; i < size; i++) {
			let sum = 0
			for (let j = 0; j < period; j++) {
				sum += source[i - period + j + 1] * weights[j]
			}
			output.push(sum)
		}

		return output
	}

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
	ce(
		high: number[], low: number[],
		close: number[], period: number, coef: number,
		size: number = high.length
	) {

		const ce_high: number[] = []
		const ce_low: number[] = []

		ce_high[period - 2] = NaN
		ce_low[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let atr = high[0] - low[0]

		let truerange: number
		let val: number

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
	cmf(
		high: number[], low: number[],
		close: number[], volume: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		// #define CHAIKIN_AD(i) (high[i] - low[i] ? volume[i] * ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) : 0.)

		let period_volume = 0
		let period_ad_sum = 0

		for (let i = 0; i < period - 1; ++i) {
			// Start CHAIKIN_AD
			period_ad_sum += (high[i] - low[i] ? volume[i] * ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) : 0.)
			// End CHAIKIN_AD

			period_volume += volume[i]
		}

		for (let i = period - 1; i < size; ++i) {
			// Start CHAIKIN_AD
			period_ad_sum += (high[i] - low[i] ? volume[i] * ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i]) : 0.)
			// End CHAIKIN_AD
			period_volume += volume[i]

			output.push(period_ad_sum / period_volume)

			// Start CHAIKIN_AD
			// i = i-period+1
			period_ad_sum -= (high[i - period + 1] - low[i - period + 1] ? volume[i - period + 1] * ((close[i - period + 1] - low[i - period + 1]) - (high[i - period + 1] - close[i - period + 1])) / (high[i - period + 1] - low[i - period + 1]) : 0.)
			// End CHAIKIN_AD
			period_volume -= volume[i - period + 1]
		}

		return output
	}

	/**
	 * @ChatGPT
	 * @param data 
	 * @param period1 
	 * @param period2
	 * @returns 
	 */
	copp(data: number[], period1: number, period2: number) {

		const roc1 = new Array(data.length);
		const roc2 = new Array(data.length);
		const coppock = new Array(data.length);

		for (let i = 0; i < data.length; i++) {
			if (i < period1 - 1) {
				roc1[i] = null;
			} else {
				roc1[i] = (data[i] - data[i - period1]) / data[i - period1] * 100;
			}
			if (i < period2 - 1) {
				roc2[i] = null;
			} else {
				roc2[i] = (data[i] - data[i - period2]) / data[i - period2] * 100;
			}
			coppock[i] = (roc1[i] + roc2[i]) * 10;
		}

		return coppock;
	}

	/**
	 * @param highs 
	 * @param lows 
	 * @param period
	 * @returns [upper, middle, lower]
	 */
	dc(highs: number[], lows: number[], period: number) {
		
		const upper: number[] = []
		const lower: number[] = []
		const middle: number[] = []

		upper[period - 2] = NaN
		lower[period - 2] = NaN
		middle[period - 2] = NaN
	
		for (let i = period - 1; i < highs.length; i++) {
			upper.push(Math.max(...highs.slice(i - period + 1, i + 1)))
			lower.push(Math.min(...lows.slice(i - period + 1, i + 1)))
			middle.push((upper[upper.length - 1] + lower[lower.length - 1]) / 2)
		}
	
		return [upper, middle, lower]
	}

	/**
	 * 
	 * @param close 
	 * @param volume 
	 * @param period 
	 * @param size 
	 * @returns 
	 */
	fi(
		close: number[], volume: number[],
		period: number, size: number = close.length
	) {

		const output: number[] = []
		output[0] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= 1) return "Out of range"

		const per = 2. / (period + 1.)

		let ema = volume[1] * (close[1] - close[0])

		for (let i = 1; i < size; ++i) {
			ema = (volume[i] * (close[i] - close[i - 1]) - ema) * per + ema
			output.push(ema)
		}

		return output
	}

	/**
	 * @TODO
	 */
	ikhts() { }

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param multiple 
	 * @param size 
	 * @returns [kc_lower, kc_middle, kc_upper]
	 */
	kc(
		high: number[], low: number[],
		close: number[], period: number,
		multiple: number, size: number = high.length
	) {

		const kc_lower: number[] = []
		const kc_middle: number[] = []
		const kc_upper: number[] = []

		// if (period < 1) return "Invalid Options"

		const per = 2 / (period + 1)

		let price_ema = close[0]
		let tr_ema = high[0] - low[0]

		kc_lower.push(price_ema - multiple * tr_ema)
		kc_middle.push(price_ema)
		kc_upper.push(price_ema + multiple * tr_ema)

		let truerange = 0
		for (let i = 1; i < size; ++i) {
			price_ema = (close[i] - price_ema) * per + price_ema

			// Start CALC_TRUERANGE
			const l = low[i]
			const h = high[i]
			const c = close[i - 1]

			const ych = Math.abs(h - c)
			const ycl = Math.abs(l - c)

			let v = h - l

			if (ych > v) v = ych
			if (ycl > v) v = ycl
			truerange = v
			// End CALC_TRUERANGE

			tr_ema = (truerange - tr_ema) * per + tr_ema

			kc_lower.push(price_ema - multiple * tr_ema)
			kc_middle.push(price_ema)
			kc_upper.push(price_ema + multiple * tr_ema)
		}

		return [kc_lower, kc_middle, kc_upper]
	}

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
	 * @returns [kst, kst_signal]
	 */
	kst(
		source: number[],
		roc1: number, roc2: number, roc3: number, roc4: number,
		ma1: number, ma2: number, ma3: number, ma4: number,
		size: number = source.length
	) {

		const kst: number[] = []
		const kst_signal: number[] = []

		kst[roc4 - 1] = NaN
		kst_signal[roc4 - 1] = NaN

		// if(!(roc1 < roc2 && roc2 < roc3 && roc3 < roc4)) return "Invalid Options"

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

		// #define ROC(idx, period) ((real[idx] - real[idx-period]) / real[idx-period])

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

	/**
	 * @TODO
	 */
	mama() { }

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param size 
	 * @returns [pbands_lower, pbands_upper]
	 */
	pbands(
		high: number[], low: number[],
		close: number[], period: number,
		size: number = high.length
	) {

		const pbands_lower: number[] = []
		const pbands_upper: number[] = []

		pbands_lower[period - 2] = NaN
		pbands_upper[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let y_sum = 0
		let xy_sum = 0

		const x_sum = period * (period + 1) / 2
		const xsq_sum = period * (period + 1) * (2 * period + 1) / 6

		let i: number
		for (i = 0; i < period; ++i) {
			xy_sum += close[i] * (i + 1)
			y_sum += close[i]
		}

		--i

		const b = (xy_sum / period - x_sum / period * y_sum / period) / (xsq_sum / period - (x_sum / period) * (x_sum / period))

		let the_max = high[i]

		for (let j = 1; j < period; ++j) {
			if (the_max < high[i - j] + j * b) {
				the_max = high[i - j] + j * b
			}
		}

		let the_min = low[i]
		for (let j = 1; j < period; ++j) {
			if (the_min > low[i - j] + j * b) {
				the_min = low[i - j] + j * b
			}
		}

		pbands_upper.push(the_max)
		pbands_lower.push(the_min)

		++i

		for (; i < size; ++i) {
			xy_sum += -y_sum + close[i] * period;
			y_sum += -close[i - period] + close[i]

			const b = (xy_sum / period - x_sum / period * y_sum / period) / (xsq_sum / period - (x_sum / period) * (x_sum / period));

			let the_max = high[i]
			for (let j = 1; j < period; ++j) {
				if (the_max < high[i - j] + j * b) {
					the_max = high[i - j] + j * b
				}
			}

			let the_min = low[i]
			for (let j = 1; j < period; ++j) {
				if (the_min > low[i - j] + j * b) {
					the_min = low[i - j] + j * b
				}
			}

			pbands_lower.push(the_min)
			pbands_upper.push(the_max)
		}

		return [pbands_lower, pbands_upper]
	}

	/**
	 * @TODO
	 */
	pc() { }

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param ema_period 
	 * @param size 
	 * @returns 
	 */
	pfe(
		source: number[], period: number,
		ema_period: number, size: number = source.length
	) {

		const output: number[] = []
		output[period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period) return "Out of range"

		// #define SIGN(expr) ((expr) > 0 ? 1. : -1.)
		// #define EMA_NEXT(val) (((val) - ema) * per + ema)


		const per = 2 / (ema_period + 1)

		const denom: BufferNewPush = {
			size: period,
			index: 0,
			pushes: 0,
			sum: 0,
			vals: []
		}

		let i: number
		for (i = 1; i < period; ++i) {
			// Start ti_buffer_push
			// BUFFER = denom
			// VAL    = Math.sqrt(Math.pow(source[i] - source[i-1], 2) + 1.)
			// ti_buffer_push(denom, sqrt(pow(real[i] - real[i-1], 2) + 1.))
			if (denom.pushes >= denom.size) {
				denom.sum -= denom.vals[denom.index]
			}

			denom.sum += Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
			denom.vals[denom.index] = Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
			denom.pushes += 1
			denom.index = (denom.index + 1)
			if (denom.index >= denom.size) denom.index = 0
			// End ti_buffer_push
		}

		// Start ti_buffer_push
		// BUFFER = denom
		// VAL    = Math.sqrt(Math.pow(source[i] - source[i-1], 2) + 1.)
		// ti_buffer_push(denom, sqrt(pow(real[i] - real[i-1], 2) + 1.))
		if (denom.pushes >= denom.size) {
			denom.sum -= denom.vals[denom.index]
		}

		denom.sum += Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
		denom.vals[denom.index] = Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
		denom.pushes += 1
		denom.index = (denom.index + 1)
		if (denom.index >= denom.size) denom.index = 0
		// End ti_buffer_push

		// Start SIGN
		// let numer = SIGN(source[i] - source[i-period]) * 100. * Math.sqrt(Math.pow(source[i] - source[i-period], 2) + 100.)
		const numer = ((source[i] - source[i - period]) > 0 ? 1 : -1) * 100 * Math.sqrt(Math.pow(source[i] - source[i - period], 2) + 100)
		// End SIGN

		let ema = numer / denom.sum
		output.push(ema)

		for (i = period + 1; i < size; ++i) {
			// Start ti_buffer_push
			// BUFFER = denom
			// VAL    = Math.sqrt(Math.pow(source[i] - source[i-1], 2) + 1.)
			// ti_buffer_push(denom, sqrt(pow(real[i] - real[i-1], 2) + 1.))
			if (denom.pushes >= denom.size) {
				denom.sum -= denom.vals[denom.index]
			}

			denom.sum += Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
			denom.vals[denom.index] = Math.sqrt(Math.pow(source[i] - source[i - 1], 2) + 1)
			denom.pushes += 1
			denom.index = (denom.index + 1)
			if (denom.index >= denom.size) denom.index = 0
			// End ti_buffer_push

			// Start SIGN
			// let numer2 = SIGN(real[i] - real[i-(int)period]) * 100. * sqrt(pow(real[i] - real[i-(int)period], 2) + 100.)
			const numer2 = ((source[i] - source[i - period]) > 0 ? 1 : -1) * 100 * Math.sqrt(Math.pow(source[i] - source[i - period], 2) + 100)
			// End SIGN

			// Start EMA_NEXT
			// ema = EMA_NEXT(numer2 / denom->sum)
			ema = (((numer2 / denom.sum) - ema) * per + ema)
			// End EMA_NEXT

			output.push(ema)
		}

		return output
	}

	/**
	 * 
	 * @param high 
	 * @param low 
	 * @param close 
	 * @param period 
	 * @param ema_period 
	 * @param size
	 * @returns 
	 */
	posc(
		high: number[], low: number[],
		close: number[], period: number,
		ema_period: number, size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (ema_period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		let y_sum = 0
		let xy_sum = 0
		let ema: number

		const x_sum = period * (period + 1) / 2.
		const xsq_sum = period * (period + 1) * (2 * period + 1) / 6.

		let i: number
		for (i = 0; i < period; ++i) {
			xy_sum += close[i] * (i + 1)
			y_sum += close[i]
		}

		--i

		const b = (xy_sum / period - x_sum / period * y_sum / period) / (xsq_sum / period - (x_sum / period) * (x_sum / period))

		let the_max = high[i]
		for (let j = 1; j < period; ++j) {
			if (the_max < high[i - j] + j * b) {
				the_max = high[i - j] + j * b
			}
		}
		let the_min = low[i]
		for (let j = 1; j < period; ++j) {
			if (the_min > low[i - j] + j * b) {
				the_min = low[i - j] + j * b
			}
		}

		ema = (close[i] - the_min) / (the_max - the_min) * 100
		output.push(ema)

		++i

		for (; i < size; ++i) {
			xy_sum += -y_sum + close[i] * period
			y_sum += -close[i - period] + close[i]

			const b = (xy_sum / period - x_sum / period * y_sum / period) / (xsq_sum / period - (x_sum / period) * (x_sum / period))

			let the_max = high[i]
			for (let j = 1; j < period; ++j) {
				if (the_max < high[i - j] + j * b) {
					the_max = high[i - j] + j * b
				}
			}

			let the_min = low[i]
			for (let j = 1; j < period; ++j) {
				if (the_min > low[i - j] + j * b) {
					the_min = low[i - j] + j * b
				}
			}

			const osc = (close[i] - the_min) / (the_max - the_min) * 100
			ema = (osc - ema) * 2 / (1 + ema_period) + ema
			output.push(ema)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param lookback_period 
	 * @param size 
	 * @returns 
	 */
	rmi(
		source: number[], period: number,
		lookback_period: number, size: number = source.length
	) {

		const output: number[] = []
		output[lookback_period - 1] = NaN

		// if (period < 1) return "Invalid Options"
		// if (lookback_period < 1) return "Invalid Options"
		// if (size <= lookback_period) return "Out of range"

		let gains_ema: number
		let losses_ema: number

		let i = lookback_period
		gains_ema = ((0) > (source[i] - source[i - lookback_period]) ? (0) : (source[i] - source[i - lookback_period]))
		losses_ema = ((0) > (source[i - lookback_period] - source[i]) ? (0) : (source[i - lookback_period] - source[i]))
		++i

		output.push(gains_ema / (gains_ema + losses_ema) * 100)

		for (; i < size; ++i) {
			gains_ema = ((0) > (source[i] - source[i - lookback_period]) ? (0) : (source[i] - source[i - lookback_period]) - gains_ema) * 2. / (1 + period) + gains_ema
			losses_ema = ((0) > (source[i - lookback_period] - source[i]) ? (0) : (source[i - lookback_period] - source[i]) - losses_ema) * 2. / (1 + period) + losses_ema
			output.push(gains_ema / (gains_ema + losses_ema) * 100)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param beta 
	 * @param size 
	 * @returns 
	 */
	rmta(
		source: number[], period: number,
		beta: number, size: number = source.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"
		// if (size <= period - 1) return "Out of range"

		const alpha = 1 - beta
		let b = (1 - alpha) * source[0] + source[0]
		let rmta = (1 - alpha) * source[0] + alpha * (source[0] + b)

		for (let i = 1; i < period - 1; ++i) {
			const next_b = (1 - alpha) * b + source[i]
			rmta = (1 - alpha) * rmta + alpha * (source[i] + next_b - b)
			b = next_b
		}

		for (let i = period - 1; i < size; ++i) {
			const next_b = (1 - alpha) * b + source[i]
			rmta = (1. - alpha) * rmta + alpha * (source[i] + next_b - b)
			b = next_b
			output.push(rmta)
		}

		return output
	}

	/**
	 * 
	 * @param source 
	 * @param period 
	 * @param stddev_period 
	 * @param size 
	 * @returns 
	 */
	rvi(
		source: number[], sma_period: number,
		stddev_period: number, size: number = source.length
	) {

		const output: number[] = []
		output[stddev_period - 2] = NaN

		// if (sma_period < 1) return "Invalid Options"
		// if (stddev_period < 1) return "Invalid Options"
		// if (size <= stddev_period-1) return "Out of range"

		let y_sum = 0
		let xy_sum = 0

		const x_sum = stddev_period * (stddev_period + 1) / 2
		const xsq_sum = stddev_period * (stddev_period + 1) * (2 * stddev_period + 1) / 6

		let gains_ema = 0
		let losses_ema = 0

		let i = 0
		for (; i < stddev_period; ++i) {
			xy_sum += source[i] * (i + 1)
			y_sum += source[i]
		}

		--i;
		const b = (xy_sum / stddev_period - x_sum / stddev_period * y_sum / stddev_period) / (xsq_sum / stddev_period - (x_sum / stddev_period) * (x_sum / stddev_period))
		const a = y_sum / stddev_period - b * x_sum / stddev_period

		const higher = source[i] - (a + b * stddev_period)
		if (higher > 0) {
			gains_ema = higher * higher / stddev_period
		} else {
			losses_ema = higher * higher / stddev_period
		}

		if (gains_ema + losses_ema == 0) {
			output.push(50)
		} else {
			output.push(gains_ema / (gains_ema + losses_ema) * 100)
		}
		++i

		for (; i < size; ++i) {
			xy_sum += -y_sum + source[i] * stddev_period
			y_sum += -source[i - stddev_period] + source[i]

			const b = (xy_sum / stddev_period - x_sum / stddev_period * y_sum / stddev_period) / (xsq_sum / stddev_period - (x_sum / stddev_period) * (x_sum / stddev_period))
			const a = y_sum / stddev_period - b * x_sum / stddev_period

			const higher = source[i] - (a + b * stddev_period)

			if (higher > 0) {
				gains_ema = (higher * higher / stddev_period - gains_ema) * 2. / (sma_period + 1) + gains_ema
			} else {
				losses_ema = (higher * higher / stddev_period - losses_ema) * 2. / (sma_period + 1) + losses_ema
			}

			if (gains_ema + losses_ema == 0) {
				output.push(50)
			} else {
				output.push(gains_ema / (gains_ema + losses_ema) * 100)
			}
		}

		return output
	}

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
	smi(
		high: number[], low: number[],
		close: number[], q_period: number,
		r_period: number, s_period: number,
		size: number = high.length
	) {

		const output: number[] = []
		output[q_period - 2] = NaN

		// if (q_period < 1 || r_period < 1 || s_period < 1) {
		//     return "Invalid Options"
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

	/**
	 * 
	 * @param source 
	 * @param y_period 
	 * @param z_period 
	 * @param size 
	 * @returns 
	 */
	tsi(
		source: number[], y_period: number,
		z_period: number, size: number = source.length
	) {

		const output: number[] = []
		output[0] = NaN

		// if (y_period < 1 || z_period < 1) {
		//     return "Invalid Options"
		// }

		let progress = -1

		let price = 0
		let y_ema_num = 0
		let z_ema_num = 0
		let y_ema_den = 0
		let z_ema_den = 0

		let i = 0
		for (; i < size && progress == -1; ++i, ++progress) {
			price = source[i]
		}

		for (; i < size && progress == 0; ++i, ++progress) {
			z_ema_num = y_ema_num = source[i] - price
			z_ema_den = y_ema_den = Math.abs(source[i] - price)

			output.push(100 * (z_ema_den ? z_ema_num / z_ema_den : 0))

			price = source[i]
		}

		for (; i < size; ++i, ++progress) {
			y_ema_num = ((source[i] - price) - y_ema_num) * 2. / (1. + y_period) + y_ema_num
			y_ema_den = ((Math.abs(source[i] - price)) - y_ema_den) * 2 / (1 + y_period) + y_ema_den

			z_ema_num = (y_ema_num - z_ema_num) * 2 / (1 + z_period) + z_ema_num
			z_ema_den = (y_ema_den - z_ema_den) * 2 / (1 + z_period) + z_ema_den


			output.push(100 * (z_ema_den ? z_ema_num / z_ema_den : 0))

			price = source[i]
		}

		return output
	}

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
	vwap(
		high: number[], low: number[],
		close: number[], volume: number[],
		period: number, size: number = high.length
	) {

		const output: number[] = []
		output[period - 2] = NaN

		// if (period < 1) return "Invalid Options"

		let progress = -period + 1

		let num = 0
		let den = 0

		let i = 0
		for (; i < size && progress < 1; ++i, ++progress) {
			num += (high[i] + low[i] + close[i]) / 3 * volume[i]
			den += volume[i]
		}

		if (i > 0 && progress == 1) {
			output.push(num / den)
		}

		for (; i < size; ++i, ++progress) {
			num += (high[i] + low[i] + close[i]) / 3 * volume[i]
				- (high[i - period] + low[i - period] + close[i - period]) / 3. * volume[i - period]
			den += volume[i] - volume[i - period]

			output.push(num / den)
		}

		return output
	}
}