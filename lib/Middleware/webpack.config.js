var path = require('path');
var webpack = require("webpack");
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    mode: 'production',
    entry: "./src/index.ts",
    output: {
        library: 'XENDApi',
        path: path.resolve(__dirname, 'build'),
        filename: "libwidgetinfo.js",
        libraryTarget: 'var'
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
        ]
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd:['./patch-build.sh']
        })
    ],
}