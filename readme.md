<!-- [![CodeFactor](https://www.codefactor.io/repository/github/ixjb94/indicators/badge)](https://www.codefactor.io/repository/github/ixjb94/indicators) -->
![npm version](https://img.shields.io/npm/v/@ixjb94/indicators)
![npm size](https://img.shields.io/bundlephobia/min/@ixjb94/indicators/latest)
![npm downloads](https://img.shields.io/npm/dt/@ixjb94/indicators)
![last commit](https://img.shields.io/github/last-commit/ixjb94/indicators)


![logo](https://raw.githubusercontent.com/ixjb94/indicators/master/images/bar-graph.png "logo")

### Supports
Browser, ES6, CommonJS

### About
Fastest Technical Indicators written in typescript

### Benchmark and Tests  
All indicators are `1.3x` to `100x` faster than available indicators on github, and heavily tested    
Benchmark cases: @ixjb94/indicators, node-talib, tulipnode, technicalindicators, pandas_ta    

### Installation
```
npm install @ixjb94/indicators
```

### Usage NodeJS
```js
import { Indicators } from "@ixjb94/indicators"

// OR
const { Indicators } = require("@ixjb94/indicators")
```

### Usage Browser
index.html example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<title>My Indicators</title>
</head>
<body>
	<script src="./node_modules/@ixjb94/indicators/dist/indicators-browser.js"></script>
	<script>
		const library = indicators
		const ta = new library.Indicators()
		const {close, open} = new library.Mock()

		ta.ema(close, 20).then(data => console.log(data))
	</script>
</body>
</html>

```
Note: you can move files from node_modules to somewhere else you want to like dist, public, etc.

OR you can use unpkg:
```
https://unpkg.com/@ixjb94/indicators@latest/dist/indicators-browser.js
```

### Indicators Contains
Indicators contains this classes:    
1- Indicators: `new Indicators()`    
2- IndicatorsNormalized: `new IndicatorsNormalized()`    
3- Mock: `new Mock()`     

Q: What is the difference between `Indicators` and `IndicatorsNormalized`?    
A: `IndicatorsNormalized` will fill the gap for you, example (SMA 3 with 5 closes):
```
[NaN, NaN, 1, 2, 3]
```

But the `Indicators` will give you the SMA3 with 5 closes like this:    
```
[1, 2, 3]
```

Note: Please note that the performance between `IndicatorsNormalized` and `Indicators` are the same,    
so it's better to use `IndicatorsNormalized`.

### Examples
**Note: Everything is`Promised`  so you need to do  `.then`  or  `await`**
```js
let ta = new Indicators()

ta.sma(close, 20)
ta.rsi(close, 14)
```

### Mock Data
There is also a Mock class that contains `small` (Array: 77) and `big`(Array: 14,400) mock data.    
Example:    
```js
import { Mock } from "@ixjb94/indicators"

let {
    open, high, low, close, volume,
    smallOpen, smallHigh, smallLow, smallClose, smallVolume
} = new Mock()
```

### Types & Intellisense & Browser Support
![types](https://raw.githubusercontent.com/ixjb94/indicators/master/images/types-intel.png "types")
![browser](https://raw.githubusercontent.com/ixjb94/indicators/master/images/browser-support.png "browser-support")


### Indicators
✅ = Available and fastest    
❌ = Indicator is not available    
🔄 = Developing...    
Compared to:    
node-talib, tulipnode, technicalindicators, pandas_ta

| Identifier      | Indicator Name                        | @ixjb94/indicators |
| --------------- | ------------------------------------- | ------------------ |
| ad              | Accumulation/Distribution Line        | ✅                  |
| adosc           | Accumulation/Distribution Oscillator  | ✅                  |
| adx             | Average Directional Movement Index    | ✅                  |
| adxr            | Average Directional Movement Rating   | ✅                  |
| ao              | Awesome Oscillator                    | ✅                  |
| apo             | Absolute Price Oscillator             | ✅                  |
| aroon           | Aroon                                 | ✅                  |
| aroonosc        | Aroon Oscillator                      | ✅                  |
| atr             | Average True Range                    | ✅                  |
| avgprice        | Average Price                         | ✅                  |
| bbands          | Bollinger Bands                       | ✅                  |
| bop             | Balance of Power                      | ✅                  |
| cci             | Commodity Channel Index               | ✅                  |
| cmo             | Chande Momentum Oscillator            | ✅                  |
| cosh            | Vector Hyperbolic Cosine              | ✅                  |
| crossany        | Crossany                              | ✅                  |
| crossover       | Crossover                             | ✅                  |
| cvi             | Chaikins Volatility                   | ✅                  |
| decay           | Linear Decay                          | ✅                  |
| dema            | Double Exponential Moving Average     | ✅                  |
| di              | Directional Indicator                 | ✅                  |
| dm              | Directional Movement                  | ✅                  |
| dpo             | Detrended Price Oscillator            | ✅                  |
| dx              | Directional Movement Index            | ✅                  |
| edecay          | Exponential Decay                     | ✅                  |
| ema             | Exponential Moving Average            | ✅                  |
| emv             | Ease of Movement                      | ✅                  |
| fisher          | Fisher Transform                      | ✅                  |
| fosc            | Forecast Oscillator                   | ✅                  |
| hma             | Hull Moving Average                   | ✅                  |
| kama            | Kaufman Adaptive Moving Average       | ✅                  |
| kvo             | Klinger Volume Oscillator             | ✅                  |
| lag             | Lag                                   | ✅                  |
| linreg          | Linear Regression                     | ✅                  |
| linregintercept | Linear Regression Intercept           | ✅                  |
| linregslope     | Linear Regression Slope               | ✅                  |
| macd            | Moving Average Convergence/Divergence | ✅                  |
| marketfi        | Market Facilitation Index             | ✅                  |
| mass            | Mass Index                            | ✅                  |
| max             | Maximum In Period                     | ✅                  |
| md              | Mean Deviation Over Period            | ✅                  |
| medprice        | Median Price                          | ✅                  |
| mfi             | Money Flow Index                      | ✅                  |
| min             | Minimum In Period                     | ✅                  |
| mom             | Momentum                              | ✅                  |
| natr            | Normalized Average True Range         | ✅                  |
| nvi             | Negative Volume Index                 | ✅                  |
| obv             | On Balance Volume                     | ✅                  |
| ppo             | Percentage Price Oscillator           | ✅                  |
| psar            | Parabolic SAR                         | ✅                  |
| pvi             | Positive Volume Index                 | ✅                  |
| qstick          | Qstick                                | ✅                  |
| roc             | Rate of Change                        | ✅                  |
| rocr            | Rate of Change Ratio                  | ✅                  |
| rsi             | Relative Strength Index               | ✅                  |
| sma             | Simple Moving Average                 | ✅                  |
| stddev          | Standard Deviation Over Period        | ✅                  |
| stderr          | Standard Error Over Period            | ✅                  |
| stoch           | Stochastic Oscillator                 | ✅                  |
| stochrsi        | Stochastic RSI                        | ✅                  |
| sum             | Sum Over Period                       | ✅                  |
| tema            | Triple Exponential Moving Average     | ✅                  |
| tr              | True Range                            | ✅                  |
| trima           | Triangular Moving Average             | ✅                  |
| trix            | Trix                                  | ✅                  |
| tsf             | Time Series Forecast                  | ✅                  |
| typprice        | Typical Price                         | ✅                  |
| ultosc          | Ultimate Oscillator                   | ✅                  |
| var             | Variance Over Period                  | ✅                  |
| vhf             | Vertical Horizontal Filter            | ✅                  |
| vidya           | Variable Index Dynamic Average        | ✅                  |
| volatility      | Annualized Historical Volatility      | ✅                  |
| vosc            | Volume Oscillator                     | ✅                  |
| vwma            | Volume Weighted Moving Average        | ✅                  |
| wad             | Williams Accumulation/Distribution    | ✅                  |
| wcprice         | Weighted Close Price                  | ✅                  |
| wilders         | Wilders Smoothing                     | ✅                  |
| willr           | Williams %R                           | ✅                  |
| wma             | Weighted Moving Average               | ✅                  |
| zlema           | Zero-Lag Exponential Moving Average   | ✅                  |
| abands          |                                       | ✅                  |
| alma            | Arnaud Legoux Moving Average          | ✅                  |
| ce              | Chandelier Exit                       | ✅                  |
| cmf             | Chaikin money flow                    | ✅                  |
| copp            | Coppock Curve                         | ❌                  |
| dc              | Donchian Channels                     | ✅🔄               |
| fi              | Force index                           | ✅                  |
| ikhts           |                                       | ❌                  |
| kc              | Keltner Channels                      | ✅                  |
| kst             | Know Sure Thing                       | ✅                  |
| mama            | MESA Adaptive Moving Average          | ❌                  |
| pbands          |                                       | ✅                  |
| pc              |                                       | ❌                  |
| pfe             | Polarized Fractal Efficiency          | ✅                  |
| posc            |                                       | ✅                  |
| rmi             | Relative Momentum Index               | ✅                  |
| rmta            | Recursive Moving Trend Average        | ✅                  |
| rvi             | Relative Vigor Index                  | ✅                  |
| smi             | Stochastic Momentum Index             | ✅                  |
| tsi             | True Strength Index                   | ✅                  |
| vwap            | Volume-Weighted Average Price         | ✅                  |

### Icon by
```
https://www.flaticon.com/free-icon/bar-graph_3501061
Author: Freepik
Website: https://www.freepik.com
https://www.flaticon.com/authors/freepik
```