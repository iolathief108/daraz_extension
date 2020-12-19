const Path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const devMode = true

module.exports = () => {

    return {
        devtool: devMode ? 'inline-source-map' : false,
        mode: devMode ? 'development' : 'production',
        entry: {
            content: Path.resolve(__dirname, './src/content/content.ts'),
            background: Path.resolve(__dirname, './src/background/background.ts'),
        },
        output: {
            path: Path.join(__dirname, './dist/'),
            filename: '[name].js',
        },
        devServer: {
            host: '127.0.0.1',
            publicPath: '/',
            contentBase: Path.resolve(__dirname, './src'),
            port: 8080,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },

        plugins: [
            new CopyPlugin({
                patterns: [
                    {from: Path.resolve(__dirname, './extension'), to: Path.resolve(__dirname, './dist')},
                ],
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
            }),
        ],
    }
}
