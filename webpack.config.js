module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "indicators-browser.js",
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
}