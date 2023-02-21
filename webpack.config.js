module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "my-library.js",
        path: __dirname + "/dist",
        library: "MyLibrary",
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