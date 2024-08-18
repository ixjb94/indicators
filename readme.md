[![CodeFactor](https://www.codefactor.io/repository/github/ixjb94/indicators/badge)](https://www.codefactor.io/repository/github/ixjb94/indicators)
![npm version](https://img.shields.io/npm/v/@ixjb94/indicators)
![npm size](https://img.shields.io/bundlephobia/min/@ixjb94/indicators/latest)
![npm downloads](https://img.shields.io/npm/dt/@ixjb94/indicators)
![last commit](https://img.shields.io/github/last-commit/ixjb94/indicators)


![logo](https://raw.githubusercontent.com/ixjb94/indicators/master/images/bar-graph.png "logo")

### [Version Info](https://github.com/ixjb94/indicators/issues/19)

### Supports
Browser, ES6, CommonJS, NodeJS, Bun, Svelte, React, Angular, etc.

### About
Fastest Technical Indicators written in TypeScript    

- Zero Dependencies: @ixjb94/Indicators is built from the ground up to be self-contained, with no external dependencies.    
- No Internal Function Calls: Each Method in the library operates independently.     

### Tests (Jest)
All of the indicators data have been tested with TradingView data and other Libraries.    
You can find few in [./tests](https://github.com/ixjb94/indicators/tree/master/tests) folder.    
(Or you can run: npm test)    
Note: All data have been tested with at least last 3 (tail) of TradingView's data.    
Data Window: DOGEUSDT-4h-2023-10 (October)     
Data Source: [Binance Futures ::: Binance Vision]( https://data.binance.vision/data/futures/um/monthly/klines/DOGEUSDT/4h/)    
![Tests](https://raw.githubusercontent.com/ixjb94/indicators/master/images/tests.png "Tests")    

### Comparison with TradingView (EMA 10)
[Indicators Data Test](https://github.com/ixjb94/indicators-data-test)    

### Benchmark
[See full Benchmark info](https://github.com/ixjb94/indicators-benchmark)    

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

	<!--
		PLEASE NOTE: you probably just need one of these
		- browser.js
		- browser-indicators.js
		- browser-indicators-sync.js
		- browser-indicators-extract.js

		or extracted versions like this:
		- ./ema.js | ./sma.js | ./rsi.js
	-->

	<!-- all versions -->
	<script src="./node_modules/@ixjb94/indicators/dist/browser.js"></script>

	<!-- indicators -->
	<script src="./node_modules/@ixjb94/indicators/dist/browser-indicators.js"></script>

	<!-- extracted (not in a class) -->
	<script src="./node_modules/@ixjb94/indicators/dist/browser-indicators-extract.js"></script>
	
	<!-- sync indicators -->
	<script src="./node_modules/@ixjb94/indicators/dist/browser-indicators-sync.js"></script>

	<!-- extracted indicators -->
	<script src="./node_modules/@ixjb94/indicators/dist/core/extract/ema.js"></script>
	<script src="./node_modules/@ixjb94/indicators/dist/core/extract/sma.js"></script>
	<script src="./node_modules/@ixjb94/indicators/dist/core/extract/rsi.js"></script>
	<!-- ... -->

	<!-- how to use class based -->
	<script>
		const library = indicators
		const ta = new library.Indicators()

		ta.ema(close, 20).then(data => console.log(data))
	</script>

	<!-- how to use extracted versions -->
    <script>
        const close = [1, 2, 3, 4, 5, 6]
        ema(close, 3).then(result => {
            console.log(result)
            // output: [1, 1.5, 2.25, 3.125, 4.0625, 5.03125]
        })
    </script>

	<!-- how to use extracted version (browser-indicators-extract.js) -->
	<script src="./node_modules/@ixjb94/indicators/dist/browser-indicators-extract.js"></script>
	<script>
		const { ema, sma } = indicators
		ema([1,2,3,4,5,6], 3).then(d => console.log(d))
	</script>
</body>
</html>

```
Note: you can move files from node_modules to somewhere else you want to like dist, public, etc.

OR you can use unpkg:
```
https://unpkg.com/@ixjb94/indicators@latest/dist/browser.js
https://unpkg.com/@ixjb94/indicators@latest/dist/browser-indicators.js
https://unpkg.com/@ixjb94/indicators@latest/dist/browser-indicators-sync.js
https://unpkg.com/@ixjb94/indicators@latest/dist/browser-indicators-extract.js

OR
https://unpkg.com/@ixjb94/indicators@latest/dist/core/extract/ema.js
https://unpkg.com/@ixjb94/indicators@latest/dist/core/extract/sma.js
https://unpkg.com/@ixjb94/indicators@latest/dist/core/extract/rsi.js
// ... and others

see the full list:
https://unpkg.com/browse/@ixjb94/indicators@1.2.3/dist/core/extract/
```

### Indicators Consists Of
Indicators consists of these classes:    
1- Indicators: `new Indicators()`    
2- IndicatorsSync: `new IndicatorsSync()`    
3- Or you can use then directly without using classes    

### Examples
**Note: Everything is`Promised`  so you need to do  `.then`  or  `await`**    
unless you use `Sync` versions.    
```js
let ta = new Indicators()

ta.sma(close, 20)
ta.rsi(close, 14)
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
| crossany        | Crossany                              | ✅                  |
| crossover       | Crossover                             | ✅                  |
| crossunder      | Crossunder                            | ✅                  |
| crossOverNumber | Crossover a number                    | ✅                  |
| crossUnderNumber| Crossunder a number                   | ✅                  |
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