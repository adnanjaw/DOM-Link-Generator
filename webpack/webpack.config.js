const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src/js");

module.exports = {
    mode: 'production',
    entry: {
        options: path.join(srcDir, 'options.ts'),
        background: path.join(srcDir, 'background.ts'),
        "content-script": path.join(srcDir, 'content-script.ts'),
    },
    output: {
        path: path.join(__dirname, "../dist/src/js"),
        filename: "[name].js",
        clean: true
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: "../../", context: "public"}],
        }),
        new CopyPlugin({
            patterns: [{from: ".", to: "../assets", context: "src/assets"}],
        }),
        new CopyPlugin({
            patterns: [{from: ".", to: "../html", context: "src/html"}],
        }),
    ],
};