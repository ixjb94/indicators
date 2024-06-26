module.exports = {
    mode: "production",
    entry: {
        "browser": "./src/index.ts",
        "browser-indicators": "./src/core/indicators.ts",
        "browser-indicators-sync": "./src/core/indicatorsSync.ts",
        "browser-indicatorsNormalized": "./src/core/indicatorsNormalized.ts",
        "browser-indicatorsNormalized-sync": "./src/core/indicatorsNormalizedSync.ts",
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist",
        library: "indicators",
        libraryTarget: "umd",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
};