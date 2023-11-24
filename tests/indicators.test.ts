import { Indicators, IndicatorsNormalized } from "../src"
import { Data } from "./data"

const ta = new Indicators()
const tan = new IndicatorsNormalized()

// Extract OHLCV
const open: number[] = []
const high: number[] = []
const low: number[] = []
const close: number[] = []
const volume: number[] = []

for (let index = 0; index < Data.length; index++) {
    const obj = Data[index]
    open.push(obj.open)
    high.push(obj.high)
    low.push(obj.low)
    close.push(obj.close)
    volume.push(obj.volume)
}

class Helper {
    constructor(private array: number[]) {}

    // Last N(3) Members
    lastN(n: number): this {
        if (n >= this.array.length) {
            return this
        } else {
            this.array = this.array.slice(this.array.length - n)
            return this
        }
    }

    // Last N(3) in Reverse Order
    lastNReverse(n: number): this {
        if (n >= this.array.length) {
            this.array = this.array.slice().reverse()
            return this
        } else {
            this.array = this.array.slice(this.array.length - n).reverse()
            return this
        }
    }

    // Precision
    removeFloat(precision: number): this {
        this.array = this.array.map((num) => parseFloat(num.toFixed(precision)))
        return this
    }

    getResult(): number[] {
        return this.array
    }
}

// ################################# Test
describe("Indicators vs TradingView", () => {

    it("Average True Range ::: atr 14", async () => {
        const indicator = await ta.atr(high, low, close, 14)
        const result = new Helper(indicator).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.00168, 0.00174, 0.00176])
    })

    it("Bollinger Bands Lower ::: bbands 20, 2", async () => {
        const indicator = await ta.bbands(close, 20, 2)
        const result = new Helper(indicator[0]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06756, 0.06764, 0.06773])
    })

    it("Bollinger Bands Middle ::: bbands 20, 2", async () => {
        const indicator = await ta.bbands(close, 20, 2)
        const result = new Helper(indicator[1]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06894, 0.06898, 0.06903])
    })

    it("Bollinger Bands Upper ::: bbands 20, 2", async () => {
        const indicator = await ta.bbands(close, 20, 2)
        const result = new Helper(indicator[2]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.07032, 0.07033, 0.07032])
    })

    it("Commodity Channel Index ::: cci 20", async () => {
        const indicator = await ta.cci(high ,low, close, 20)
        const result = new Helper(indicator).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([-94.20992, -170.04688, -183.57488])
    })
    
    it("Donchian Channels Upper ::: dc 20", async () => {
        const indicator = await ta.dc(high, low, 20)
        const result = new Helper(indicator[0]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.07093, 0.07093, 0.07093])
    })

    it("Donchian Channels Middle ::: dc 20", async () => {
        const indicator = await ta.dc(high, low, 20)
        const result = new Helper(indicator[1]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06821, 0.06821, 0.06821])
    })

    it("Donchian Channels Lower ::: dc 20", async () => {
        const indicator = await ta.dc(high, low, 20)
        const result = new Helper(indicator[2]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06549, 0.06549, 0.06549])
    })

    it("Exponential Moving Average ::: ema 10", async () => {
        const indicator = await ta.ema(close, 10)
        const result = new Helper(indicator).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06872, 0.06882, 0.06896])
    })

    it("Hull Moving Average ::: hma 10", async () => {
        const indicator = await ta.hma(close, 10)
        const result = new Helper(indicator).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06806, 0.0684, 0.06885])
    })

    it("Rate of Change ::: roc 20", async () => {
        const indicator = await ta.roc(close, 9)
        const result = new Helper(indicator).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([-0.01897, -0.00656, -0.02082])
    })

    it("Simple Moving Average ::: sma 20", async () => {
        const indicator = await ta.sma(close, 20)
        const result = new Helper(indicator).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([0.06894, 0.06898, 0.06903])
    })

    it("Stochastic Oscillator (Base) ::: stoch 14, 1 , 3", async () => {
        const indicator = await ta.stoch(high ,low, close, 14, 1 , 3)
        const result = new Helper(indicator[0]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([50.91912, 49.44853, 32.35294])
    })

    it("Stochastic Oscillator (Moving Average) ::: stoch 14, 1 , 3", async () => {
        const indicator = await ta.stoch(high ,low, close, 14, 1 , 3)
        const result = new Helper(indicator[1]).lastNReverse(3).removeFloat(5).getResult()
        expect(result).toEqual([44.2402, 57.68242, 55.03796])
    })
})