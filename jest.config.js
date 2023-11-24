module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testPathIgnorePatterns: ["<rootDir>/tests/data.ts"],
}
